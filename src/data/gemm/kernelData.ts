import { KernelStage, GpuSpec } from '@/types/gemm';
import { ProcessingUnit } from '@/types/unit';
import { CPU_KERNELS } from './cpuFuncs';
import { TPU_KERNELS } from './tpuKernels';

export const GPU_SPECS: Record<string, GpuSpec> = {
  a100: {
    id: 'a100',
    name: 'NVIDIA A100',
    architecture: 'Ampere',
    fp32Tflops: 19.5,
    memoryBandwidthGBs: 1555,
    smCount: 108,
    sharedMemPerSMKB: 164,
    registersPerSM: 65536,
    l2CacheMB: 40,
    cuBlasPeakTflops: 18.9,
  },
  h100: {
    id: 'h100',
    name: 'NVIDIA H100 SXM5',
    architecture: 'Hopper',
    fp32Tflops: 67,
    memoryBandwidthGBs: 3350,
    smCount: 132,
    sharedMemPerSMKB: 256,
    registersPerSM: 65536,
    l2CacheMB: 50,
    cuBlasPeakTflops: 989,
  },
  t4: {
    id: 't4',
    name: 'NVIDIA Tesla T4',
    architecture: 'Turing',
    fp32Tflops: 8.1,
    memoryBandwidthGBs: 320,
    smCount: 40,
    sharedMemPerSMKB: 64,
    registersPerSM: 65536,
    l2CacheMB: 4,
    cuBlasPeakTflops: 6.2,
  },
};

export const KERNEL_STAGES: KernelStage[] = [
//   {
//     id: 0,
//     slug: 'cpu-naive',
//     title: 'Kernel 0: Naive Triple-Loop CPU Baseline',
//     subtitle: 'Standard O(N³) procedural implementation on host CPU',
//     category: 'CPU Baseline',
//     authorNote: 'The baseline against which all GPU speedups are measured. Illustrates memory stride issues and single-core serial execution.',
//     tflopsA100: 0.028,
//     tflops4090: 0.045,
//     tflopsV100: 0.024,
//     percentCuBlas: 0.15,
//     speedupVsCpu: 1.0,
//     arithmeticIntensity: 0.25,
//     dramBandwidthGBs: 42.0,
//     registersPerThread: 0,
//     sharedMemBytesPerBlock: 0,
//     keyTechnique: 'Simple nested 3-loop accumulation without vectorization or parallelization.',
//     bottleneckSolves: 'None (reference baseline).',
//     remainingBottleneck: 'Single core, poor L1 cache locality on matrix B (column traversal with stride N causes frequent cache evictions).',
//     cudaCode: `// Host CPU reference implementation (O(N^3))
// void sgemm_cpu_naive(
//     int M, int N, int K,
//     float alpha,
//     const float* A,
//     const float* B,
//     float beta,
//     float* C) 
// {
//     for (int i = 0; i < M; ++i) {
//         for (int j = 0; j < N; ++j) {
//             float sum = 0.0f;
//             // Inner reduction loop over dimension K
//             for (int k = 0; k < K; ++k) {
//                 // A[i][k] has good locality (row-major)
//                 // B[k][j] has stride N (cache-unfriendly!)
//                 sum += A[i * K + k] * B[k * N + j];
//             }
//             C[i * N + j] = alpha * sum + beta * C[i * N + j];
//         }
//     }
// }`,
//     explanationMarkdown: [
//       'In standard row-major layout, navigating down a column of matrix B (`B[k * N + j]`) requires advancing by `N` floats on every inner iteration.',
//       'For large matrices (N = 4096), each stride of 4096 floats corresponds to 16 KB jumps in virtual memory, guaranteeing complete L1/L2 cache misses on every access to B.',
//       'Achieves only ~28 GFLOPS on modern CPUs, leaving >99.9% of GPU compute potential untapped.',
//     ],
//     architecturalPointers: [
//       {
//         title: 'Cache Miss Penalty',
//         description: 'Stride-N reads in matrix B bypass hardware prefetchers and force full DRAM/LLC roundtrips.',
//       },
//       {
//         title: 'Single-Instruction Serialism',
//         description: 'No SIMD (AVX-512) auto-vectorization without transposition or loop restructuring.',
//       },
//     ],
//   },
  {
    id: 1,
    slug: 'gpu-naive',
    title: 'Kernel 1: Naive Global Memory GPU Kernel',
    subtitle: 'Direct port to CUDA with 1 thread mapped to 1 output element C[i, j]',
    category: 'Memory Coalescing',
    authorNote: 'Parallelizes the outer 2 loops across a 2D grid of threads, but every thread pulls directly from high-latency global memory.',
    tflopsA100: 0.82,
    tflops4090: 2.15,
    tflopsV100: 0.65,
    percentCuBlas: 1.5,
    speedupVsbase: 1.0,
    arithmeticIntensity: 0.25,
    dramBandwidthGBs: 820.0,
    registersPerThread: 28,
    sharedMemBytesPerBlock: 0,
    keyTechnique: 'Assign 1 CUDA thread per output matrix element C[row, col].',
    bottleneckSolves: 'Massive thread-level parallelism (M x N threads active across GPU Streaming Multiprocessors).',
    remainingBottleneck: 'Repeated global memory access: for every single multiply-accumulate (2 FLOPs), 2 float reads (8 bytes) are pulled directly from DRAM. Zero data reuse!',
    cudaCode: `
#define BLOCK 32

__global__ void naive(
  int n, 
  const float* __restrict__ A, const float* __restrict__ B,
  float* __restrict__ C)
{
    const int i = blockIdx.x*BLOCK + threadIdx.x; // row of C
    const int j = blockIdx.y*BLOCK + threadIdx.y; // column of C
    if (i<n && j<n) {
        float sum = 0.0f;
        for (int k = 0; k < n; k++)
            sum += A[i*n + k] * B[k*n + j];
        C[i*n + j] = sum;
    }
}`,
    sassInspection: `// SASS excerpt showing high-latency DRAM stall loops:
LDG.E.SYS R2, [R4]     // High latency global memory load from A
LDG.E.SYS R3, [R6]     // High latency global memory load from B
FFMA R0, R2, R3, R0    // 1 instruction stall waiting for DRAM returns`,
    explanationMarkdown: [
      'Each thread computes a single scalar in matrix C. To calculate this scalar, the thread executes K iterations, fetching one float from A and one from B each time.',
      'Across an N×N matrix, every element of A and B is loaded N times from global memory! The total DRAM traffic is 2 × N³ × 4 bytes instead of 3 × N² × 4 bytes.',
      'With arithmetic intensity of only 0.25 FLOP/byte, the kernel saturates DRAM bandwidth immediately and stalls on hundreds of clock cycles per load.',
    ],
    architecturalPointers: [
      {
        title: 'Zero Shared Memory Reuse',
        description: 'Neighboring threads compute adjacent elements in C, yet they do not share their loaded A and B elements.',
      },
      {
        title: 'Memory Stall Dominance',
        description: 'Warps spend >85% of cycles stalled in Long Scoreboard waiting for DRAM loads to resolve.',
      },
    ],
  },
  {
    id: 2,
    slug: 'coalesced',
    title: 'Kernel 2: Global Memory Access Coalescing',
    subtitle: 'Aligning warp memory requests to contiguous 32-byte/128-byte DRAM cache lines',
    category: 'Memory Coalescing',
    authorNote: 'Restructuring thread indexing so consecutive threads in a warp access adjacent memory addresses in row-major order.',
    tflopsA100: 2.35,
    tflops4090: 6.40,
    tflopsV100: 1.82,
    percentCuBlas: 12.4,
    speedupVsCpu: 83.9,
    arithmeticIntensity: 0.25,
    dramBandwidthGBs: 1420.0,
    registersPerThread: 28,
    sharedMemBytesPerBlock: 0,
    keyTechnique: 'Ensure threadIdx.x drives the column index of row-major matrix B so warp lanes access consecutive 4-byte words.',
    bottleneckSolves: 'Uncoalesced memory transactions. Warps now load contiguous 128-byte segments in a single DRAM burst.',
    remainingBottleneck: 'Still pulling every float repeatedly from global memory. Arithmetic intensity is still locked at 0.25 FLOP/byte.',
    cudaCode: `__global__ void sgemm_coalesced(
    int M, int N, int K,
    float alpha,
    const float* __restrict__ A,
    const float* __restrict__ B,
    float beta,
    float* __restrict__ C) 
{
    // Coalesced mapping: consecutive threadIdx.x corresponds to consecutive columns
    const int cRow = blockIdx.y * blockDim.y + threadIdx.y;
    const int cCol = blockIdx.x * blockDim.x + threadIdx.x;

    if (cRow < M && cCol < N) {
        float sum = 0.0f;
        for (int k = 0; k < K; ++k) {
            // A[cRow * K + k] is broadcast to all threads in row
            // B[k * N + cCol] has stride 1 across threadIdx.x -> fully coalesced!
            sum += A[cRow * K + k] * B[k * N + cCol];
        }
        C[cRow * N + cCol] = alpha * sum + beta * C[cRow * N + cCol];
    }
}`,
    sassInspection: `// SASS instruction: Coalesced 128-byte memory transaction
LDG.E.128.SYS R4, [R8]  // Coalesced warp transaction (all 32 threads served in 1 request)`,
    explanationMarkdown: [
      'In CUDA, memory accesses are serviced in warp units (32 threads). If thread 0 reads address X, thread 1 reads X+4, etc., the hardware coalesces all 32 requests into a single 128-byte transaction.',
      'In Kernel 1, if thread mapping is inverted, each thread accesses memory with a stride of N, causing 32 separate 32-byte cache line requests—wasting 87.5% of fetched memory bus capacity.',
      'Kernel 2 guarantees coalescing on B, delivering a clean 2.8x speedup over Kernel 1, but we are still hard-limited by the DRAM bandwidth wall.',
    ],
    architecturalPointers: [
      {
        title: 'Warp Memory Alignment',
        description: 'Consecutive threads in warp access contiguous memory words, maximizing cache line utilization to 100%.',
      },
      {
        title: 'Memory Wall Ceiling',
        description: 'Coalescing fixes transaction fragmentation, but the arithmetic intensity remains stuck at 0.25 FLOP/byte.',
      },
    ],
  },
  {
    id: 3,
    slug: 'shared-mem-1d',
    title: 'Kernel 3: 1D Shared Memory Tiling (Blocked GEMM)',
    subtitle: 'Staging matrix sub-tiles into high-speed on-chip SRAM via __syncthreads()',
    category: 'Shared Memory',
    authorNote: 'The classical textbook blocked matrix multiplication. Loads square tiles into shared memory so data is reused by all threads in the block.',
    tflopsA100: 5.92,
    tflops4090: 16.80,
    tflopsV100: 4.80,
    percentCuBlas: 31.3,
    speedupVsCpu: 211.4,
    arithmeticIntensity: 16.0,
    dramBandwidthGBs: 710.0,
    registersPerThread: 32,
    sharedMemBytesPerBlock: 8192, // 2 * 32 * 32 * 4 bytes
    keyTechnique: 'Allocate __shared__ float As[BLOCK_SIZE][BLOCK_SIZE] and Bs[BLOCK_SIZE][BLOCK_SIZE] to cache sub-matrices in on-chip SRAM.',
    bottleneckSolves: 'Global memory bandwidth: elements loaded into SRAM are reused BLOCK_SIZE (32) times by threads within the block.',
    remainingBottleneck: 'Shared memory bandwidth stall. Each multiply-accumulate still requires 2 shared memory loads, saturating SMEM read ports.',
    cudaCode: `template <int BLOCK_SIZE>
__global__ void sgemm_shared_mem_1d(
    int M, int N, int K,
    float alpha,
    const float* __restrict__ A,
    const float* __restrict__ B,
    float beta,
    float* __restrict__ C) 
{
    // Shared memory allocations on-chip
    __shared__ float As[BLOCK_SIZE][BLOCK_SIZE];
    __shared__ float Bs[BLOCK_SIZE][BLOCK_SIZE];

    const int tx = threadIdx.x;
    const int ty = threadIdx.y;
    const int row = blockIdx.y * BLOCK_SIZE + ty;
    const int col = blockIdx.x * BLOCK_SIZE + tx;

    float sum = 0.0f;

    // Loop over sub-tiles along the K dimension
    for (int tileK = 0; tileK < (K + BLOCK_SIZE - 1) / BLOCK_SIZE; ++tileK) {
        // Collaborative load from DRAM to Shared Memory
        As[ty][tx] = (row < M && tileK * BLOCK_SIZE + tx < K) 
                     ? A[row * K + tileK * BLOCK_SIZE + tx] : 0.0f;
        Bs[ty][tx] = (tileK * BLOCK_SIZE + ty < K && col < N) 
                     ? B[(tileK * BLOCK_SIZE + ty) * N + col] : 0.0f;

        // Synchronize threads so tile is completely loaded
        __syncthreads();

        // Inner tile dot product from Shared Memory
        #pragma unroll
        for (int k = 0; k < BLOCK_SIZE; ++k) {
            sum += As[ty][k] * Bs[k][tx];
        }

        // Synchronize before loading next tile into shared buffers
        __syncthreads();
    }

    if (row < M && col < N) {
        C[row * N + col] = alpha * sum + beta * C[row * N + col];
    }
}`,
    sassInspection: `// SASS excerpt showing shared memory instruction profile
STS [R1], R4          // Store to Shared Memory (Tile load)
BAR.SYNC 0x0          // Thread block barrier (__syncthreads)
LDS R6, [R2]          // Load from Shared Memory (inner loop)
LDS R7, [R3]          // Load from Shared Memory (inner loop)
FFMA R0, R6, R7, R0   // Fused Multiply-Add`,
    explanationMarkdown: [
      'Shared memory on NVIDIA GPUs is an ultra-fast on-chip scratchpad with ~19 TB/s aggregate bandwidth and ~20 cycle latency, compared to DRAM’s 400+ cycle latency.',
      'By loading a 32×32 tile from A and a 32×32 tile from B, each thread block loads 2048 floats from DRAM, but executes 2 × 32³ = 65,536 FLOPs on those floats.',
      'This raises our arithmetic intensity by 32× (from 0.25 to 8-16 FLOP/byte), allowing the kernel to shatter the DRAM memory barrier.',
    ],
    architecturalPointers: [
      {
        title: 'Collaborative Block Loading',
        description: 'All 1024 threads in the block contribute to loading the shared memory tile in coalesced 32-bit segments.',
      },
      {
        title: 'Barrier Synchronization Overhead',
        description: 'Two __syncthreads() barriers per K-tile ensure data consistency but introduce warp synchronization latency.',
      },
    ],
  },
  {
    id: 4,
    slug: 'thread-tile-2d',
    title: 'Kernel 4: 2D Block & Thread Tiling (Outer Products)',
    subtitle: 'Computing a TM × TN tile per thread in registers to amortize shared memory reads',
    category: 'Register Tiling',
    authorNote: 'The single most transformative architectural transition. Instead of 1 element per thread, each thread computes an 8x8 tile stored in register file.',
    tflopsA100: 16.10,
    tflops4090: 45.20,
    tflopsV100: 11.20,
    percentCuBlas: 85.1,
    speedupVsCpu: 575.0,
    arithmeticIntensity: 64.0,
    dramBandwidthGBs: 410.0,
    registersPerThread: 64,
    sharedMemBytesPerBlock: 16384, // 2 * 128 * 16 * 4 bytes
    keyTechnique: 'Assign a 2D sub-matrix (e.g. 8x8) of C to each thread. Cache values in thread-private registers and perform outer product expansions.',
    bottleneckSolves: 'Shared memory bandwidth bottleneck! Reuses data in registers so each SMEM read supports 8 FLOPs instead of 1.',
    remainingBottleneck: 'Non-vectorized memory load instructions (issuing single 32-bit scalar loads) and potential bank conflicts.',
    cudaCode: `template <const int BM, const int BN, const int BK, const int TM, const int TN>
__global__ void sgemm_thread_tile_2d(
    int M, int N, int K,
    float alpha,
    const float* __restrict__ A,
    const float* __restrict__ B,
    float beta,
    float* __restrict__ C) 
{
    __shared__ float As[BM][BK];
    __shared__ float Bs[BK][BN];

    const int tx = threadIdx.x;
    const int ty = threadIdx.y;

    // Thread tile accumulation registers
    float threadResults[TM * TN] = {0.0f};
    float regM[TM] = {0.0f};
    float regN[TN] = {0.0f};

    // Stride through K with BK steps
    for (int bkIdx = 0; bkIdx < K; bkIdx += BK) {
        // Collaborative load of As and Bs into shared memory...
        load_tiles_to_smem<BM, BN, BK>(A, B, As, Bs, bkIdx, M, N, K);
        __syncthreads();

        // Outer product accumulation: compute TM x TN tile
        #pragma unroll
        for (int dotIdx = 0; dotIdx < BK; ++dotIdx) {
            // Load TM elements from As into thread registers
            #pragma unroll
            for (int i = 0; i < TM; ++i) {
                regM[i] = As[ty * TM + i][dotIdx];
            }
            // Load TN elements from Bs into thread registers
            #pragma unroll
            for (int j = 0; j < TN; ++j) {
                regN[j] = Bs[dotIdx][tx * TN + j];
            }
            // 2D Outer product in registers
            #pragma unroll
            for (int i = 0; i < TM; ++i) {
                #pragma unroll
                for (int j = 0; j < TN; ++j) {
                    threadResults[i * TN + j] += regM[i] * regN[j];
                }
            }
        }
        __syncthreads();
    }
    // Write out results...
}`,
    sassInspection: `// SASS loop unrolling: Pure FFMA instructions operating on register file
FFMA R32, R4, R12, R32  // Single cycle latency!
FFMA R33, R4, R13, R33
FFMA R34, R5, R12, R34
FFMA R35, R5, R13, R35  // Register file throughput exceeds 80 TB/s`,
    explanationMarkdown: [
      'While shared memory is fast (19 TB/s), the register file is vastly faster (>80 TB/s) and has 0-cycle load penalty when unrolled.',
      'By letting each thread calculate an 8×8 tile (64 values of C), we perform 2 × 8 × 8 = 128 FLOPs in registers for every 8 + 8 = 16 floats loaded from shared memory!',
      'This reduces shared memory bandwidth pressure by 8×. The kernel jumps from 31% to 85% of cuBLAS throughput in one leap.',
    ],
    architecturalPointers: [
      {
        title: 'Outer Product Math',
        description: 'Multiplying an 8x1 column vector by a 1x8 row vector yields an 8x8 matrix tile with quadratic compute reuse.',
      },
      {
        title: 'Register Pressure Tradeoff',
        description: 'Allocating 64 accumulators per thread increases register pressure and limits maximum active warps per SM.',
      },
    ],
  },
  {
    id: 5,
    slug: 'vectorized-float4',
    title: 'Kernel 5: Vectorized Memory Access (float4 / LDG.128)',
    subtitle: 'Issuing 128-bit memory instructions to saturate memory bus and cut instruction counts',
    category: 'Vectorization',
    authorNote: 'Replacing 32-bit scalar loads with 128-bit vector loads (float4) shrinks the number of memory load instructions by 75%.',
    tflopsA100: 17.20,
    tflops4090: 58.40,
    tflopsV100: 12.80,
    percentCuBlas: 91.0,
    speedupVsCpu: 614.3,
    arithmeticIntensity: 80.0,
    dramBandwidthGBs: 380.0,
    registersPerThread: 68,
    sharedMemBytesPerBlock: 16384,
    keyTechnique: 'Use reinterpret_cast<const float4*> to read and write memory in 128-bit chunks (LDG.E.128 & STS.128).',
    bottleneckSolves: 'Memory instruction pipeline congestion. 1 vectorized instruction replaces 4 individual load instructions.',
    remainingBottleneck: 'Shared memory bank conflicts during transposed read patterns and synchronous stall bubbles during K-tile step transitions.',
    cudaCode: `// Vectorized loads using float4 (128-bit)
#define FETCH_FLOAT4(pointer) (reinterpret_cast<float4*>(&(pointer))[0])
#define CONST_FETCH_FLOAT4(pointer) (reinterpret_cast<const float4*>(&(pointer))[0])

template <const int BM, const int BN, const int BK, const int TM, const int TN>
__global__ void sgemm_vectorized(
    int M, int N, int K,
    float alpha,
    const float* __restrict__ A,
    const float* __restrict__ B,
    float beta,
    float* __restrict__ C) 
{
    __shared__ float As[BM][BK];
    __shared__ float Bs[BK][BN];

    // Thread coordinates and pointers...
    const int tx = threadIdx.x;
    const int ty = threadIdx.y;

    // Vectorized loading of tile A from DRAM to Shared Memory
    // Every thread loads a float4 (4 contiguous elements)
    float4 tmpA = CONST_FETCH_FLOAT4(A[loadOffsetA]);
    As[loadRowA][loadColA + 0] = tmpA.x;
    As[loadRowA][loadColA + 1] = tmpA.y;
    As[loadRowA][loadColA + 2] = tmpA.z;
    As[loadRowA][loadColA + 3] = tmpA.w;

    // Vectorized loading of tile B
    float4 tmpB = CONST_FETCH_FLOAT4(B[loadOffsetB]);
    FETCH_FLOAT4(Bs[loadRowB][loadColB]) = tmpB;

    __syncthreads();
    // Compute loop proceeds with vectorized register staging...
}`,
    sassInspection: `// SASS excerpt: 128-bit wide memory operations
LDG.E.128.SYS R8, [R2]   // Load 128 bits (4 floats) in a single instruction!
STS.128 [R4], R8         // Store 128 bits into shared memory in 1 cycle`,
    explanationMarkdown: [
      'NVIDIA hardware memory controllers and L1/L2 caches operate natively on 128-bit segments. Issuing 32-bit `float` loads wastes instruction dispatch bandwidth.',
      'Using `float4` ensures that each thread loads 16 bytes simultaneously, cutting total load instructions by 4× and allowing maximum memory bus saturation with minimal warp scheduler overhead.',
      'Vectorizing both global memory loads and shared memory loads frees up execution pipelines for raw arithmetic instructions (`FFMA`).',
    ],
    architecturalPointers: [
      {
        title: 'Memory Bus Transaction Efficiency',
        description: 'Single LDG.E.128 instruction generates optimal 128-byte cache line request across 32 threads.',
      },
      {
        title: 'Address Alignment Constraint',
        description: 'Pointers must be strictly aligned to 16-byte boundaries, requiring matrix leading dimensions to be multiples of 4.',
      },
    ],
  },
  {
    id: 6,
    slug: 'bank-conflict-resolution',
    title: 'Kernel 6: Eliminating Shared Memory Bank Conflicts',
    subtitle: 'Array padding and swizzling to prevent serialization on the 32 SRAM banks',
    category: 'Shared Memory',
    authorNote: 'When multiple threads in a warp access different memory addresses within the same 32-bit bank, the access is serialized. We eliminate this with padding.',
    tflopsA100: 17.85,
    tflops4090: 65.10,
    tflopsV100: 13.50,
    percentCuBlas: 94.4,
    speedupVsCpu: 637.5,
    arithmeticIntensity: 80.0,
    dramBandwidthGBs: 370.0,
    registersPerThread: 72,
    sharedMemBytesPerBlock: 17408, // Padded shared memory footprint
    keyTechnique: 'Pad shared memory row pitch (e.g. As[BM][BK + 4]) or transpose tile A in shared memory so row accesses become bank-conflict free.',
    bottleneckSolves: 'Shared memory bank conflict serialization. Removes 2-way and 4-way bank conflict stalls during thread tile fetches.',
    remainingBottleneck: 'Synchronous barrier wait cycles and instruction dependency stalls between tile load and compute phases.',
    cudaCode: `// Shared memory with padding to prevent 32-bank conflicts
// Bank Index = (Address / 4 bytes) % 32 banks
// Without padding: As[i][k] accesses collide when BK is a multiple of 32!

template <const int BM, const int BN, const int BK, const int TM, const int TN>
__global__ void sgemm_bank_conflict_free(
    int M, int N, int K,
    float alpha,
    const float* __restrict__ A,
    const float* __restrict__ B,
    float beta,
    float* __restrict__ C) 
{
    // Adding +4 padding offset shifts subsequent rows across different banks!
    __shared__ float As[BM][BK + 4]; 
    __shared__ float Bs[BK][BN];

    // Transpose As during collaborative loading so inner loops can read
    // contiguous elements across threads with zero conflict:
    // Thread i reads As[i][k], with stride 1 across bank numbers!
    
    // ... Inner loop executes with 0 bank conflicts ...
}`,
    sassInspection: `// Profiling Nsight Compute:
// Before padding: 4-Way Bank Conflict (Shared Memory Replay Overhead: 28.4%)
// After padding:  0 Bank Conflicts (Shared Memory Replay Overhead: 0.1%)`,
    explanationMarkdown: [
      'Shared memory is physically split into 32 independent banks, each 4 bytes wide. If two or more threads in a warp request addresses belonging to the same bank, the hardware serializes the request.',
      'Because `BK = 128` is a multiple of 32, threads accessing column elements in `As` struck the exact same bank index across 4-thread strides, introducing a 4-way serialization penalty.',
      'By appending 4 dummy float padding elements (`[BK + 4]`), each successive row is skewed by 4 banks, distributing warp accesses uniformly across all 32 independent banks.',
    ],
    architecturalPointers: [
      {
        title: '32-Bank Architecture',
        description: 'Each bank delivers 4 bytes per clock cycle. 32 distinct bank hits yield full 128-byte single-cycle bandwidth.',
      },
      {
        title: 'Transposition In Shared Memory',
        description: 'Writing row-major data into column-major shared layout allows coalesced global reads AND bank-free shared reads.',
      },
    ],
  },
  {
    id: 7,
    slug: 'double-buffering-pipelining',
    title: 'Kernel 7: Double Buffering & Software Pipelining',
    subtitle: 'Overlapping K-tile computation with asynchronous prefetching of the next tile',
    category: 'Pipelining',
    authorNote: 'Ping-pong buffering hides global memory fetch latency completely behind the arithmetic computation of the current tile.',
    tflopsA100: 18.35,
    tflops4090: 71.80,
    tflopsV100: 14.15,
    percentCuBlas: 97.1,
    speedupVsCpu: 655.3,
    arithmeticIntensity: 85.0,
    dramBandwidthGBs: 350.0,
    registersPerThread: 84,
    sharedMemBytesPerBlock: 32768, // Double buffered (2x shared memory)
    keyTechnique: 'Allocate two shared memory buffers (As[2][BM][BK+4], Bs[2][BK][BN]). Compute tile k while fetching tile k+1 into registers.',
    bottleneckSolves: 'Latency stalls between tiles. Global DRAM loads for tile k+1 occur in parallel with Tensor/FFMA execution of tile k.',
    remainingBottleneck: 'Final micro-architectural scheduling: warp tile arrangement and occupancy tuning.',
    cudaCode: `template <const int BM, const int BN, const int BK, const int TM, const int TN>
__global__ void sgemm_double_buffering(
    int M, int N, int K,
    float alpha,
    const float* __restrict__ A,
    const float* __restrict__ B,
    float beta,
    float* __restrict__ C) 
{
    // Double buffers: index 0 and index 1
    __shared__ float As[2][BM][BK + 4];
    __shared__ float Bs[2][BK][BN];

    // Prefetch tile 0 from DRAM into registers
    float4 prefetchA = CONST_FETCH_FLOAT4(A[...]);
    float4 prefetchB = CONST_FETCH_FLOAT4(B[...]);

    // Store prefetch into buffer 0
    store_to_smem(prefetchA, As[0]);
    store_to_smem(prefetchB, Bs[0]);
    __syncthreads();

    int writeStage = 1;
    int readStage = 0;

    for (int bkIdx = BK; bkIdx < K; bkIdx += BK) {
        // Asynchronously issue DRAM load for NEXT tile (writeStage)
        prefetchA = CONST_FETCH_FLOAT4(A[...]);
        prefetchB = CONST_FETCH_FLOAT4(B[...]);

        // COMPUTE CURRENT TILE (readStage) using registers & FFMA
        #pragma unroll
        for (int dotIdx = 0; dotIdx < BK; ++dotIdx) {
            // Compute outer products using As[readStage] and Bs[readStage]...
        }

        // Store prefetched tile into shared memory buffer writeStage
        store_to_smem(prefetchA, As[writeStage]);
        store_to_smem(prefetchB, Bs[writeStage]);
        __syncthreads();

        // Swap ping-pong buffer indices
        readStage ^= 1;
        writeStage ^= 1;
    }
    // Compute last remaining tile...
}`,
    sassInspection: `// SASS pipeline interleaving:
LDG.E.128 R20, [R2]   // Prefetch next tile (non-blocking)
FFMA R32, R4, R12, R32 // Compute current tile!
FFMA R33, R4, R13, R33 // Compute current tile!
FFMA R34, R5, R12, R34 // Memory load latency is completely hidden`,
    explanationMarkdown: [
      'In single-buffered GEMM, the entire thread block must stop computing whenever a new tile is loaded: Load $\\to$ `__syncthreads()` $\\to$ Compute $\\to$ `__syncthreads()`. The compute cores sit idle during loads!',
      'Double buffering allocates two sets of buffers. While the compute units are burning through 100% of arithmetic throughput on buffer 0, memory units are concurrently fetching buffer 1.',
      'On modern Ampere/Ada architectures, this can also be implemented using hardware `cp.async` instructions that bypass registers entirely during global-to-shared memory transfer.',
    ],
    architecturalPointers: [
      {
        title: 'Ping-Pong Buffer Strategy',
        description: 'Toggles between index 0 and 1 using XOR `stage ^= 1`, completely interleaving compute with memory traffic.',
      },
      {
        title: 'Latency Hiding Mastery',
        description: 'DRAM load latency (400+ cycles) is completely invisible to execution time because compute time $\\ge$ load time.',
      },
    ],
  },
  {
    id: 8,
    slug: 'cublas-matching',
    title: 'Kernel 8: Warp Tiling & Micro-Kernel Tuning (Matching cuBLAS)',
    subtitle: 'Structuring thread blocks into hierarchical warp tiles and maximizing SM occupancy',
    category: 'cuBLAS Level',
    authorNote: 'The apex of kernel engineering. Orchestrating warp layout (WM=64, WN=64), register usage budgeting, and instruction scheduling to match cuBLAS SOTA.',
    tflopsA100: 18.60,
    tflops4090: 75.30,
    tflopsV100: 14.55,
    percentCuBlas: 98.4,
    speedupVsCpu: 664.2,
    arithmeticIntensity: 92.0,
    dramBandwidthGBs: 340.0,
    registersPerThread: 80,
    sharedMemBytesPerBlock: 32768,
    keyTechnique: 'Hierarchical warp tiling (Block Tile -> Warp Tile -> Thread Tile), optimal register budget (<= 80 regs/thread to retain 4 blocks/SM), and epilogue vectorization.',
    bottleneckSolves: 'Thread scheduling divergence, register spilling, and tail latency during epilogue writeback.',
    remainingBottleneck: 'Only hardware Tensor Cores (TF32/FP16 mma.sync instructions) can push beyond standard FP32 ALU execution limits.',
    cudaCode: `// Peak SOTA GEMM Kernel: Warp-Tiled Micro-Kernel
// Matches cuBLAS to within 1.6% margin on FP32 GEMM!

template <
    const int BM = 128,
    const int BN = 128,
    const int BK = 16,
    const int WM = 64,
    const int WN = 64,
    const int WMITER = 2,
    const int WNITER = 2,
    const int TM = 4,
    const int TN = 4
>
__global__ __launch_bounds__(256, 4) // Guarantee 4 active blocks per SM (high occupancy)
void sgemm_warp_tiled_sota(
    int M, int N, int K,
    float alpha,
    const float* __restrict__ A,
    const float* __restrict__ B,
    float beta,
    float* __restrict__ C) 
{
    // Hierarchical warp coordinate assignment:
    // 256 threads = 8 warps
    // Warps arranged in 2x4 grid to compute 2x4 = 8 warp tiles
    const int warpId = threadIdx.x / 32;
    const int laneId = threadIdx.x % 32;
    const int warpRow = warpId / 2;
    const int warpCol = warpId % 2;

    // Double-buffered Shared Memory with padding
    __shared__ alignas(16) float As[2][BM][BK + 4];
    __shared__ alignas(16) float Bs[2][BK][BN + 4];

    // Thread register accumulators (4x4 x 2x2 = 64 registers)
    float accum[WMITER * TM][WNITER * TN] = {0.0f};

    // Main K-tile software pipelined loop...
    // Fully unrolled inner loops compile to sustained FFMA cascades
    // Epilogue writes float4 vectors back to C in coalesced bursts!
}`,
    sassInspection: `// Peak SASS metric on Ampere A100:
// FP32 Pipe Utilization: 98.7%
// Active Warps / SM: 32 / 64 (50% theoretical, 99% achieved compute throughput)
// SOTA Performance: 18.60 TFLOPS (cuBLAS achieves 18.90 TFLOPS)`,
    explanationMarkdown: [
      'In this final kernel, we orchestrate the entire execution hierarchy: Grid $\\to$ Thread Block ($128 \\times 128$) $\\to$ Warp ($64 \\times 64$) $\\to$ Thread ($8 \\times 8$).',
      'By applying `__launch_bounds__(256, 4)`, we strictly limit compiler register allocation to 80 registers per thread, preventing register spilling while allowing 4 full blocks per SM (1024 threads per SM).',
      'The result is an artisanal kernel that achieves **18.60 TFLOPS on A100** and **75.3 TFLOPS on RTX 4090**, matching NVIDIA’s hand-tuned closed-source cuBLAS library to within 98.4%!',
    ],
    architecturalPointers: [
      {
        title: 'Occupancy vs Register Pressure Balance',
        description: 'Carefully capping registers at 80 allows dual block residency per SM partition, hiding instruction latencies.',
      },
      {
        title: 'Warp-Synchronous Micro-Kernel',
        description: 'Warps execute independent tiles without inter-warp synchronization, eliminating thread block barrier contention.',
      },
    ],
  },
];

// Enrich GPU kernels with codePrefix 'K' and performance graph placeholders
export const GPU_KERNELS: KernelStage[] = KERNEL_STAGES.map((k) => ({
  ...k,
  codePrefix: 'K',
  performanceGraph: k.performanceGraph || {
    caption: `Figure: Stage K${k.id} (${k.slug}) throughput scaling across matrix sizes (512 to 8192) in GFLOPs.`,
  },
}));

// Export unit-dependent kernel stages dictionary
export const UNIT_KERNEL_STAGES: Record<ProcessingUnit, KernelStage[]> = {
  gpu: GPU_KERNELS,
  cpu: CPU_KERNELS,
  tpu: TPU_KERNELS,
  future: [],
};

