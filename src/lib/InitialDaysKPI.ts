import { JournalDay } from '@/types/journal';

export const INITIAL_DAYS: JournalDay[] = [
  {
    id: 'day-01',
    dayNumber: 1,
    date: '2026-03-01',
    title: 'Modern C++ for CUDA: Pointers, Memory Layout, RAII & Device Pointers',
    phase: 'C++ & CUDA Foundations',
    status: 'completed',
    isStarred: true,
    summary: 'Mastered modern C++ memory management primitives essential for GPU computing: raw pointers vs smart pointers, pointer arithmetic, contiguous 1D layout for multi-dimensional tensors, and avoiding implicit copies.',
    explanation: `Kicked off the 250-Day KPI (Kernel Performance and Inference Engineering) roadmap. Coming from a Python/PyTorch background, writing high-performance kernels requires an absolute mental model of how data is laid out in physical silicon.

Key concepts internalized today:
1. Pointer Arithmetic & Stride: Multi-dimensional tensors in CUDA are virtually always flattened into 1D row-major buffers: index = row * width + col.
2. Unified Memory vs Explicit Pointers: While cudaMallocManaged() provides unified memory, production kernels use explicit device pointers (cudaMalloc / cudaFree) to eliminate page-fault migration latency during kernel execution.
3. RAII for GPU Resources: Wrote a minimal C++ wrapper class that guarantees cudaFree() and cudaStreamDestroy() on scope exit, preventing GPU VRAM leaks during iterative testing.`,
    formula: {
      name: 'Row-Major 2D Flattening',
      latex: '\\text{offset}(i, j) = i \\cdot W + j',
      description: 'Maps 2D matrix coordinates (row i, column j with stride W) to a flat 1D linear physical memory address.'
    },
    codeSnippet: {
      language: 'cpp',
      title: 'RAII Device Buffer Management in C++20',
      code: `#include <cuda_runtime.h>
#include <iostream>
#include <stdexcept>

template <typename T>
class CudaDeviceBuffer {
public:
    explicit CudaDeviceBuffer(size_t count) : count_(count) {
        cudaError_t err = cudaMalloc(&d_ptr_, count_ * sizeof(T));
        if (err != cudaSuccess) {
            throw std::runtime_error(cudaGetErrorString(err));
        }
    }
    ~CudaDeviceBuffer() {
        if (d_ptr_) cudaFree(d_ptr_);
    }
    // Prevent unintended copies, allow moves
    CudaDeviceBuffer(const CudaDeviceBuffer&) = delete;
    CudaDeviceBuffer& operator=(const CudaDeviceBuffer&) = delete;
    CudaDeviceBuffer(CudaDeviceBuffer&& o) noexcept : d_ptr_(o.d_ptr_), count_(o.count_) {
        o.d_ptr_ = nullptr;
    }
    T* get() const { return d_ptr_; }
    size_t size() const { return count_; }
private:
    T* d_ptr_{nullptr};
    size_t count_{0};
};`,
      explanation: 'RAII memory container that guarantees deterministic GPU memory reclamation without manual cudaFree calls.'
    },
    keyInsights: [
      'In high-throughput ML pipelines, CPU pointer arithmetic is virtually zero-cost, but misaligned memory accesses trigger multiple cache line fetches.',
      'Always check the return code of every CUDA runtime call with a CUDA_CHECK macro in debug builds.',
      'Modern C++ moves prevent double-free errors when passing device buffers across function boundaries.'
    ],
    gotchas: [
      'Never dereference a device pointer (*d_ptr) from host C++ code. Doing so causes an immediate SIGSEGV / host crash.'
    ],
    resources: [
      { title: 'Kirk & Hwu: Programming Massively Parallel Processors (Ch. 1-2)', type: 'book', url: 'https://www.elsevier.com/books/programming-massively-parallel-processors/kirk/978-0-323-91894-7' },
      { title: 'NVIDIA CUDA C++ Programming Guide (Hardware Model)', type: 'docs', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/' }
    ]
  },
//   {
//     id: 'day-02',
//     dayNumber: 2,
//     date: '2026-03-02',
//     title: 'CUDA Programming Model: Threads, Warps, Blocks, Grids & SIMT Architecture',
//     phase: 'C++ & CUDA Foundations',
//     status: 'completed',
//     isStarred: true,
//     summary: 'Deconstructed the CUDA execution hierarchy: thread indexing formulas, warp execution granularity (32 threads per warp), Streaming Multiprocessors (SMs), and warp divergence penalties.',
//     explanation: `Today was about mastering the Single Instruction, Multiple Threads (SIMT) abstraction.

// On NVIDIA GPUs:
// 1. Thread Indexing: Each thread calculates its global index:
//    int tid = blockIdx.x * blockDim.x + threadIdx.x;
// 2. Warps: The hardware does NOT schedule individual threads. The SM Warp Scheduler issues instructions to warps of exactly 32 parallel threads.
// 3. Warp Divergence: If threads within the same warp take different branches of an if/else condition (e.g., if (threadIdx.x % 2 == 0)), both execution paths are executed serially while inactive threads are masked out. This cuts effective compute throughput by 50%!`,
//     formula: {
//       name: 'Global Thread Index Formulation',
//       latex: 'i_{\\text{global}} = \\text{blockIdx}.x \\times \\text{blockDim}.x + \\text{threadIdx}.x',
//       description: 'Calculates unique linear memory index for 1D thread grids across arbitrary block dimensions.'
//     },
//     codeSnippet: {
//       language: 'cpp',
//       title: 'CUDA Thread Indexing & Divergence-Aware Branching',
//       code: `__global__ void process_tensor_kernel(float* out, const float* in, int N) {
//     int idx = blockIdx.x * blockDim.x + threadIdx.x;
//     if (idx >= N) return; // Boundary check

//     // BAD: Warp divergence (even threads do branch A, odd do branch B)
//     // if (threadIdx.x % 2 == 0) { ... } else { ... }

//     // GOOD: Branch on block or warp boundary (entire 32-thread warp takes same path)
//     if (blockIdx.x % 2 == 0) {
//         out[idx] = in[idx] * 2.0f;
//     } else {
//         out[idx] = in[idx] + 1.0f;
//     }
// }`,
//       explanation: 'Demonstrates warp-boundary branching which eliminates instruction serialization.'
//     },
//     keyInsights: [
//       'Always design conditional logic so that entire 32-thread warps evaluate to the same branch boolean.',
//       'The block size should almost always be a multiple of 32 (commonly 128, 256, or 512) to avoid under-utilized fractional warps.',
//       'GPU occupancy measures active warps divided by maximum supported warps per SM.'
//     ],
//     gotchas: [
//       'Launching a block size of 50 threads leaves 14 threads in the second warp permanently idle (wasted execution slots).'
//     ],
//     resources: [
//       { title: 'GPU MODE Lecture 1: Introduction to CUDA & SIMT', type: 'video', url: 'https://github.com/gpu-mode/lectures' },
//       { title: 'PMPP 4th Edition: Chapter 3 (CUDA Execution Model)', type: 'book' }
//     ]
//   },
//   {
//     id: 'day-03',
//     dayNumber: 3,
//     date: '2026-03-03',
//     title: 'Vector Addition Kernel: Host-Device Transfers & Launch Latency Overhead',
//     phase: 'C++ & CUDA Foundations',
//     status: 'completed',
//     isStarred: true,
//     summary: 'Implemented vector addition from scratch. Measured host-to-device PCIe transfer overhead vs kernel execution time, and proved why small elementwise kernels are dominated by kernel launch latency.',
//     explanation: `Built my first fully functional CUDA application: elementwise vector addition of N = 10,000,000 float32 elements.

// Benchmarked two phases using cudaEvent_t high-resolution timers:
// - PCIe Host-to-Device transfer: ~18.2 ms (PCIe 4.0 x16 theoretical ~31.5 GB/s, practical ~24 GB/s)
// - Kernel computation: ~0.42 ms
// - Device-to-Host transfer: ~9.1 ms

// Conclusion: If you perform a single elementwise addition on GPU and immediately copy back to CPU, the overhead of memory transfers completely dwarfs GPU computation speedup by over 50x! This proves the fundamental rule of ML systems: keep tensors resident on GPU memory across the entire training/inference graph.`,
//     formula: {
//       name: 'Memory Transfer Bandwidth',
//       latex: '\\text{BW}_{\\text{effective}} = \\frac{B_{\\text{bytes}}}{T_{\\text{transfer}}} = \\frac{N \\times 4\\,\\text{bytes}}{\\Delta t}',
//       description: 'Effective PCIe transfer bandwidth calculated from byte payload over elapsed wall time.'
//     },
//     codeSnippet: {
//       language: 'cpp',
//       title: 'Vector Addition Kernel with Precise Event Timing',
//       code: `#include <cuda_runtime.h>
// #include <cstdio>

// __global__ void vectorAdd(const float* A, const float* B, float* C, int N) {
//     int i = blockIdx.x * blockDim.x + threadIdx.x;
//     if (i < N) {
//         C[i] = A[i] + B[i];
//     }
// }

// void run_vector_add(int N) {
//     size_t bytes = N * sizeof(float);
//     float *h_A = new float[N], *h_B = new float[N], *h_C = new float[N];
//     for (int i = 0; i < N; i++) { h_A[i] = 1.0f; h_B[i] = 2.0f; }

//     float *d_A, *d_B, *d_C;
//     cudaMalloc(&d_A, bytes);
//     cudaMalloc(&d_B, bytes);
//     cudaMalloc(&d_C, bytes);

//     cudaMemcpy(d_A, h_A, bytes, cudaMemcpyHostToDevice);
//     cudaMemcpy(d_B, h_B, bytes, cudaMemcpyHostToDevice);

//     int threadsPerBlock = 256;
//     int blocksPerGrid = (N + threadsPerBlock - 1) / threadsPerBlock;

//     cudaEvent_t start, stop;
//     cudaEventCreate(&start);
//     cudaEventCreate(&stop);

//     cudaEventRecord(start);
//     vectorAdd<<<blocksPerGrid, threadsPerBlock>>>(d_A, d_B, d_C, N);
//     cudaEventRecord(stop);
//     cudaEventSynchronize(stop);

//     float ms = 0;
//     cudaEventElapsedTime(&ms, start, stop);
//     printf("Kernel execution time: %f ms for %d elements\\n", ms, N);

//     cudaMemcpy(h_C, d_C, bytes, cudaMemcpyDeviceToHost);
//     cudaFree(d_A); cudaFree(d_B); cudaFree(d_C);
//     delete[] h_A; delete[] h_B; delete[] h_C;
// }`,
//       explanation: 'End-to-end vector addition demonstrating ceiling division for grid sizing and cudaEvent timing.'
//     },
//     keyInsights: [
//       'Grid sizing formula: blocksPerGrid = (N + blockSize - 1) / blockSize guarantees all elements are covered.',
//       'cudaEventElapsedTime provides microsecond-precision hardware GPU timestamping without CPU timing jitter.',
//       'Small batch ML operators suffer from launch latency (~5-10 microseconds per kernel launch); operator fusion is critical.'
//     ],
//     gotchas: [
//       'cudaMemcpy is synchronous by default with respect to host, but kernel launches are asynchronous! Always synchronize before reading elapsed timer values.'
//     ],
//     resources: [
//       { title: 'NVIDIA/cuda-samples: vectorAdd', type: 'repo', url: 'https://github.com/NVIDIA/cuda-samples/tree/master/Samples/0_Introduction/vectorAdd' },
//       { title: 'LeetGPU Challenge: Vector Addition', type: 'practice', url: 'https://leetgpu.com/challenges' }
//     ]
//   },
//   {
//     id: 'day-04',
//     dayNumber: 4,
//     date: '2026-03-04',
//     title: 'Global Memory Coalescing: 128-Byte Bus Transactions & Stride Pitfalls',
//     phase: 'C++ & CUDA Foundations',
//     status: 'completed',
//     isStarred: true,
//     summary: 'Analyzed GPU DRAM memory controllers, L2 cache line sectors (32 bytes / 128 bytes), and proved how non-coalesced strided access degrades effective memory bandwidth by 32x.',
//     explanation: `Today I dove deep into the physical memory subsystem of NVIDIA GPUs.

// When a warp of 32 threads accesses global memory:
// - If Thread 0 reads byte 0, Thread 1 reads byte 4, ..., Thread 31 reads byte 124 (contiguous 128 bytes): The GPU memory controller services the entire warp with a single 128-byte DRAM transaction. This is 100% memory bus efficiency (coalesced).
// - If threads access with a stride S > 1: The 32 memory addresses fall into 32 different cache lines! The memory controller must issue 32 separate 32-byte bus transactions, fetching 1,024 bytes to retrieve just 128 bytes of useful data (12.5% efficiency).

// Wrote a benchmarking kernel varying stride from 1 to 32 and plotted bandwidth collapse. Stride-1 achieved 812 GB/s, while Stride-32 dropped to 28 GB/s on an A100 GPU!`,
//     formula: {
//       name: 'Memory Coalescing Efficiency',
//       latex: '\\eta_{\\text{coalescing}} = \\frac{\\text{Requested Bytes}}{\\text{Transferred Bytes}} = \\frac{32 \\times \\text{sizeof}(T)}{\\text{Transactions} \\times 32\\,\\text{bytes}}',
//       description: 'Ratio of useful payload bytes requested by the warp to total cache sector bytes transferred over the memory bus.'
//     },
//     codeSnippet: {
//       language: 'cpp',
//       title: 'Strided vs Coalesced Memory Access Benchmark',
//       code: `__global__ void coalesced_benchmark(float* out, const float* in, int stride, int N) {
//     int tid = blockIdx.x * blockDim.x + threadIdx.x;
//     int idx = tid * stride;
//     if (idx < N) {
//         out[tid] = in[idx] * 2.0f; // Stride > 1 breaks coalescing!
//     }
// }

// // Coalesced pattern: adjacent threads access adjacent memory addresses
// __global__ void coalesced_optimal(float* out, const float* in, int N) {
//     int idx = blockIdx.x * blockDim.x + threadIdx.x;
//     if (idx < N) {
//         out[idx] = in[idx] * 2.0f; // 1 single 128-byte transaction per warp
//     }
// }`,
//       explanation: 'Contrasting non-coalesced strided reads with consecutive coalesced 128-byte transactions.'
//     },
//     keyInsights: [
//       'Warp memory requests are grouped at the hardware level into aligned 32-byte cache line sectors.',
//       'In matrix operations, row-major matrices allow row reads to coalesce naturally; column-wise reads destroy coalescing without shared memory transposition.',
//       'Coalescing is the single highest-impact optimization for memory-bound CUDA kernels.'
//     ],
//     gotchas: [
//       'Struct of Arrays (SoA) layout preserves coalescing, whereas Array of Structs (AoS) causes strided reads for individual fields.'
//     ],
//     resources: [
//       { title: 'PMPP 4th Edition: Chapter 4 (Memory Architecture & Coalescing)', type: 'book' },
//       { title: 'NVIDIA Developer Blog: How to Access Global Memory Efficiently in CUDA', type: 'blog', url: 'https://developer.nvidia.com/blog/how-access-global-memory-efficiently-cuda-c-kernels/' }
//     ]
//   },
//   {
//     id: 'day-05',
//     dayNumber: 5,
//     date: '2026-03-05',
//     title: 'Shared Memory Tiling & 32-Bank Architecture: Eliminating Bank Conflicts',
//     phase: 'C++ & CUDA Foundations',
//     status: 'completed',
//     isStarred: true,
//     interactiveLabId: 'bankconflict',
//     summary: 'Dissected on-chip Shared Memory (SRAM), 32-bank interleaved addressing (4 bytes per bank), and demonstrated how +1 padding completely resolves bank conflicts during 2D matrix operations.',
//     explanation: `Today was a milestone in low-level memory engineering: CUDA on-chip Shared Memory.

// Key architecture facts:
// 1. Shared Memory is physically located on the SM (like an L1 cache, but software-managed). Latency is ~20-30 cycles vs ~400-800 cycles for global DRAM.
// 2. 32-Bank Structure: Shared memory is divided into 32 equal-sized memory banks. Successive 32-bit (4-byte) words map to successive banks:
//    Bank = (Byte Address / 4) % 32
// 3. Bank Conflicts: If multiple threads in a warp request different addresses within the same bank simultaneously, the requests are serialized! A 32-way conflict cuts shared memory bandwidth to 1/32nd of peak.
// 4. Broadcast Exception: If all threads in a warp read the EXACT same address in a bank, it is broadcast to all threads in a single cycle with zero penalty.`,
//     formula: {
//       name: 'Shared Memory Bank Mapping',
//       latex: '\\text{Bank ID} = \\left( \\frac{\\text{Address}}{4\\,\\text{bytes}} \\right) \\pmod{32}',
//       description: 'Determines which of the 32 physical on-chip memory banks services a 4-byte memory request.'
//     },
//     codeSnippet: {
//       language: 'cpp',
//       title: 'Shared Memory Padding to Eliminate Bank Conflicts',
//       code: `#define TILE_DIM 32
// #define BLOCK_ROWS 8

// // BAD: Column-wise shared memory read has 32-way bank conflict!
// // __shared__ float tile[TILE_DIM][TILE_DIM]; // tile[row][col]: col 0 maps to bank 0 for all rows!

// // GOOD: Add +1 column padding: shifts bank allocation by 1 per row
// __shared__ float tile_padded[TILE_DIM][TILE_DIM + 1];

// __global__ void transposeNoBankConflicts(float* odata, const float* idata, int width, int height) {
//     __shared__ float tile[TILE_DIM][TILE_DIM + 1]; // +1 padding eliminates all conflicts!

//     int x = blockIdx.x * TILE_DIM + threadIdx.x;
//     int y = blockIdx.y * TILE_DIM + threadIdx.y;

//     // Coalesced read from global memory into shared memory
//     for (int j = 0; j < TILE_DIM; j += BLOCK_ROWS) {
//         tile[threadIdx.y + j][threadIdx.x] = idata[(y + j) * width + x];
//     }
//     __syncthreads();

//     // Coalesced write to global memory from shared memory
//     x = blockIdx.y * TILE_DIM + threadIdx.x;
//     y = blockIdx.x * TILE_DIM + threadIdx.y;

//     for (int j = 0; j < TILE_DIM; j += BLOCK_ROWS) {
//         odata[(y + j) * height + x] = tile[threadIdx.x][threadIdx.y + j];
//     }
// }`,
//       explanation: 'Matrix transpose using padded shared memory to ensure both global DRAM reads and writes are 100% coalesced without bank conflicts.'
//     },
//     keyInsights: [
//       'Padding shared memory arrays by +1 (e.g. tile[32][33]) offsets each row by 1 bank, ensuring column reads hit distinct banks across all 32 threads.',
//       'Always place __syncthreads() barrier between shared memory writes and reads to avoid race conditions.',
//       'Never place __syncthreads() inside conditional code unless all threads in the block take the exact same branch, or the GPU will hang (deadlock).'
//     ],
//     gotchas: [
//       'Shared memory allocation size per block is constrained (typically 48KB - 164KB depending on compute capability). Exceeding it reduces SM occupancy or fails kernel launch.'
//     ],
//     resources: [
//       { title: 'NVIDIA/cuda-samples: transpose sample code', type: 'repo', url: 'https://github.com/NVIDIA/cuda-samples/tree/master/Samples/6_Performance/transpose' },
//       { title: 'PMPP 4th Edition: Chapter 5 (Shared Memory & Bank Conflicts)', type: 'book' }
//     ]
//   },
//   {
//     id: 'day-06',
//     dayNumber: 6,
//     date: '2026-03-06',
//     title: '1D & 2D Stencil Convolutions: Constant Cache & Halo Cell Management',
//     phase: 'C++ & CUDA Foundations',
//     status: 'completed',
//     isStarred: false,
//     summary: 'Implemented tiled 2D convolutions using shared memory for halo cells and __constant__ memory for filter weights, analyzing 64KB constant cache broadcast mechanics.',
//     explanation: `Explored spatial stencil operations and convolution filters, a direct precursor to convolutional layers and attention masks.

// When filtering an image or feature map:
// - Boundary "halo" cells are needed by neighboring output tiles. Loading halo cells repeatedly from global DRAM causes massive bandwidth redundancy.
// - Solution: Load the tile plus halo region into shared memory once, synchronize with __syncthreads(), and compute convolution entirely inside SRAM!
// - Furthermore, since the convolution kernel filter weights are identical for all threads, placing them in __constant__ memory utilizes the dedicated 64KB constant cache, which broadcasts in 1 cycle when all warp threads read the same weight!`,
//     formula: {
//       name: '2D Stencil Boundary Condition',
//       latex: 'y[i, j] = \\sum_{m=-R}^{R} \\sum_{n=-R}^{R} w[m, n] \\cdot x[i+m, j+n]',
//       description: 'Radius R 2D stencil convolution requiring boundary halo boundary checks or shared memory margin expansion.'
//     },
//     codeSnippet: {
//       language: 'cpp',
//       title: '2D Tiled Convolution with Constant Memory Weights',
//       code: `#define FILTER_RADIUS 2
// #define FILTER_WIDTH (2 * FILTER_RADIUS + 1)
// #define TILE_WIDTH 16

// __constant__ float d_Filter[FILTER_WIDTH * FILTER_WIDTH];

// __global__ void convolution2D_tiled(const float* in, float* out, int width, int height) {
//     __shared__ float s_data[TILE_WIDTH + 2 * FILTER_RADIUS][TILE_WIDTH + 2 * FILTER_RADIUS];

//     int tx = threadIdx.x;
//     int ty = threadIdx.y;
//     int col_o = blockIdx.x * TILE_WIDTH + tx;
//     int row_o = blockIdx.y * TILE_WIDTH + ty;

//     // Load center and halo cells into shared memory
//     // ... boundary checks and clamp to edge ...
//     __syncthreads();

//     // Compute convolution using broadcast constant memory
//     float sum = 0.0f;
//     #pragma unroll
//     for (int r = 0; r < FILTER_WIDTH; r++) {
//         #pragma unroll
//         for (int c = 0; c < FILTER_WIDTH; c++) {
//             sum += s_data[ty + r][tx + c] * d_Filter[r * FILTER_WIDTH + c];
//         }
//     }

//     if (row_o < height && col_o < width) {
//         out[row_o * width + col_o] = sum;
//     }
// }`,
//       explanation: 'Tiled convolution with #pragma unroll and constant cache broadcast.'
//     },
//     keyInsights: [
//       '__constant__ memory provides peak bandwidth only when all 32 threads in a warp access the same address simultaneously (uniform broadcast).',
//       '#pragma unroll instructs NVCC compiler to unroll inner loops, eliminating loop counter branch instructions and exposing instruction-level parallelism (ILP).',
//       'Ghost/halo cells can be handled either by interior threads loading extra cells or by expanding block dimensions.'
//     ],
//     gotchas: [
//       'If threads in a warp read different addresses from constant memory, the reads are serialized!'
//     ],
//     resources: [
//       { title: 'Kirk & Hwu: Chapter 7 (Parallel Computation Patterns: Stencils)', type: 'book' }
//     ]
//   },
//   {
//     id: 'day-07',
//     dayNumber: 7,
//     date: '2026-03-07',
//     title: 'Parallel Reduction in CUDA: Warp Divergence Elimination & Warp Shuffles',
//     phase: 'C++ & CUDA Foundations',
//     status: 'completed',
//     isStarred: true,
//     summary: 'Studied Mark Harris\'s legendary 7-stage reduction optimization ladder, transitioning from interleaved addressing to sequential addressing, unrolling, and modern __shfl_down_sync warp primitives.',
//     explanation: `Parallel reduction (summing an array of N numbers) is the foundational primitive for Softmax, LayerNorm, and Loss computations in LLMs.

// Mark Harris Optimization Stages analyzed:
// 1. Interleaved addressing (stride 1, 2, 4): Terrible warp divergence.
// 2. Non-divergent branching (strided loop index): Replaces divergence with inactive threads.
// 3. Sequential addressing: Memory accesses are coalesced, zero bank conflicts!
// 4. First add during load: Halves the number of active blocks and launches.
// 5. Unroll the last warp: When stride drops below 32, a single warp executes without needing __syncthreads()!
// 6. Modern CUDA (__shfl_down_sync): Eliminates shared memory entirely for the intra-warp reduction by exchanging register values directly through SM crossbars!`,
//     formula: {
//       name: 'Warp Shuffle Crossbar Reduction',
//       latex: 'x = x + \\text{\\_\\_shfl\\_down\\_sync}(0\\text{xffffffff}, x, \\Delta)',
//       description: 'Exchange 32-bit register values across warp lanes in 1 clock cycle without touching shared memory or global DRAM.'
//     },
//     codeSnippet: {
//       language: 'cpp',
//       title: 'Warp Shuffle Intra-Block Reduction',
//       code: `__inline__ __device__ float warpReduceSum(float val) {
//     #pragma unroll
//     for (int offset = 16; offset > 0; offset /= 2) {
//         val += __shfl_down_sync(0xffffffff, val, offset);
//     }
//     return val; // Lane 0 holds total sum of the 32 warp threads
// }

// __global__ void blockReduceKernel(const float* in, float* out, int N) {
//     extern __shared__ float s_warp_sums[]; // 1 slot per warp
//     int tid = threadIdx.x;
//     int idx = blockIdx.x * blockDim.x + threadIdx.x;

//     float val = (idx < N) ? in[idx] : 0.0f;
//     val = warpReduceSum(val);

//     int lane = tid % 32;
//     int warpId = tid / 32;

//     if (lane == 0) {
//         s_warp_sums[warpId] = val; // Store warp partial sums
//     }
//     __syncthreads();

//     // Final reduction of warp sums by first warp
//     if (warpId == 0) {
//         val = (tid < (blockDim.x / 32)) ? s_warp_sums[lane] : 0.0f;
//         val = warpReduceSum(val);
//         if (lane == 0) {
//             atomicAdd(out, val);
//         }
//     }
// }`,
//       explanation: 'Modern two-stage warp-shuffle reduction that runs in register space with minimal shared memory.'
//     },
//     keyInsights: [
//       'Warp shuffle primitives (__shfl_down_sync) transfer data between thread registers over the SM crossbar in ~1 cycle without shared memory allocation.',
//       'The mask 0xffffffff indicates all 32 threads in the warp participate in the shuffle synchronization.',
//       'atomicAdd on global memory is extremely fast on modern architectures for final block aggregation.'
//     ],
//     gotchas: [
//       'In legacy CUDA code, developers relied on implicit warp-synchronous programming without __syncwarp(); since Volta (Independent Thread Scheduling), this causes silent race conditions. Always use explicit sync masks!'
//     ],
//     resources: [
//       { title: 'Mark Harris: Optimizing Parallel Reduction in CUDA (Classic NVIDIA Presentation)', type: 'docs', url: 'https://developer.download.nvidia.com/assets/cuda/files/reduction.pdf' },
//       { title: 'NVIDIA Developer Blog: Faster Parallel Reductions with Warp Shuffle', type: 'blog' }
//     ]
//   },
//   {
//     id: 'day-08',
//     dayNumber: 8,
//     date: '2026-03-08',
//     title: 'Naive GEMM: Arithmetic Intensity, Memory-Bound Limits & Roofline Position',
//     phase: 'C++ & CUDA Foundations',
//     status: 'completed',
//     isStarred: true,
//     interactiveLabId: 'roofline',
//     summary: 'Implemented naive matrix multiplication C = A @ B. Derived its dismal arithmetic intensity of 0.25 FLOPs/byte and verified via the Roofline model why it achieves less than 3% of GPU peak compute.',
//     explanation: `Today marks the entry into GEMM (General Matrix Multiply)—the heart of every linear layer and transformer in deep learning.

// For matrices of size M = N = K:
// - Total Operations: 2 * N^3 FLOPs (N multiplications + N additions per element, for N^2 elements).
// - Memory Traffic in Naive GEMM: Each thread computes 1 element of C. To do this, it reads an entire row of A (N floats = 4N bytes) and an entire column of B (N floats = 4N bytes).
// - Total DRAM Reads: N^2 * (4N + 4N) = 8 * N^3 bytes!

// Arithmetic Intensity:
// AI = (2 * N^3 FLOPs) / (8 * N^3 bytes) = 0.25 FLOPs/byte!

// On an NVIDIA A100 GPU (19.5 TFLOPs FP32 compute, 2,039 GB/s HBM2e bandwidth):
// The "Ridge Point" is 19,500 / 2,039 ≈ 9.56 FLOPs/byte.
// Since 0.25 << 9.56, Naive GEMM is severely memory-bound! Attainable compute = 2,039 GB/s * 0.25 FLOPs/byte = 509 GFLOPs (only 2.6% of peak)!`,
//     formula: {
//       name: 'Naive GEMM Arithmetic Intensity',
//       latex: 'I_{\\text{naive}} = \\frac{2 \\cdot M \\cdot N \\cdot K}{4 \\cdot (2 \\cdot M \\cdot N \\cdot K)} = \\frac{1}{4} = 0.25\\,\\text{FLOPs/byte}',
//       description: 'Without cache reuse, reading row and column per output element results in catastrophic memory traffic.'
//     },
//     codeSnippet: {
//       language: 'cpp',
//       title: 'Naive Matrix Multiply Kernel (Baseline)',
//       code: `__global__ void naiveGemm(const float* A, const float* B, float* C, int M, int N, int K) {
//     int row = blockIdx.y * blockDim.y + threadIdx.y;
//     int col = blockIdx.x * blockDim.x + threadIdx.x;

//     if (row < M && col < N) {
//         float sum = 0.0f;
//         for (int k = 0; k < K; k++) {
//             // A read is coalesced across col, but B read strided down columns!
//             sum += A[row * K + k] * B[k * N + col];
//         }
//         C[row * N + col] = sum;
//     }
// }`,
//       explanation: 'Naive GEMM with 0.25 FLOPs/byte arithmetic intensity.'
//     },
//     keyInsights: [
//       'The Roofline Model mathematically defines whether a kernel is bound by Memory Bandwidth or Peak Compute Ceilings.',
//       'To turn a memory-bound matrix multiply into a compute-bound operation, we must reuse data from on-chip SRAM via Tiling.',
//       'Column access B[k * N + col] causes non-coalesced memory traffic without transposition.'
//     ],
//     gotchas: [
//       'Do not assume slow kernels need faster arithmetic instructions. In naive GEMM, the ALU units spend 97% of time stalled waiting for DRAM loads!'
//     ],
//     resources: [
//       { title: 'Siboehm: How to Optimize a CUDA Matmul Kernel (Step 1)', type: 'blog', url: 'https://siboehm.com/articles/22/CUDA-MMM' },
//       { title: 'Kirk & Hwu: Chapter 4 (Matrix Multiplication)', type: 'book' }
//     ]
//   },
//   {
//     id: 'day-09',
//     dayNumber: 9,
//     date: '2026-03-09',
//     title: 'Tiled GEMM with Shared Memory: Boosting Arithmetic Intensity by Tile Factor',
//     phase: 'C++ & CUDA Foundations',
//     status: 'completed',
//     isStarred: true,
//     interactiveLabId: 'roofline',
//     summary: 'Implemented 32x32 tiled GEMM using shared memory buffers. Proved how caching blocks of A and B reduces global DRAM traffic by 32x, lifting arithmetic intensity to 8.0 FLOPs/byte.',
//     explanation: `Today I conquered the tiled shared memory GEMM—the foundational technique underlying all high-performance matrix libraries.

// The Concept of Tiling:
// Instead of loading elements directly from DRAM in the inner loop:
// 1. Divide matrices A and B into sub-matrices of size TILE_DIM × TILE_DIM (e.g. 32 × 32).
// 2. The threads in a block cooperatively load tile A_sub and B_sub into shared memory.
// 3. Call __syncthreads() to ensure the tiles are fully populated.
// 4. Each thread computes its local inner dot product over the 32 elements in fast SRAM.
// 5. Advance to the next tile along the K dimension.

// Arithmetic Intensity Boost:
// Global memory reads are reduced from 2*N per element to 2*(N / TILE_DIM).
// With TILE_DIM = 32:
// AI = 0.25 * 32 = 8.0 FLOPs/byte!
// On A100, this shifts the kernel rightward on the Roofline chart, pushing throughput from 500 GFLOPs to over 8.2 TFLOPs—a 16x speedup!`,
//     formula: {
//       name: 'Tiled Arithmetic Intensity Scaling',
//       latex: 'I_{\\text{tiled}} = \\text{TILE\\_DIM} \\times I_{\\text{naive}} = \\frac{B}{4}\\,\\text{FLOPs/byte}',
//       description: 'Shared memory tiling boosts arithmetic intensity proportionally to block tile width B.'
//     },
//     codeSnippet: {
//       language: 'cpp',
//       title: 'Classic Tiled GEMM in CUDA',
//       code: `#define TILE_SIZE 32

// __global__ void tiledGemm(const float* A, const float* B, float* C, int M, int N, int K) {
//     __shared__ float s_A[TILE_SIZE][TILE_SIZE];
//     __shared__ float s_B[TILE_SIZE][TILE_SIZE];

//     int row = blockIdx.y * TILE_SIZE + threadIdx.y;
//     int col = blockIdx.x * TILE_SIZE + threadIdx.x;

//     float sum = 0.0f;
//     int numTiles = (K + TILE_SIZE - 1) / TILE_SIZE;

//     for (int t = 0; t < numTiles; t++) {
//         // Cooperative global -> shared memory load
//         int tiledK = t * TILE_SIZE;
//         s_A[threadIdx.y][threadIdx.x] = (row < M && (tiledK + threadIdx.x) < K) 
//             ? A[row * K + (tiledK + threadIdx.x)] : 0.0f;
//         s_B[threadIdx.y][threadIdx.x] = ((tiledK + threadIdx.y) < K && col < N) 
//             ? B[(tiledK + threadIdx.y) * N + col] : 0.0f;

//         __syncthreads();

//         #pragma unroll
//         for (int k = 0; k < TILE_SIZE; k++) {
//             sum += s_A[threadIdx.y][k] * s_B[k][threadIdx.x];
//         }

//         __syncthreads();
//     }

//     if (row < M && col < N) {
//         C[row * N + col] = sum;
//     }
// }`,
//       explanation: 'Standard tiled GEMM reducing DRAM fetches by 32x through shared memory reuse.'
//     },
//     keyInsights: [
//       'Two __syncthreads() are mandatory per loop: one after loading shared memory, and one before the next iteration overwrites it.',
//       'Shared memory allows coalesced loads for BOTH matrix A and matrix B, fixing the strided read issue of naive GEMM.',
//       'Tile size is constrained by shared memory capacity and registers per SM.'
//     ],
//     gotchas: [
//       'Omitting the second __syncthreads() causes threads that finish computing early to overwrite shared tiles while other warps are still computing!'
//     ],
//     resources: [
//       { title: 'Siboehm Matmul: Kernel 2 & 3 (Shared Memory Tiling)', type: 'blog', url: 'https://siboehm.com/articles/22/CUDA-MMM' },
//       { title: 'Kirk & Hwu: Chapter 4.4 (Tiled Matrix Multiplication)', type: 'book' }
//     ]
//   },
//   {
//     id: 'day-10',
//     dayNumber: 10,
//     date: '2026-03-10',
//     title: 'Vectorized Memory Access: float4 Vector Loads & LDG.128 Instruction Optimization',
//     phase: 'C++ & CUDA Foundations',
//     status: 'completed',
//     isStarred: true,
//     summary: 'Upgraded GEMM with float4 vectorized memory loads, inspecting SASS assembly for LDG.128 instructions, and analyzing register pressure vs instruction-level parallelism (ILP).',
//     explanation: `Today I reached the next tier of the GEMM ladder: Vectorized Memory Access.

// Why float4 loads matter:
// 1. When a thread loads float x = A[i], the hardware issues an LDG.E.32 SASS instruction (32-bit load).
// 2. When a thread loads reinterpret_cast<const float4*>(A)[i], the hardware issues an LDG.E.128 instruction—loading 128 bits (16 bytes = 4 floats) in a single instruction!
// 3. Benefits:
//    - 4x fewer memory instruction dispatches to the instruction issue queue.
//    - Maximize bus utilization and saturation of SM load/store units.
//    - Significant reduction in instruction overhead, opening headroom for compute pipelines.

// Combined float4 vectorized loads with register blocking (each thread computing a 4x4 or 8x8 sub-tile of C stored in registers), reaching over 12 TFLOPs on FP32 (~65% of cuBLAS).`,
//     formula: {
//       name: 'Vectorized Instruction Efficiency',
//       latex: '\\text{Instructions} = \\frac{N}{4} \\quad \\text{vs} \\quad N \\quad (\\text{75\\% reduction in load issue overhead})',
//       description: 'Using 128-bit LDG.128 loads reduces memory issue queue transactions by 4x.'
//     },
//     codeSnippet: {
//       language: 'cpp',
//       title: 'Vectorized float4 Memory Loading in CUDA',
//       code: `__device__ __inline__ float4 load_float4(const float* addr) {
//     return *reinterpret_cast<const float4*>(addr);
// }

// __device__ __inline__ void store_float4(float* addr, float4 val) {
//     *reinterpret_cast<float4*>(addr) = val;
// }

// __global__ void copy_vectorized(const float* __restrict__ in, float* __restrict__ out, int N) {
//     int idx = (blockIdx.x * blockDim.x + threadIdx.x) * 4;
//     if (idx + 3 < N) {
//         float4 v = load_float4(&in[idx]); // Emits LDG.128 SASS instruction
//         v.x *= 2.0f;
//         v.y *= 2.0f;
//         v.z *= 2.0f;
//         v.w *= 2.0f;
//         store_float4(&out[idx], v);       // Emits STG.128 SASS instruction
//     }
// }`,
//       explanation: 'Utilizing 128-bit vector types to emit hardware LDG.128 / STG.128 instructions.'
//     },
//     keyInsights: [
//       'Addresses passed to float4 must be 16-byte aligned (guaranteed by cudaMalloc, but offsets must be multiples of 4).',
//       'Register blocking keeps intermediate tile accumulators in hardware registers rather than reading/writing shared memory.',
//       'Always inspect the SASS disassembly (cuobjdump --dump-sass) to confirm LDG.128 is actually generated by NVCC.'
//     ],
//     gotchas: [
//       'Misaligned float4 pointers trigger an unaligned memory access hardware fault, resulting in CUDA error 700 (cudaErrorIllegalAddress).'
//     ],
//     resources: [
//       { title: 'Siboehm: Kernel 4 (Vectorize Memory Accesses with float4)', type: 'blog' },
//       { title: 'CUDA C++ Programming Guide: Built-in Vector Types', type: 'docs' }
//     ]
//   },
//   {
//     id: 'day-12',
//     dayNumber: 12,
//     date: '2026-03-12',
//     title: 'Matrix Transpose Benchmark: Resolving Shared Memory Bank Conflicts with Padding',
//     phase: 'C++ & CUDA Foundations',
//     status: 'in-progress',
//     isStarred: true,
//     interactiveLabId: 'bankconflict',
//     summary: 'Benchmarking all 8 matrix transpose variants from NVIDIA/cuda-samples on modern GPUs. Eliminating bank conflict replays by padding shared memory tile declarations.',
//     explanation: `Deep dive into matrix transpose optimizations, reproducing the exact memory bandwidth saturation curve from NVIDIA's canonical cuda-samples.
// Validating the effect of padding __shared__ float tile[32][33] to eliminate all 32-way bank conflicts during the write phase.`,
//     keyInsights: ['Bank conflict elimination achieves over 92% of peak DRAM bandwidth on transpose.'],
//     resources: [{ title: 'NVIDIA/cuda-samples: matrixTranspose', type: 'repo' }]
//   },
//   {
//     id: 'day-15',
//     dayNumber: 15,
//     date: '2026-03-15',
//     title: 'Asynchronous Memory Transfers & CUDA Streams: Compute & Copy Overlap',
//     phase: 'C++ & CUDA Foundations',
//     status: 'in-progress',
//     isStarred: false,
//     summary: 'Implementing multi-stream pipelining with cudaMemcpyAsync and page-locked (pinned) host memory to overlap PCIe data transfers with kernel execution.',
//     explanation: `Dissecting how non-default CUDA streams allow hardware copy engines and compute engines to execute concurrently, hiding host-device transfer latency.`,
//     keyInsights: ['Host memory must be allocated with cudaMallocHost (pinned) for asynchronous DMA copies.'],
//     resources: [{ title: 'CUDA C++ Guide: Asynchronous Concurrent Execution', type: 'docs' }]
//   },
//   {
//     id: 'day-35',
//     dayNumber: 35,
//     date: '2026-04-04',
//     title: 'Phase 1 Capstone: Writing and Benchmarking a CUDA Kernel from Scratch',
//     phase: 'C++ & CUDA Foundations',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Phase 1 Exit Milestone: Write, optimize, and debug a production-grade CUDA kernel from a blank editor with zero copy-pasting, achieving within 2x of cuBLAS.',
//     explanation: `Culmination of Weeks 1–5: C++ and CUDA Foundations. Demonstrating mastery of thread hierarchies, memory coalescing, shared memory tiling, bank conflict elimination, and warp shuffles.`,
//     keyInsights: ['Exit signal: Able to write, compile, and debug a CUDA kernel from scratch without looking up boilerplate.'],
//     resources: [{ title: 'karpathy/llm.c repository kernel implementations', type: 'repo' }]
//   },
//   {
//     id: 'day-42',
//     dayNumber: 42,
//     date: '2026-04-11',
//     title: 'Nsight Compute (NCU) Deep Dive: Roofline Model, Speed-of-Light & Stalls',
//     phase: 'Performance Engineering',
//     status: 'planned',
//     isStarred: true,
//     interactiveLabId: 'roofline',
//     summary: 'Profiling GPU kernels with NVIDIA Nsight Compute: diagnosing Warp Scheduler stall reasons (Long Scoreboard, Barrier, Wait), inspecting SASS, and analyzing Speed-of-Light (SOL).',
//     explanation: `Learning the core instrumentation toolkit of GPU performance engineers:
// 1. Speed-of-Light (SOL) compute vs memory utilization breakdown.
// 2. Warp stall analysis: identifying Long Scoreboard (waiting on global memory) vs MIO Throttle vs Barrier stalls.
// 3. Placing kernels on the hardware Roofline curve.`,
//     keyInsights: ['Long Scoreboard stalls mean your kernel is memory-latency bound.'],
//     resources: [{ title: 'NVIDIA Nsight Compute Documentation & Profiling Guide', type: 'docs' }]
//   },
//   {
//     id: 'day-58',
//     dayNumber: 58,
//     date: '2026-04-27',
//     title: 'Fused LayerNorm in OpenAI Triton: Eliminating HBM Roundtrips with SRAM',
//     phase: 'Performance Engineering',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Writing a custom fused LayerNorm kernel in Triton. Keeping mean and variance in fast on-chip SRAM to eliminate redundant global memory passes.',
//     explanation: `PyTorch native LayerNorm executes multiple separate kernels: mean calculation, variance calculation, normalization, affine transform.
// In Triton: load tile, compute mean and variance via online algorithm, normalize, scale, and write to HBM in a single kernel pass.`,
//     keyInsights: ['Operator fusion eliminates memory bandwidth roundtrips, often delivering 2–4x end-to-end speedups for memory-bound layers.'],
//     resources: [{ title: 'OpenAI Triton Tutorial 02: Fused Softmax & LayerNorm', type: 'docs', url: 'https://triton-lang.org/main/getting-started/tutorials/02-fused-softmax.html' }]
//   },
//   {
//     id: 'day-70',
//     dayNumber: 70,
//     date: '2026-05-09',
//     title: 'Phase 2 Capstone: Diagnosing a Bottlenecked Kernel & Explaining Its Roofline',
//     phase: 'Performance Engineering',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Phase 2 Exit Milestone: Take a poorly performing kernel, profile with Nsight Compute, explain its exact roofline bottleneck, and refactor in Triton to hit theoretical memory limits.',
//     explanation: `Exit signal for Phase 2: Given an unoptimized kernel, diagnose whether it is latency, bandwidth, or compute bound, and systematically fix it.`,
//     keyInsights: ['A disciplined performance engineer never guesses; profiler metrics dictate the next optimization.'],
//     resources: [{ title: 'GPU MODE Profiling Lectures', type: 'video' }]
//   },
//   {
//     id: 'day-78',
//     dayNumber: 78,
//     date: '2026-05-17',
//     title: 'Tensor Cores & WMMA API: Hardware Matrix Multiply-Accumulate in C++',
//     phase: 'Frontier Kernel Engineering',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Programming Tensor Cores using nvcuda::wmma API: loading fragments, computing m16n16k16 mixed-precision FP16 operations, and achieving near-cuBLAS parity.',
//     explanation: `Transitioning from CUDA core scalar ALUs to dedicated Tensor Core hardware units.
// Tensor Cores operate on entire 16x16 matrix fragments simultaneously within a warp (32 threads). Understanding fragment layout and accumulation in FP32.`,
//     keyInsights: ['Tensor Cores provide an order-of-magnitude higher peak compute density than CUDA cores.'],
//     resources: [{ title: 'NVIDIA CUDA C++ Guide: Warp Matrix Multiply and Accumulate (WMMA)', type: 'docs' }]
//   },
//   {
//     id: 'day-84',
//     dayNumber: 84,
//     date: '2026-05-23',
//     title: 'FlashAttention-1 from Scratch: Online Softmax & Breaking the O(N^2) Memory Wall',
//     phase: 'Frontier Kernel Engineering',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Tri Dao\'s breakthrough FlashAttention-1: tiling Q, K, V into fast SRAM, computing softmax online via Milakov & Gimelshein rescaling, avoiding the N×N HBM matrix materialization.',
//     explanation: `Standard attention requires storing the full N×N attention score matrix S = Q @ K.T in global DRAM (HBM), leading to O(N^2) memory traffic.
// FlashAttention tiles queries and keys into SRAM, computes softmax incrementally by tracking running max m and sum l, and scales output O dynamically.
// Result: Reduces HBM accesses from O(N^2) to O(N), yielding 2–4x wall-clock speedup and enabling massive context windows!`,
//     formula: {
//       name: 'Online Softmax Rescaling',
//       latex: 'm_{\\text{new}} = \\max(m, x_i), \\quad l_{\\text{new}} = l \\cdot e^{m - m_{\\text{new}}} + e^{x_i - m_{\\text{new}}}',
//       description: 'Online softmax tracks running max and denominator, updating output accumulators without full array passes.'
//     },
//     keyInsights: ['FlashAttention is not an approximation; it computes exact attention while drastically reducing HBM I/O.'],
//     resources: [{ title: 'Dao et al. (2022): FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness', type: 'paper', url: 'https://arxiv.org/abs/2205.14135' }]
//   },
//   {
//     id: 'day-90',
//     dayNumber: 90,
//     date: '2026-05-29',
//     title: 'FlashAttention-2: Causal Masking, Warp Partitioning & Parallelizing the Forward Pass',
//     phase: 'Frontier Kernel Engineering',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Dissecting FlashAttention-2 architectural upgrades: parallelizing over sequence length instead of batch/heads, reducing non-matmul FLOPs, and optimizing warp layout in SRAM.',
//     explanation: `Deep dive into what made FA2 twice as fast as FA1:
// 1. Swapped the order of outer/inner loops: loop over K, V in outer loop and Q in inner loop to parallelize over sequence dimension.
// 2. Warp partitioning: avoid communication across warps during attention softmax accumulation.
// 3. Skip empty blocks in lower-triangular causal attention masking.`,
//     keyInsights: ['FA2 reaches up to 73% of theoretical peak A100 device throughput.'],
//     resources: [{ title: 'Tri Dao (2023): FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning', type: 'paper' }]
//   },
//   {
//     id: 'day-96',
//     dayNumber: 96,
//     date: '2026-06-04',
//     title: 'FlashAttention-3 & Hopper Architecture: Asynchronous TMA & WGMMA',
//     phase: 'Frontier Kernel Engineering',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Studying FA3 on NVIDIA Hopper (H100): Tensor Memory Accelerator (TMA) hardware copies, Warpgroup MMA (WGMMA) instructions, and Warp Specialization.',
//     explanation: `Exploring cutting-edge Hopper innovations:
// - TMA (Tensor Memory Accelerator): Hardware unit copies 2D/3D tensor tiles from global memory directly to shared memory asynchronously without using register files or SM ALUs!
// - WGMMA: Warpgroup instructions that execute on 128 threads simultaneously.
// - Ping-pong pipelining: One warpgroup produces loads while another computes matmul.`,
//     keyInsights: ['Hopper TMA decouples address generation from compute, eliminating register pressure during loads.'],
//     resources: [{ title: 'FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-Precision', type: 'paper' }]
//   },
//   {
//     id: 'day-102',
//     dayNumber: 102,
//     date: '2026-06-10',
//     title: 'FlashAttention-4 & Blackwell Architecture: NVFP4 & Dual-Issue FP4 Tensor Cores',
//     phase: 'Frontier Kernel Engineering',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Investigating NVIDIA Blackwell B200 architecture: second-generation Transformer Engine, micro-scaled NVFP4 quantization, and dual-issue FP4 Tensor Cores.',
//     explanation: `Dissecting where frontier kernel engineering is heading in 2026:
// Blackwell introduces native micro-tensor scaling with 4-bit floating point (NVFP4), doubling compute throughput compared to FP8.
// Understanding how FlashAttention-4 adapts to micro-scaled blocks and block-quantized KV caches.`,
//     keyInsights: ['FP4 precision requires hardware micro-scaling factors to preserve numerical fidelity in deep LLMs.'],
//     resources: [{ title: 'NVIDIA Blackwell Architecture Whitepaper', type: 'docs' }]
//   },
//   {
//     id: 'day-108',
//     dayNumber: 108,
//     date: '2026-06-16',
//     title: 'Modern Triton to CUTLASS 3.x: CuTe Layout Algebra (Shape, Stride & Coshape)',
//     phase: 'Frontier Kernel Engineering',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Mastering NVIDIA CUTLASS 3.x and the CuTe C++ template library: manipulating multi-dimensional tensor layouts using coordinate algebras.',
//     explanation: `CuTe provides a unified mathematical language for describing tensor layouts:
// Layout = (Shape, Stride).
// Manipulating hierarchical tiles, partitioned layouts, and tensor sub-views in modern C++ templates, bridging the gap between high-level Python DSLs and bare-metal CUDA.`,
//     keyInsights: ['CuTe abstracts away manual index arithmetic, allowing compile-time layout transformations.'],
//     resources: [{ title: 'NVIDIA/cutlass: CuTe Tutorial & Documentation', type: 'repo', url: 'https://github.com/NVIDIA/cutlass' }]
//   },
//   {
//     id: 'day-114',
//     dayNumber: 114,
//     date: '2026-06-22',
//     title: 'DeepSeek DeepGEMM Architecture: Unrolled TMA GEMM in ~300 Lines of C++',
//     phase: 'Frontier Kernel Engineering',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Dissecting DeepSeek\'s open-source DeepGEMM library: how ~300 lines of clean, unrolled C++ with Hopper TMA outperforms monolithic vendor BLAS libraries.',
//     explanation: `DeepGEMM is a masterclass in modern kernel minimalism:
// Instead of hundreds of thousands of lines in cuBLAS, DeepSeek wrote a targeted, fully unrolled TMA Hopper GEMM in ~300 lines of CUDA/C++.
// Analyzing how their lean scheduling beats general-purpose vendor libraries for specific transformer matrix dimensions.`,
//     keyInsights: ['Lean, custom-tailored kernels with zero runtime dispatch overhead regularly beat monolithic general-purpose libraries.'],
//     resources: [{ title: 'deepseek-ai/DeepGEMM repository on GitHub', type: 'repo', url: 'https://github.com/deepseek-ai/DeepGEMM' }]
//   },
//   {
//     id: 'day-118',
//     dayNumber: 118,
//     date: '2026-06-26',
//     title: 'DeepSeek FlashMLA: Multi-Head Latent Attention Decoding for 128k Contexts',
//     phase: 'Frontier Kernel Engineering',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Analyzing DeepSeek-V3 / R1 FlashMLA kernel: low-rank KV cache compression, latent attention vector decoding, and extreme memory bandwidth savings.',
//     explanation: `Multi-Head Latent Attention (MLA) compresses the KV cache into a low-dimensional latent vector c_t^{KV}, slashing serving KV memory footprint by up to 93%!
// Dissecting the FlashMLA custom decoding kernel written specifically for Hopper GPUs.`,
//     keyInsights: ['MLA transforms memory-bound LLM decoding by drastically shrinking KV cache transfer volumes.'],
//     resources: [{ title: 'deepseek-ai/FlashMLA repository on GitHub', type: 'repo', url: 'https://github.com/deepseek-ai/FlashMLA' }]
//   },
//   {
//     id: 'day-120',
//     dayNumber: 120,
//     date: '2026-06-28',
//     title: 'Phase 3 Capstone: Pushing GEMM to cuBLAS Parity & Modifying a CUTLASS Tile',
//     phase: 'Frontier Kernel Engineering',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Phase 3 Exit Milestone: Push a custom matmul within 80–90% of cuBLAS, author FlashAttention from scratch, and modify a CUTLASS CuTe tile example.',
//     explanation: `The frontier kernel engineer milestone: proving the capability to write kernels that compete directly with vendor baselines on modern GPU architectures.`,
//     keyInsights: ['This milestone separates kernel users from kernel authors.'],
//     resources: [{ title: 'Sarvam AI Kernel Engineer Job Description & Technical Expectations', type: 'docs' }]
//   },
//   {
//     id: 'day-130',
//     dayNumber: 130,
//     date: '2026-07-08',
//     title: 'Collective Communication with NCCL: AllReduce, AllGather & Ring Topologies',
//     phase: 'Distributed Training',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Demystifying NVIDIA NCCL: Ring AllReduce vs Tree AllReduce, NVLink crossbar bandwidth, and calculating inter-node vs intra-node communication latencies.',
//     explanation: `In multi-GPU training, synchronization is bounded by collective communications:
// - Ring AllReduce algorithm: In 2*(P - 1) steps, all P GPUs compute global gradient sums while transferring exactly 2*(P - 1)/P * S data volume.
// - Contrasting 900 GB/s NVLink with 400 Gbps InfiniBand inter-node networks.`,
//     formula: {
//       name: 'Ring AllReduce Data Transferred',
//       latex: '\\text{Data Transferred} = 2 \\left( \\frac{P - 1}{P} \\right) \\times S',
//       description: 'Communication volume per GPU in a Ring AllReduce collective of P ranks with tensor size S.'
//     },
//     keyInsights: ['Ring AllReduce bandwidth requirement is independent of the number of GPUs P for large tensor sizes.'],
//     resources: [{ title: 'NVIDIA NCCL Documentation & Architecture Guides', type: 'docs' }]
//   },
//   {
//     id: 'day-145',
//     dayNumber: 145,
//     date: '2026-07-23',
//     title: 'Fully Sharded Data Parallel (FSDP) & DeepSpeed ZeRO-3: Memory Sharding',
//     phase: 'Distributed Training',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Deep dive into PyTorch FSDP (ZeRO-3): sharding optimizer states (ZeRO-1), gradients (ZeRO-2), and model parameters (ZeRO-3) across ranks to fit 70B+ LLMs on commodity clusters.',
//     explanation: `Standard DDP replicates the full model, gradients, and optimizer states on every GPU.
// ZeRO-3 shards all three components across all ranks, fetching model weights on-the-fly via AllGather right before the forward and backward passes, and discarding them immediately after.`,
//     keyInsights: ['ZeRO-3 enables training models whose parameters exceed single-GPU VRAM capacity.'],
//     resources: [{ title: 'Rajbhandari et al.: ZeRO: Memory Optimizations Toward Training Trillion Parameter Models', type: 'paper' }]
//   },
//   {
//     id: 'day-160',
//     dayNumber: 160,
//     date: '2026-08-07',
//     title: 'Phase 4 Capstone: Multi-GPU Training Run Scaling & Upstream Open-Source PR',
//     phase: 'Distributed Training',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Phase 4 Exit Milestone: Fine-tune a 1–3B model across multi-GPU nodes with FSDP, profile communication/computation overlap, and submit a contribution PR to Megatron-LM or DeepSpeed.',
//     explanation: `Verifying multi-GPU distributed training capabilities and demonstrating public open-source contribution to the ML infrastructure ecosystem.`,
//     keyInsights: ['Exit signal: Able to diagnose non-linear multi-GPU scaling bottlenecks using PyTorch profiler traces.'],
//     resources: [{ title: 'PyTorch FSDP Tutorials & DeepSpeed Documentation', type: 'docs' }]
//   },
//   {
//     id: 'day-172',
//     dayNumber: 172,
//     date: '2026-08-19',
//     title: 'KV Cache Architecture & PagedAttention: Eliminating Virtual Memory Fragmentation',
//     phase: 'Inference & Serving',
//     status: 'planned',
//     isStarred: true,
//     summary: 'vLLM and PagedAttention: treating GPU VRAM like operating system virtual memory pages to eliminate 60–80% internal and external KV cache memory fragmentation.',
//     explanation: `In standard LLM serving, KV caches must be pre-allocated contiguously for the maximum sequence length (e.g. 4k tokens), causing immense memory waste.
// PagedAttention allocates KV cache in fixed-size blocks (e.g. 16 tokens) mapped through a block table, similar to OS page tables.
// This increases serving concurrency by 2–4x under identical hardware constraints!`,
//     formula: {
//       name: 'PagedAttention Block Indexing',
//       latex: 'K_{i} = \\text{BlockTable}[\\lfloor i / B \\rfloor][i \\bmod B]',
//       description: 'Maps logical sequence token position i to non-contiguous physical KV block address with block size B.'
//     },
//     keyInsights: ['PagedAttention enables near-zero memory waste and safe memory sharing during parallel sampling and beam search.'],
//     resources: [{ title: 'Kwon et al. (2023): Efficient Memory Management for Large Language Model Serving with PagedAttention (vLLM)', type: 'paper', url: 'https://arxiv.org/abs/2309.06180' }]
//   },
//   {
//     id: 'day-195',
//     dayNumber: 195,
//     date: '2026-09-11',
//     title: 'Chunked Prefill & Continuous Batching: Balancing TTFT & TPOT in Production',
//     phase: 'Inference & Serving',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Architecting continuous batching engines: co-scheduling compute-bound prompt prefill tokens and memory-bound token decoding steps to maintain stable SLA latency.',
//     explanation: `Prefill (prompt processing) is compute-heavy and high arithmetic intensity.
// Decode (generating next token) is strictly memory-bandwidth bound.
// Chunked prefill chops long prompts into chunks, interleaving them with decode steps to eliminate decode pauses and prevent TTFT spikes.`,
//     keyInsights: ['Balancing TTFT (Time To First Token) and TPOT (Time Per Output Token) is the primary SLA metric in modern LLM serving.'],
//     resources: [{ title: 'Sarathi-Serve / vLLM Chunked Prefill Documentation', type: 'docs' }]
//   },
//   {
//     id: 'day-210',
//     dayNumber: 210,
//     date: '2026-09-26',
//     title: 'Phase 5 Capstone: Deploying a Serving Engine & Shipping a Custom Kernel',
//     phase: 'Inference & Serving',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Phase 5 Exit Milestone: Deploy a vLLM/SGLang server with a 7B model, benchmark p50/p95 latency, implement a custom quantization kernel, and integrate it into serving.',
//     explanation: `Exit signal: Bridging custom low-level kernel development with production inference serving infrastructure.`,
//     keyInsights: ['Shipping a kernel into an open-source serving engine is the gold standard proof-of-work for inference engineering roles.'],
//     resources: [{ title: 'vLLM and SGLang GitHub repositories', type: 'repo' }]
//   },
//   {
//     id: 'day-235',
//     dayNumber: 235,
//     date: '2026-10-21',
//     title: 'Deep System Architecture Mock Interviews: Roofline Derivations & Scaling Laws',
//     phase: 'Portfolio & Job Search',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Simulating rigorous ML systems technical interviews: deriving GPU memory bandwidth limits on a whiteboard, calculating MFU (Model FLOPs Utilization), and serving trade-offs.',
//     explanation: `Practicing the core questions asked in tier-1 GPU systems and kernel engineer loops:
// - What is the arithmetic intensity of attention?
// - How does FlashAttention reduce HBM traffic without changing output numbers?
// - When does a kernel suffer from bank conflicts, and how do you eliminate them?
// - How do you balance tensor parallelism and pipeline parallelism across nodes?`,
//     keyInsights: ['First-principles clarity under pressure is what interviewers look for.'],
//     resources: [{ title: 'LeetGPU Challenges & Systems Interview Question Sets', type: 'practice' }]
//   },
//   {
//     id: 'day-250',
//     dayNumber: 250,
//     date: '2026-11-05',
//     title: 'Grand Retrospective & The 250 Days of KPI Synthesis: From Python to Kernel Architect',
//     phase: 'Portfolio & Job Search',
//     status: 'planned',
//     isStarred: true,
//     summary: 'The culmination of 250 days (36 weeks, ~720 hours) of Kernel Performance and Inference Engineering. Complete portfolio review and readiness dossier.',
//     explanation: `Full synthesis of the 250-day transformation:
// - Phase 1: Modern C++, CUDA execution model, shared memory tiling, bank conflict elimination.
// - Phase 2: Nsight Systems, Nsight Compute Roofline profiling, PyTorch C++ extensions, Triton.
// - Phase 3: The Frontier Kernel ladder, cuBLAS parity, FlashAttention 1→4, CUTLASS CuTe, DeepSeek DeepGEMM & FlashMLA.
// - Phase 4: Distributed Training, NCCL collectives, FSDP ZeRO-3, Megatron-LM.
// - Phase 5: vLLM & SGLang internals, PagedAttention, custom serving quantization kernels.
// - Phase 6: Production portfolio, live benchmark artifacts, interview defense.

// Ready to author high-performance kernels that beat published baselines.`,
//     keyInsights: [
//       'The journey from mid-level Python ML practitioner to GPU systems and kernel performance engineer.',
//       'Hardware reality always trumps software abstractions.'
//     ],
//     resources: [{ title: '250 Days of KPI — Complete Engineering Repository & Worklogs', type: 'repo', url: 'https://github.com/schakraborty-lmb20/250-days-of-kpi' }]
//   }
];
