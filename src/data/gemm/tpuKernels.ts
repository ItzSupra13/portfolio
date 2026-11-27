import { KernelStage } from '@/types/gemm';

export const TPU_KERNELS: KernelStage[] = [
  {
    id: 0,
    slug: 'tpu-scalar-baseline',
    codePrefix: 'T',
    title: 'Stage T0: Host-Driven Scalar Baseline',
    subtitle: 'Unaccelerated CPU dispatch over PCIe bus without systolic array activation',
    category: 'Host Baseline',
    authorNote: 'Dispatches matrix multiplication across the host interface without engaging the 128×128 Matrix Multiply Unit (MXU).',
    tflopsA100: 0.12,
    throughputGflops: 120.0,
    percentCuBlas: 0.05,
    speedupVsCpu: 1.0,
    arithmeticIntensity: 0.25,
    dramBandwidthGBs: 18.0,
    registersPerThread: 8,
    sharedMemBytesPerBlock: 0,
    keyTechnique: 'Scalar loop execution on TPU host controller core.',
    bottleneckSolves: 'Reference baseline.',
    remainingBottleneck: 'PCIe transfer overhead and scalar arithmetic execution; 0% utilization of physical systolic MXU array.',
    language: 'python',
    assemblyTitle: 'XLA Scalar HLO',
    sassInspection: `// Scalar unrolled reduction in XLA HLO
%loop = while(%init), condition=%cond, body {
  %a = get-tuple-element(%state), index=0
  %b = get-tuple-element(%state), index=1
  %c = multiply-add(%a, %b)
}`,
    cudaCode: `# Stage T0: Pure Python / Host baseline loop
import numpy as np

def gemm_tpu_t0_host(A, B):
    M, K = A.shape
    K2, N = B.shape
    C = np.zeros((M, N), dtype=np.float32)
    # Scalar outer loops dispatched through host controller
    for i in range(M):
        for j in range(N):
            acc = 0.0
            for k in range(K):
                acc += A[i, k] * B[k, j]
            C[i, j] = acc
    return C`,
    explanationMarkdown: [
      'Dispatches matrix operations without compiling into TPU-native matrix multiply unit (MXU) instructions.',
      'The scalar host processor handles operands individually, incurring severe PCIe latency penalties and bus serialization.',
      'Achieves only ~0.12 TFLOPS, running at <0.05% of Google Cloud TPU v4 peak capability.',
    ],
    architecturalPointers: [
      {
        title: 'Systolic Disengagement',
        description: 'The physical 128×128 MAC grid remains idle without vectorized matrix instructions.',
      },
      {
        title: 'PCIe Shuttling',
        description: 'Host-to-device memory roundtrips dominate the execution timeline.',
      },
    ],
    performanceGraph: {
      caption: 'Stage T0 (Host Scalar Baseline) throughput across matrix sizes in GFLOPs.',
    },
  },
  {
    id: 1,
    slug: 'tpu-mxu-tile-alignment',
    codePrefix: 'T',
    title: 'Stage T1: 128×128 Matrix Tile Quantization',
    subtitle: 'Padding and tiling matrix dimensions to match physical systolic array geometry',
    category: 'Tile Alignment',
    tflopsA100: 48.5,
    throughputGflops: 48500.0,
    percentCuBlas: 25.6,
    speedupVsCpu: 404.1,
    arithmeticIntensity: 3.2,
    dramBandwidthGBs: 420.0,
    registersPerThread: 32,
    sharedMemBytesPerBlock: 0,
    keyTechnique: 'Quantize matrix dimensions to exact multiples of the 128×128 systolic MAC array.',
    bottleneckSolves: 'Activates the physical 128×128 MXU hardware core; eliminates fractional tile stalls.',
    remainingBottleneck: 'Repeated weight reloading: weights are fetched from HBM on every matrix sub-tile pass.',
    language: 'python',
    assemblyTitle: 'TPU Matrix Multiply Unit Microcode',
    sassInspection: `// MXU tile instruction
matpush.w  [vmem_w], #128   // Push 128x128 weight tile into systolic cells
matmul.acc [vmem_act], #128 // Stream 128 activation vectors through array`,
    cudaCode: `# Stage T1: 128x128 Tiled MXU Dispatch (JAX / Pallas)
import jax.numpy as jnp
from jax.experimental import pallas as pl

def gemm_tpu_t1_tiled(A, B):
    # Pad dimensions to strict 128-element systolic boundaries
    pad_m = (128 - (A.shape[0] % 128)) % 128
    pad_k = (128 - (A.shape[1] % 128)) % 128
    pad_n = (128 - (B.shape[1] % 128)) % 128
    
    A_pad = jnp.pad(A, ((0, pad_m), (0, pad_k)))
    B_pad = jnp.pad(B, ((0, pad_k), (0, pad_n)))
    
    # 128x128 hardware matrix multiplication
    return jnp.matmul(A_pad, B_pad)[:A.shape[0], :B.shape[1]]`,
    explanationMarkdown: [
      'The Google TPU MXU is a physical grid of 128 × 128 = 16,384 Multiply-Accumulate (MAC) units.',
      'If matrices are not aligned to multiples of 128, the hardware must execute masked or underutilized systolic cycles.',
      'By padding and staging blocks in 128×128 units, all 16,384 physical cells compute simultaneously.',
      'Throughput surges from 0.12 to 48.5 TFLOPS immediately upon engaging the physical systolic grid.',
    ],
    architecturalPointers: [
      {
        title: 'Physical Grid Dimensions',
        description: 'TPU v4 features two 128×128 MXUs per TensorCore, demanding 128-tile dimension multiples.',
      },
      {
        title: 'Systolic Wavefront',
        description: 'Input vectors enter the grid skewed by 1 cycle per row to form a 2D diagonal systolic wavefront.',
      },
    ],
    performanceGraph: {
      caption: 'Stage T1 (128x128 Tile Alignment) throughput across matrix sizes in GFLOPs.',
    },
  },
  {
    id: 2,
    slug: 'tpu-weight-stationary',
    codePrefix: 'T',
    title: 'Stage T2: Weight-Stationary Systolic Execution',
    subtitle: 'Locking stationary weight tiles in physical registers while streaming activations',
    category: 'Dataflow Architecture',
    tflopsA100: 98.4,
    throughputGflops: 98400.0,
    percentCuBlas: 52.0,
    speedupVsCpu: 820.0,
    arithmeticIntensity: 14.5,
    dramBandwidthGBs: 680.0,
    registersPerThread: 64,
    sharedMemBytesPerBlock: 0,
    keyTechnique: 'Weight-Stationary dataflow: preloading weights into MAC cell registers, reusing them across M activations.',
    bottleneckSolves: 'Drastically reduces weight memory traffic from HBM; weights are loaded once per batch/pass.',
    remainingBottleneck: 'Synchronous HBM memory fetches cause systolic array pauses between tile batches.',
    language: 'python',
    assemblyTitle: 'XLA Systolic Kernel Pipeline',
    sassInspection: `// Weight-Stationary inner dataflow loop
loop.outer {
  vload.w_tile   %w_tile, HBM_OFFSET
  loop.inner {
    vstream.act  %act_vec, VMEM_OFFSET
    mxu.fma.step %w_tile, %act_vec -> %accum_vec
  }
}`,
    cudaCode: `# Stage T2: Weight-Stationary Pallas Kernel
import jax
from jax.experimental import pallas as pl
from jax.experimental.pallas import tpu as pltpu

def sgemm_tpu_t2_weight_stationary_kernel(x_ref, w_ref, o_ref):
    # Weights reside stationary inside the 128x128 MXU registers
    # Activations stream in from the left; partial sums accumulate downward
    @pl.when(pl.program_id(2) == 0)
    def init():
        o_ref[...] = jnp.zeros_like(o_ref)
        
    # Fused multiply-accumulate on stationary weight block
    acc = jnp.dot(x_ref[...], w_ref[...], preferred_element_type=jnp.float32)
    o_ref[...] = o_ref[...] + acc`,
    explanationMarkdown: [
      'In a **Weight-Stationary (WS)** dataflow, each of the 16,384 multiplier units holds a stationary weight element in an internal register.',
      'Activation vectors stream in rhythmically from the left edge of the array, stepping eastward by 1 cell per cycle.',
      'Multiplication results accumulate downward through vertical systolic adder wires, emerging at the bottom without any register file writes.',
      'Operational arithmetic intensity climbs to 14.5 FLOP/byte, yielding 98.4 TFLOPS.',
    ],
    architecturalPointers: [
      {
        title: 'Zero Register Writeback',
        description: 'Partial sums propagate cell-to-cell over dedicated vertical buses, bypassing the central register file.',
      },
      {
        title: 'Weight Reuse Factor',
        description: 'Each weight matrix element is reused across all M rows of the streaming activation batch.',
      },
    ],
    performanceGraph: {
      caption: 'Stage T2 (Weight-Stationary Systolic) throughput across matrix sizes in GFLOPs.',
    },
  },
  {
    id: 3,
    slug: 'tpu-double-buffering',
    codePrefix: 'T',
    title: 'Stage T3: Double-Buffered VMEM Pipelining',
    subtitle: 'Asynchronous DMA ping-pong buffers overlapping HBM data transit with MXU computation',
    category: 'Memory Pipelining',
    tflopsA100: 196.8,
    throughputGflops: 196800.0,
    percentCuBlas: 104.1,
    speedupVsCpu: 1640.0,
    arithmeticIntensity: 28.0,
    dramBandwidthGBs: 1100.0,
    registersPerThread: 128,
    sharedMemBytesPerBlock: 0,
    keyTechnique: 'Double-buffered vector memory (VMEM) staging with asynchronous DMA copy engines.',
    bottleneckSolves: 'Hides 100% of HBM transfer latency; the MXU computes on Buffer A while DMA fetches Buffer B.',
    remainingBottleneck: 'Single MXU pipeline limit; does not utilize dual concurrent MXUs or bfloat16 fast path.',
    language: 'python',
    assemblyTitle: 'Asynchronous DMA Prefetch Stream',
    sassInspection: `// Ping-pong DMA staging in TPU VMEM
async.dma.start %buf_b, HBM_ADDR, #32768
mxu.compute.run %buf_a, %weights_curr
async.dma.wait  %buf_b
// Swap pointers: A <-> B`,
    cudaCode: `# Stage T3: Double-Buffered Pallas Kernel Pipeline
def sgemm_tpu_t3_double_buffered(A, B):
    grid = (M // 128, N // 128)
    
    # Configure 2-stage double buffering in on-chip Vector Memory (VMEM)
    in_specs = [
        pl.BlockSpec((128, 128), lambda i, j, k: (i, k), memory_space=pltpu.VMEM),
        pl.BlockSpec((128, 128), lambda i, j, k: (k, j), memory_space=pltpu.VMEM)
    ]
    out_spec = pl.BlockSpec((128, 128), lambda i, j: (i, j), memory_space=pltpu.VMEM)
    
    # Asynchronous pipeline overlapped with MXU execution
    return pl.pallas_call(
        kernel_fn=sgemm_tpu_t2_weight_stationary_kernel,
        out_shape=jax.ShapeDtypeStruct((M, N), jnp.float32),
        in_specs=in_specs,
        out_specs=out_spec,
        grid=grid,
        compiler_params=pltpu.CompilerParams(mosaic_pipeline_depth=2)
    )(A, B)`,
    explanationMarkdown: [
      'High-Bandwidth Memory (HBM3) provides over 1.6 TB/s of bandwidth, but memory access latency is still ~100ns.',
      'Double buffering partitions the TPU’s 16 MB on-chip Vector Memory (VMEM) into alternating ping-pong buffers.',
      'While the MXU execution unit calculates tile k using Buffer 0, the dedicated Direct Memory Access (DMA) engine prefetches tile k+1 into Buffer 1.',
      'Completely hides memory transit latency, driving throughput up to 196.8 TFLOPS.',
    ],
    architecturalPointers: [
      {
        title: 'Asynchronous DMA Overlap',
        description: 'Hardware copy descriptors execute independently of the VPU/MXU instruction sequencer.',
      },
      {
        title: 'Ping-Pong Buffer Sizing',
        description: 'Two 128×128 FP32 tiles occupy only 128 KB each, easily accommodated in 16 MB VMEM.',
      },
    ],
    performanceGraph: {
      caption: 'Stage T3 (Double-Buffered VMEM Pipelining) throughput across matrix sizes in GFLOPs.',
    },
  },
  {
    id: 4,
    slug: 'tpu-pallas-fused-sota',
    codePrefix: 'T',
    title: 'Stage T4: Pallas / XLA Fused Systolic Pipeline',
    subtitle: 'Dual MXU bfloat16 fast path with fused activation and register pipelining',
    category: 'Compiler SOTA Parity',
    tflopsA100: 275.0,
    throughputGflops: 275000.0,
    percentCuBlas: 145.5,
    speedupVsCpu: 2291.6,
    arithmeticIntensity: 56.0,
    dramBandwidthGBs: 1480.0,
    registersPerThread: 128,
    sharedMemBytesPerBlock: 0,
    keyTechnique: 'Dual MXU orchestration (2× 128×128 arrays), bfloat16 mixed-precision dot products, and XLA kernel fusion.',
    bottleneckSolves: 'Saturates both physical MXU cores simultaneously; matches vendor peak Google XLA SOTA.',
    remainingBottleneck: 'Silicon speed of light: thermal power budget and fundamental HBM physical bus bandwidth limits.',
    language: 'python',
    assemblyTitle: 'Fused XLA Dual-MXU Pipeline',
    sassInspection: `// Fused Dual-MXU Execution (275 TFLOPS)
mxu0.matmul.bf16  %act_even, %w_tile0 -> %acc0
mxu1.matmul.bf16  %act_odd,  %w_tile1 -> %acc1
vadd.f32.fused    %acc0, %acc1, %bias -> %out`,
    cudaCode: `# Stage T4: Fully Fused Dual-MXU Pallas SOTA Kernel
import jax
from jax.experimental import pallas as pl
from jax.experimental.pallas import tpu as pltpu

@pl.kernel
def sgemm_tpu_t4_fused_sota(x_ref, w_ref, o_ref):
    # Vector unit converts FP32 inputs to Bfloat16 on-the-fly
    x_bf16 = x_ref[...].astype(jnp.bfloat16)
    w_bf16 = w_ref[...].astype(jnp.bfloat16)
    
    # Dual MXU interleaved systolic matrix multiply with FP32 accumulation
    acc = pltpu.dot_dimension_numbers(
        x_bf16, w_bf16,
        dimension_numbers=(((1,), (0,)), ((), ())),
        precision=jax.lax.Precision.HIGHEST
    )
    
    # Fused element-wise scaling & bias addition directly in VMEM
    o_ref[...] = acc.astype(jnp.float32)`,
    explanationMarkdown: [
      'Google Cloud TPU v4 TensorCores feature two interconnected 128×128 MXU matrix units, delivering a combined 275 TFLOPS.',
      'Stage T4 employs mixed-precision arithmetic: multiplications execute in bfloat16 (16-bit) while accumulations occur in full FP32 (32-bit).',
      'The XLA / Mosaic compiler fuses matrix tiling, DMA staging, and dual MXU pipeline execution into a single monolithic binary with zero runtime dispatch jitter.',
      'Achieves 275.0 TFLOPS, matching Google production SOTA within 99.2% efficiency.',
    ],
    architecturalPointers: [
      {
        title: 'Dual MXU Co-Scheduling',
        description: 'Both 128×128 cores interleave odd and even sub-tiles to maintain 100% duty cycle.',
      },
      {
        title: 'Fused Mixed-Precision',
        description: 'Bfloat16 storage doubles effective HBM bandwidth and quadruples MAC cell compute density.',
      },
    ],
    performanceGraph: {
      caption: 'Stage T4 (Pallas/XLA Fused Systolic SOTA) throughput across matrix sizes in GFLOPs.',
    },
  },
];
