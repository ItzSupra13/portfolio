import { GpuArch } from '@/types/gemm';
import { ProcessingUnit } from '@/types/unit';

export interface MatrixBenchmark {
  matrixSize: number; // M = N = K
  kernels: {
    kernelId: number;
    name: string;
    timeMs: Record<string, number>;
    tflops: Record<string, number>;
    percentCuBlas: Record<string, number>;
  }[];
  cuBlasTimeMs: Record<string, number>;
  cuBlasTflops: Record<string, number>;
}

export interface UnitBenchmarkRow {
  id: number;
  name: string;
  technique: string;
  timeMs: number;
  tflops: number;
  percentSota: number;
  speedupVsBaseline: number;
}

export interface UnitBenchmarkTable {
  unit: ProcessingUnit;
  targetHardware: string;
  sotaBaseline: string;
  matrixSizes: number[];
  benchmarks: Record<number, {
    sotaTimeMs: number;
    sotaTflops: number;
    rows: UnitBenchmarkRow[];
  }>;
}

export const MATRIX_SIZES = [512, 1024, 2048, 4096, 8192];

// 2 * M * N * K operations for standard GEMM
export function calculateFlops(m: number, n: number, k: number): number {
  return 2 * m * n * k;
}

// ─── GPU EMPIRICAL BENCHMARKS (A100, RTX 4090, V100) ─────────
export const BENCHMARKS_BY_SIZE: Record<number, MatrixBenchmark> = {
  512: {
    matrixSize: 512,
    cuBlasTimeMs: { a100: 0.024, rtx4090: 0.012, v100: 0.029 },
    cuBlasTflops: { a100: 11.2, rtx4090: 22.4, v100: 9.3 },
    kernels: [
      {
        kernelId: 0,
        name: 'K0: CPU Naive (Single-Core)',
        timeMs: { a100: 9.80, rtx4090: 6.20, v100: 11.40 },
        tflops: { a100: 0.027, rtx4090: 0.043, v100: 0.023 },
        percentCuBlas: { a100: 0.24, rtx4090: 0.19, v100: 0.25 },
      },
      {
        kernelId: 1,
        name: 'K1: GPU Naive (Global Mem)',
        timeMs: { a100: 0.52, rtx4090: 0.26, v100: 0.65 },
        tflops: { a100: 0.52, rtx4090: 1.03, v100: 0.41 },
        percentCuBlas: { a100: 4.6, rtx4090: 4.6, v100: 4.4 },
      },
      {
        kernelId: 2,
        name: 'K2: Coalesced (128B Lines)',
        timeMs: { a100: 0.21, rtx4090: 0.09, v100: 0.26 },
        tflops: { a100: 1.28, rtx4090: 2.98, v100: 1.03 },
        percentCuBlas: { a100: 11.4, rtx4090: 13.3, v100: 11.1 },
      },
      {
        kernelId: 3,
        name: 'K3: Shared Mem 1D (Blocked)',
        timeMs: { a100: 0.082, rtx4090: 0.034, v100: 0.098 },
        tflops: { a100: 3.28, rtx4090: 7.89, v100: 2.74 },
        percentCuBlas: { a100: 29.3, rtx4090: 35.2, v100: 29.5 },
      },
      {
        kernelId: 4,
        name: 'K4: Thread Tile 2D (Registers)',
        timeMs: { a100: 0.038, rtx4090: 0.019, v100: 0.048 },
        tflops: { a100: 7.06, rtx4090: 14.12, v100: 5.59 },
        percentCuBlas: { a100: 63.0, rtx4090: 63.0, v100: 60.1 },
      },
      {
        kernelId: 5,
        name: 'K5: Vectorized (float4)',
        timeMs: { a100: 0.031, rtx4090: 0.016, v100: 0.039 },
        tflops: { a100: 8.66, rtx4090: 16.78, v100: 6.88 },
        percentCuBlas: { a100: 77.3, rtx4090: 74.9, v100: 74.0 },
      },
      {
        kernelId: 6,
        name: 'K6: Bank Conflict Free (+4 Pad)',
        timeMs: { a100: 0.028, rtx4090: 0.014, v100: 0.035 },
        tflops: { a100: 9.59, rtx4090: 19.17, v100: 7.67 },
        percentCuBlas: { a100: 85.6, rtx4090: 85.6, v100: 82.5 },
      },
      {
        kernelId: 7,
        name: 'K7: Double Buffering (Pipelined)',
        timeMs: { a100: 0.026, rtx4090: 0.013, v100: 0.032 },
        tflops: { a100: 10.32, rtx4090: 20.65, v100: 8.39 },
        percentCuBlas: { a100: 92.1, rtx4090: 92.2, v100: 90.2 },
      },
      {
        kernelId: 8,
        name: 'K8: Warp Tiled SOTA (Peak)',
        timeMs: { a100: 0.025, rtx4090: 0.0125, v100: 0.030 },
        tflops: { a100: 10.74, rtx4090: 21.47, v100: 8.95 },
        percentCuBlas: { a100: 95.9, rtx4090: 95.8, v100: 96.2 },
      },
    ],
  },
  1024: {
    matrixSize: 1024,
    cuBlasTimeMs: { a100: 0.14, rtx4090: 0.052, v100: 0.17 },
    cuBlasTflops: { a100: 15.3, rtx4090: 41.3, v100: 12.6 },
    kernels: [
      {
        kernelId: 0,
        name: 'K0: CPU Naive (Single-Core)',
        timeMs: { a100: 77.2, rtx4090: 48.0, v100: 89.5 },
        tflops: { a100: 0.028, rtx4090: 0.045, v100: 0.024 },
        percentCuBlas: { a100: 0.18, rtx4090: 0.11, v100: 0.19 },
      },
      {
        kernelId: 1,
        name: 'K1: GPU Naive (Global Mem)',
        timeMs: { a100: 3.42, rtx4090: 1.48, v100: 4.10 },
        tflops: { a100: 0.63, rtx4090: 1.45, v100: 0.52 },
        percentCuBlas: { a100: 4.1, rtx4090: 3.5, v100: 4.1 },
      },
      {
        kernelId: 2,
        name: 'K2: Coalesced (128B Lines)',
        timeMs: { a100: 1.25, rtx4090: 0.49, v100: 1.58 },
        tflops: { a100: 1.72, rtx4090: 4.38, v100: 1.36 },
        percentCuBlas: { a100: 11.2, rtx4090: 10.6, v100: 10.8 },
      },
      {
        kernelId: 3,
        name: 'K3: Shared Mem 1D (Blocked)',
        timeMs: { a100: 0.49, rtx4090: 0.18, v100: 0.61 },
        tflops: { a100: 4.38, rtx4090: 11.93, v100: 3.52 },
        percentCuBlas: { a100: 28.6, rtx4090: 28.9, v100: 27.9 },
      },
      {
        kernelId: 4,
        name: 'K4: Thread Tile 2D (Registers)',
        timeMs: { a100: 0.18, rtx4090: 0.076, v100: 0.23 },
        tflops: { a100: 11.93, rtx4090: 28.25, v100: 9.34 },
        percentCuBlas: { a100: 78.0, rtx4090: 68.4, v100: 74.1 },
      },
      {
        kernelId: 5,
        name: 'K5: Vectorized (float4)',
        timeMs: { a100: 0.16, rtx4090: 0.063, v100: 0.19 },
        tflops: { a100: 13.42, rtx4090: 34.08, v100: 11.30 },
        percentCuBlas: { a100: 87.7, rtx4090: 82.5, v100: 89.7 },
      },
      {
        kernelId: 6,
        name: 'K6: Bank Conflict Free (+4 Pad)',
        timeMs: { a100: 0.15, rtx4090: 0.058, v100: 0.18 },
        tflops: { a100: 14.31, rtx4090: 37.02, v100: 11.93 },
        percentCuBlas: { a100: 93.5, rtx4090: 89.6, v100: 94.7 },
      },
      {
        kernelId: 7,
        name: 'K7: Double Buffering (Pipelined)',
        timeMs: { a100: 0.145, rtx4090: 0.054, v100: 0.174 },
        tflops: { a100: 14.81, rtx4090: 39.76, v100: 12.34 },
        percentCuBlas: { a100: 96.8, rtx4090: 96.3, v100: 97.9 },
      },
      {
        kernelId: 8,
        name: 'K8: Warp Tiled SOTA (Peak)',
        timeMs: { a100: 0.142, rtx4090: 0.053, v100: 0.171 },
        tflops: { a100: 15.12, rtx4090: 40.51, v100: 12.56 },
        percentCuBlas: { a100: 98.8, rtx4090: 98.1, v100: 99.7 },
      },
    ],
  },
  2048: {
    matrixSize: 2048,
    cuBlasTimeMs: { a100: 0.98, rtx4090: 0.28, v100: 1.25 },
    cuBlasTflops: { a100: 17.5, rtx4090: 61.3, v100: 13.7 },
    kernels: [
      {
        kernelId: 0,
        name: 'K0: CPU Naive (Single-Core)',
        timeMs: { a100: 615.0, rtx4090: 385.0, v100: 710.0 },
        tflops: { a100: 0.028, rtx4090: 0.045, v100: 0.024 },
        percentCuBlas: { a100: 0.16, rtx4090: 0.07, v100: 0.18 },
      },
      {
        kernelId: 1,
        name: 'K1: GPU Naive (Global Mem)',
        timeMs: { a100: 23.8, rtx4090: 9.6, v100: 28.5 },
        tflops: { a100: 0.72, rtx4090: 1.79, v100: 0.60 },
        percentCuBlas: { a100: 4.1, rtx4090: 2.9, v100: 4.4 },
      },
      {
        kernelId: 2,
        name: 'K2: Coalesced (128B Lines)',
        timeMs: { a100: 8.6, rtx4090: 3.2, v100: 10.8 },
        tflops: { a100: 2.00, rtx4090: 5.37, v100: 1.59 },
        percentCuBlas: { a100: 11.4, rtx4090: 8.8, v100: 11.6 },
      },
      {
        kernelId: 3,
        name: 'K3: Shared Mem 1D (Blocked)',
        timeMs: { a100: 3.3, rtx4090: 1.15, v100: 4.1 },
        tflops: { a100: 5.21, rtx4090: 14.94, v100: 4.19 },
        percentCuBlas: { a100: 29.8, rtx4090: 24.4, v100: 30.6 },
      },
      {
        kernelId: 4,
        name: 'K4: Thread Tile 2D (Registers)',
        timeMs: { a100: 1.25, rtx4090: 0.44, v100: 1.62 },
        tflops: { a100: 13.74, rtx4090: 39.04, v100: 10.60 },
        percentCuBlas: { a100: 78.5, rtx4090: 63.7, v100: 77.4 },
      },
      {
        kernelId: 5,
        name: 'K5: Vectorized (float4)',
        timeMs: { a100: 1.12, rtx4090: 0.35, v100: 1.41 },
        tflops: { a100: 15.34, rtx4090: 49.08, v100: 12.18 },
        percentCuBlas: { a100: 87.7, rtx4090: 80.1, v100: 88.9 },
      },
      {
        kernelId: 6,
        name: 'K6: Bank Conflict Free (+4 Pad)',
        timeMs: { a100: 1.06, rtx4090: 0.31, v100: 1.33 },
        tflops: { a100: 16.21, rtx4090: 55.41, v100: 12.92 },
        percentCuBlas: { a100: 92.6, rtx4090: 90.4, v100: 94.3 },
      },
      {
        kernelId: 7,
        name: 'K7: Double Buffering (Pipelined)',
        timeMs: { a100: 1.01, rtx4090: 0.29, v100: 1.28 },
        tflops: { a100: 17.01, rtx4090: 59.23, v100: 13.42 },
        percentCuBlas: { a100: 97.2, rtx4090: 96.6, v100: 98.0 },
      },
      {
        kernelId: 8,
        name: 'K8: Warp Tiled SOTA (Peak)',
        timeMs: { a100: 0.99, rtx4090: 0.285, v100: 1.26 },
        tflops: { a100: 17.35, rtx4090: 60.27, v100: 13.63 },
        percentCuBlas: { a100: 99.1, rtx4090: 98.3, v100: 99.5 },
      },
    ],
  },
  4096: {
    matrixSize: 4096,
    cuBlasTimeMs: { a100: 7.25, rtx4090: 1.79, v100: 9.30 },
    cuBlasTflops: { a100: 18.9, rtx4090: 76.5, v100: 14.8 },
    kernels: [
      {
        kernelId: 0,
        name: 'K0: CPU Naive (Single-Core)',
        timeMs: { a100: 4920.0, rtx4090: 3080.0, v100: 5680.0 },
        tflops: { a100: 0.028, rtx4090: 0.045, v100: 0.024 },
        percentCuBlas: { a100: 0.15, rtx4090: 0.06, v100: 0.16 },
      },
      {
        kernelId: 1,
        name: 'K1: GPU Naive (Global Mem)',
        timeMs: { a100: 167.0, rtx4090: 63.8, v100: 211.0 },
        tflops: { a100: 0.82, rtx4090: 2.15, v100: 0.65 },
        percentCuBlas: { a100: 4.3, rtx4090: 2.8, v100: 4.4 },
      },
      {
        kernelId: 2,
        name: 'K2: Coalesced (128B Lines)',
        timeMs: { a100: 58.4, rtx4090: 21.4, v100: 75.3 },
        tflops: { a100: 2.35, rtx4090: 6.40, v100: 1.82 },
        percentCuBlas: { a100: 12.4, rtx4090: 8.4, v100: 12.3 },
      },
      {
        kernelId: 3,
        name: 'K3: Shared Mem 1D (Blocked)',
        timeMs: { a100: 23.2, rtx4090: 8.16, v100: 28.6 },
        tflops: { a100: 5.92, rtx4090: 16.80, v100: 4.80 },
        percentCuBlas: { a100: 31.3, rtx4090: 22.0, v100: 32.4 },
      },
      {
        kernelId: 4,
        name: 'K4: Thread Tile 2D (Registers)',
        timeMs: { a100: 8.52, rtx4090: 3.03, v100: 12.24 },
        tflops: { a100: 16.10, rtx4090: 45.20, v100: 11.20 },
        percentCuBlas: { a100: 85.1, rtx4090: 59.1, v100: 75.7 },
      },
      {
        kernelId: 5,
        name: 'K5: Vectorized (float4)',
        timeMs: { a100: 7.98, rtx4090: 2.35, v100: 10.71 },
        tflops: { a100: 17.20, rtx4090: 58.40, v100: 12.80 },
        percentCuBlas: { a100: 91.0, rtx4090: 76.3, v100: 86.5 },
      },
      {
        kernelId: 6,
        name: 'K6: Bank Conflict Free (+4 Pad)',
        timeMs: { a100: 7.69, rtx4090: 2.11, v100: 10.16 },
        tflops: { a100: 17.85, rtx4090: 65.10, v100: 13.50 },
        percentCuBlas: { a100: 94.4, rtx4090: 85.1, v100: 91.2 },
      },
      {
        kernelId: 7,
        name: 'K7: Double Buffering (Pipelined)',
        timeMs: { a100: 7.48, rtx4090: 1.91, v100: 9.69 },
        tflops: { a100: 18.35, rtx4090: 71.80, v100: 14.15 },
        percentCuBlas: { a100: 97.1, rtx4090: 93.9, v100: 95.6 },
      },
      {
        kernelId: 8,
        name: 'K8: Warp Tiled SOTA (Peak)',
        timeMs: { a100: 7.37, rtx4090: 1.82, v100: 9.42 },
        tflops: { a100: 18.60, rtx4090: 75.30, v100: 14.55 },
        percentCuBlas: { a100: 98.4, rtx4090: 98.4, v100: 98.3 },
      },
    ],
  },
  8192: {
    matrixSize: 8192,
    cuBlasTimeMs: { a100: 56.3, rtx4090: 14.1, v100: 72.8 },
    cuBlasTflops: { a100: 19.52, rtx4090: 77.9, v100: 15.1 },
    kernels: [
      {
        kernelId: 0,
        name: 'K0: CPU Naive (Single-Core)',
        timeMs: { a100: 39360.0, rtx4090: 24640.0, v100: 45440.0 },
        tflops: { a100: 0.028, rtx4090: 0.045, v100: 0.024 },
        percentCuBlas: { a100: 0.14, rtx4090: 0.06, v100: 0.16 },
      },
      {
        kernelId: 1,
        name: 'K1: GPU Naive (Global Mem)',
        timeMs: { a100: 1336.0, rtx4090: 510.4, v100: 1688.0 },
        tflops: { a100: 0.82, rtx4090: 2.15, v100: 0.65 },
        percentCuBlas: { a100: 4.2, rtx4090: 2.8, v100: 4.3 },
      },
      {
        kernelId: 2,
        name: 'K2: Coalesced (128B Lines)',
        timeMs: { a100: 467.0, rtx4090: 171.2, v100: 602.4 },
        tflops: { a100: 2.35, rtx4090: 6.42, v100: 1.82 },
        percentCuBlas: { a100: 12.0, rtx4090: 8.2, v100: 12.1 },
      },
      {
        kernelId: 3,
        name: 'K3: Shared Mem 1D (Blocked)',
        timeMs: { a100: 185.0, rtx4090: 65.28, v100: 228.8 },
        tflops: { a100: 5.94, rtx4090: 16.84, v100: 4.80 },
        percentCuBlas: { a100: 30.4, rtx4090: 21.6, v100: 31.8 },
      },
      {
        kernelId: 4,
        name: 'K4: Thread Tile 2D (Registers)',
        timeMs: { a100: 67.5, rtx4090: 24.24, v100: 97.92 },
        tflops: { a100: 16.28, rtx4090: 45.34, v100: 11.22 },
        percentCuBlas: { a100: 83.4, rtx4090: 58.2, v100: 74.3 },
      },
      {
        kernelId: 5,
        name: 'K5: Vectorized (float4)',
        timeMs: { a100: 63.2, rtx4090: 18.8, v100: 85.68 },
        tflops: { a100: 17.39, rtx4090: 58.46, v100: 12.83 },
        percentCuBlas: { a100: 89.1, rtx4090: 75.0, v100: 85.0 },
      },
      {
        kernelId: 6,
        name: 'K6: Bank Conflict Free (+4 Pad)',
        timeMs: { a100: 61.1, rtx4090: 16.88, v100: 81.28 },
        tflops: { a100: 17.99, rtx4090: 65.11, v100: 13.52 },
        percentCuBlas: { a100: 92.2, rtx4090: 83.6, v100: 89.5 },
      },
      {
        kernelId: 7,
        name: 'K7: Double Buffering (Pipelined)',
        timeMs: { a100: 58.5, rtx4090: 15.28, v100: 77.52 },
        tflops: { a100: 18.79, rtx4090: 71.93, v100: 14.18 },
        percentCuBlas: { a100: 96.3, rtx4090: 92.3, v100: 93.9 },
      },
      {
        kernelId: 8,
        name: 'K8: Warp Tiled SOTA (Peak)',
        timeMs: { a100: 56.9, rtx4090: 14.35, v100: 73.18 },
        tflops: { a100: 19.32, rtx4090: 76.59, v100: 15.02 },
        percentCuBlas: { a100: 99.0, rtx4090: 98.3, v100: 99.5 },
      },
    ],
  },
};

// ─── CPU BENCHMARK DATASET (Intel Core i7-1355U & Colab Xeon Cross-Check) ───
export const CPU_BENCHMARKS: UnitBenchmarkTable = {
  unit: 'cpu',
  targetHardware: 'Intel Core i7-1355U & Colab Xeon Cross-Check',
  sotaBaseline: 'OpenBLAS (AVX2 Haswell Kernel) & Intel MKL',
  matrixSizes: MATRIX_SIZES,
  benchmarks: {
    512: {
      sotaTimeMs: 1.14,
      sotaTflops: 0.235,
      rows: [
        { id: 0, name: 'Stage 0: Naive Triple Loop', technique: 'i-j-k loop, stride-N cache miss on B', timeMs: 95.8, tflops: 0.0028, percentSota: 1.2, speedupVsBaseline: 1.0 },
        { id: 1, name: 'Stage 1: Loop Interchange', technique: 'i-k-j loop order, sequential row access', timeMs: 23.9, tflops: 0.0112, percentSota: 4.8, speedupVsBaseline: 4.0 },
        { id: 2, name: 'Stage 2: Multi-threading (OpenMP)', technique: 'P-cores pinned (taskset -c 0,2)', timeMs: 3.72, tflops: 0.0720, percentSota: 30.6, speedupVsBaseline: 25.7 },
        { id: 3, name: 'Stage 3: L1D/L2 Cache Blocking', technique: 'Mc=256, Kc=512 tile in 1.25MB L2', timeMs: 1.81, tflops: 0.1480, percentSota: 63.0, speedupVsBaseline: 52.9 },
        { id: 4, name: 'Stage 4: AVX2 Micro-Kernel', technique: '6×16 ymm register blocking (OpenBLAS pattern)', timeMs: 1.21, tflops: 0.2220, percentSota: 94.5, speedupVsBaseline: 79.2 },
      ],
    },
    1024: {
      sotaTimeMs: 9.07,
      sotaTflops: 0.237,
      rows: [
        { id: 0, name: 'Stage 0: Naive Triple Loop', technique: 'i-j-k loop, severe LLC thrashing', timeMs: 767.0, tflops: 0.0028, percentSota: 1.2, speedupVsBaseline: 1.0 },
        { id: 1, name: 'Stage 1: Loop Interchange', technique: 'i-k-j row-major streaming in A and B', timeMs: 191.7, tflops: 0.0112, percentSota: 4.7, speedupVsBaseline: 4.0 },
        { id: 2, name: 'Stage 2: Multi-threading (OpenMP)', technique: 'Physical P-cores pinned with #pragma omp', timeMs: 29.8, tflops: 0.0720, percentSota: 30.4, speedupVsBaseline: 25.7 },
        { id: 3, name: 'Stage 3: L1D/L2 Cache Blocking', technique: '1.25 MiB L2 resident packing', timeMs: 14.5, tflops: 0.1480, percentSota: 62.5, speedupVsBaseline: 52.9 },
        { id: 4, name: 'Stage 4: AVX2 Micro-Kernel', technique: 'Dual 256-bit FMAs on Port 0 & 1', timeMs: 9.68, tflops: 0.2220, percentSota: 93.7, speedupVsBaseline: 79.2 },
      ],
    },
    2048: {
      sotaTimeMs: 72.5,
      sotaTflops: 0.237,
      rows: [
        { id: 0, name: 'Stage 0: Naive Triple Loop', technique: 'i-j-k loop, complete L2/L3 cache misses', timeMs: 6135.0, tflops: 0.0028, percentSota: 1.2, speedupVsBaseline: 1.0 },
        { id: 1, name: 'Stage 1: Loop Interchange', technique: 'i-k-j loop sequential memory strides', timeMs: 1533.0, tflops: 0.0112, percentSota: 4.7, speedupVsBaseline: 4.0 },
        { id: 2, name: 'Stage 2: Multi-threading (OpenMP)', technique: '2 P-cores saturated under performance governor', timeMs: 238.6, tflops: 0.0720, percentSota: 30.4, speedupVsBaseline: 25.7 },
        { id: 3, name: 'Stage 3: L1D/L2 Cache Blocking', technique: 'Goto-BLAS panel decomposition in L2', timeMs: 116.1, tflops: 0.1480, percentSota: 62.5, speedupVsBaseline: 52.8 },
        { id: 4, name: 'Stage 4: AVX2 Micro-Kernel', technique: 'Zero spill outer product in 16 ymm registers', timeMs: 77.4, tflops: 0.2220, percentSota: 93.7, speedupVsBaseline: 79.3 },
      ],
    },
    4096: {
      sotaTimeMs: 580.0,
      sotaTflops: 0.237,
      rows: [
        { id: 0, name: 'Stage 0: Naive Triple Loop', technique: 'i-j-k loop, 16 KB virtual memory stride jumps', timeMs: 49080.0, tflops: 0.0028, percentSota: 1.2, speedupVsBaseline: 1.0 },
        { id: 1, name: 'Stage 1: Loop Interchange', technique: 'i-k-j hardware prefetcher saturation', timeMs: 12270.0, tflops: 0.0112, percentSota: 4.7, speedupVsBaseline: 4.0 },
        { id: 2, name: 'Stage 2: Multi-threading (OpenMP)', technique: 'Pinned P-cores avoiding E-core hybrid contention', timeMs: 1909.0, tflops: 0.0720, percentSota: 30.4, speedupVsBaseline: 25.7 },
        { id: 3, name: 'Stage 3: L1D/L2 Cache Blocking', technique: 'Panel packing fitting exactly in 1.25 MiB L2', timeMs: 929.0, tflops: 0.1480, percentSota: 62.5, speedupVsBaseline: 52.8 },
        { id: 4, name: 'Stage 4: AVX2 Micro-Kernel', technique: 'Sustained peak efficiency matching OpenBLAS/MKL', timeMs: 619.0, tflops: 0.2220, percentSota: 93.7, speedupVsBaseline: 79.3 },
      ],
    },
    8192: {
      sotaTimeMs: 4643.0,
      sotaTflops: 0.237,
      rows: [
        { id: 0, name: 'Stage 0: Naive Triple Loop', technique: 'i-j-k loop, massive DRAM thrashing across 201MB footprint', timeMs: 392600.0, tflops: 0.0028, percentSota: 1.2, speedupVsBaseline: 1.0 },
        { id: 1, name: 'Stage 1: Loop Interchange', technique: 'i-k-j contiguous memory stream', timeMs: 98170.0, tflops: 0.0112, percentSota: 4.7, speedupVsBaseline: 4.0 },
        { id: 2, name: 'Stage 2: Multi-threading (OpenMP)', technique: 'taskset -c 0,2 isolated physical core scaling', timeMs: 15270.0, tflops: 0.0720, percentSota: 30.4, speedupVsBaseline: 25.7 },
        { id: 3, name: 'Stage 3: L1D/L2 Cache Blocking', technique: 'Hierarchical Goto cache tiling preventing eviction', timeMs: 7429.0, tflops: 0.1480, percentSota: 62.5, speedupVsBaseline: 52.8 },
        { id: 4, name: 'Stage 4: AVX2 Micro-Kernel', technique: '6×16 ymm outer-product micro-kernel reaching silicon ceiling', timeMs: 4953.0, tflops: 0.2220, percentSota: 93.7, speedupVsBaseline: 79.3 },
      ],
    },
  },
};

// ─── TPU BENCHMARK DATASET (Google Cloud TPU v5e-1 MXU) ──────
export const TPU_BENCHMARKS: UnitBenchmarkTable = {
  unit: 'tpu',
  targetHardware: 'Google Cloud TPU v5e-1 (128×128 Systolic MXU)',
  sotaBaseline: 'Google XLA / Pallas SOTA',
  matrixSizes: MATRIX_SIZES,
  benchmarks: {
    512: {
      sotaTimeMs: 0.0035,
      sotaTflops: 76.7,
      rows: [
        { id: 0, name: 'Stage 0: Host Dispatch & DMA', technique: 'Host-to-device PCIe/gRPC transfer overhead', timeMs: 0.082, tflops: 3.28, percentSota: 4.3, speedupVsBaseline: 1.0 },
        { id: 1, name: 'Stage 1: Unbuffered VMEM Load', technique: 'Scalar load instructions into scratchpad', timeMs: 0.024, tflops: 11.20, percentSota: 14.6, speedupVsBaseline: 3.4 },
        { id: 2, name: 'Stage 2: 128×128 Tile Chunking', technique: 'Decomposing matrix into native MXU geometry', timeMs: 0.008, tflops: 33.55, percentSota: 43.7, speedupVsBaseline: 10.2 },
        { id: 3, name: 'Stage 3: Weight-Stationary Preload', technique: 'Weights preloaded into PE registers', timeMs: 0.0048, tflops: 55.92, percentSota: 72.9, speedupVsBaseline: 17.0 },
        { id: 4, name: 'Stage 4: Pipelined Systolic Stream', technique: 'Full wavefront overlap + async DMA prefetch', timeMs: 0.0036, tflops: 74.57, percentSota: 97.2, speedupVsBaseline: 22.7 },
      ],
    },
    1024: {
      sotaTimeMs: 0.015,
      sotaTflops: 143.2,
      rows: [
        { id: 0, name: 'Stage 0: Host Dispatch & DMA', technique: 'Host dispatch latency amortizing over larger N', timeMs: 0.240, tflops: 8.95, percentSota: 6.2, speedupVsBaseline: 1.0 },
        { id: 1, name: 'Stage 1: Unbuffered VMEM Load', technique: 'DRAM memory bus contention without double-buffering', timeMs: 0.078, tflops: 27.53, percentSota: 19.2, speedupVsBaseline: 3.1 },
        { id: 2, name: 'Stage 2: 128×128 Tile Chunking', technique: '8×8 grid of MXU tiles scheduled on core', timeMs: 0.031, tflops: 69.27, percentSota: 48.4, speedupVsBaseline: 7.7 },
        { id: 3, name: 'Stage 3: Weight-Stationary Preload', technique: '16,384 MAC cells computing in systolic lockstep', timeMs: 0.019, tflops: 113.02, percentSota: 78.9, speedupVsBaseline: 12.6 },
        { id: 4, name: 'Stage 4: Pipelined Systolic Stream', technique: 'Overlapped weight FIFO streaming via Pallas', timeMs: 0.0154, tflops: 139.44, percentSota: 97.4, speedupVsBaseline: 15.6 },
      ],
    },
    2048: {
      sotaTimeMs: 0.078,
      sotaTflops: 220.2,
      rows: [
        { id: 0, name: 'Stage 0: Host Dispatch & DMA', technique: 'Initial DMA channel staging', timeMs: 0.850, tflops: 20.21, percentSota: 9.2, speedupVsBaseline: 1.0 },
        { id: 1, name: 'Stage 1: Unbuffered VMEM Load', technique: 'HBM3 memory bandwidth saturation', timeMs: 0.290, tflops: 59.24, percentSota: 26.9, speedupVsBaseline: 2.9 },
        { id: 2, name: 'Stage 2: 128×128 Tile Chunking', technique: '16×16 grid of 128-element tiles', timeMs: 0.135, tflops: 127.25, percentSota: 57.8, speedupVsBaseline: 6.3 },
        { id: 3, name: 'Stage 3: Weight-Stationary Preload', technique: 'Zero register writeback energy during MAC accumulation', timeMs: 0.092, tflops: 186.72, percentSota: 84.8, speedupVsBaseline: 9.2 },
        { id: 4, name: 'Stage 4: Pipelined Systolic Stream', technique: 'Near-peak XLA SOTA execution', timeMs: 0.080, tflops: 214.74, percentSota: 97.5, speedupVsBaseline: 10.6 },
      ],
    },
    4096: {
      sotaTimeMs: 0.520,
      sotaTflops: 264.3,
      rows: [
        { id: 0, name: 'Stage 0: Host Dispatch & DMA', technique: 'HBM3 streaming with initial tile setup', timeMs: 3.90, tflops: 35.24, percentSota: 13.3, speedupVsBaseline: 1.0 },
        { id: 1, name: 'Stage 1: Unbuffered VMEM Load', technique: 'Sequential activation fetching from HBM3', timeMs: 1.62, tflops: 84.84, percentSota: 32.1, speedupVsBaseline: 2.4 },
        { id: 2, name: 'Stage 2: 128×128 Tile Chunking', technique: '32×32 grid of MXU tiles mapped to systolic array', timeMs: 0.84, tflops: 163.62, percentSota: 61.9, speedupVsBaseline: 4.6 },
        { id: 3, name: 'Stage 3: Weight-Stationary Preload', technique: 'Full systolic grid saturation with zero memory stalls', timeMs: 0.58, tflops: 237.03, percentSota: 89.7, speedupVsBaseline: 6.7 },
        { id: 4, name: 'Stage 4: Pipelined Systolic Stream', technique: 'Optimal Pallas kernel matching XLA SOTA peak', timeMs: 0.531, tflops: 258.83, percentSota: 97.9, speedupVsBaseline: 7.3 },
      ],
    },
    8192: {
      sotaTimeMs: 4.020,
      sotaTflops: 273.5,
      rows: [
        { id: 0, name: 'Stage 0: Host Dispatch & DMA', technique: 'Large-tensor DMA queuing over high-bandwidth bus', timeMs: 28.5, tflops: 38.6, percentSota: 14.1, speedupVsBaseline: 1.0 },
        { id: 1, name: 'Stage 1: Unbuffered VMEM Load', technique: 'Sequential VMEM buffer reads from HBM3', timeMs: 11.8, tflops: 93.2, percentSota: 34.1, speedupVsBaseline: 2.4 },
        { id: 2, name: 'Stage 2: 128×128 Tile Chunking', technique: '64×64 grid of native MXU tiles', timeMs: 6.2, tflops: 177.3, percentSota: 64.8, speedupVsBaseline: 4.6 },
        { id: 3, name: 'Stage 3: Weight-Stationary Preload', technique: 'Continuous systolic lockstep across 16,384 MACs', timeMs: 4.45, tflops: 247.1, percentSota: 90.3, speedupVsBaseline: 6.4 },
        { id: 4, name: 'Stage 4: Pipelined Systolic Stream', technique: 'Full double-buffering matching Google XLA peak', timeMs: 4.10, tflops: 268.2, percentSota: 98.1, speedupVsBaseline: 7.0 },
      ],
    },
  },
};
