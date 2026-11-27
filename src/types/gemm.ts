export type GpuArch = 'a100' | 'h100' | 't4';

export interface GpuSpec {
  id: GpuArch;
  name: string;
  architecture: string;
  fp32Tflops: number;
  memoryBandwidthGBs: number;
  smCount: number;
  sharedMemPerSMKB: number;
  registersPerSM: number;
  l2CacheMB: number;
  cuBlasPeakTflops: number;
}

export interface PerformanceGraphData {
  imageUrl?: string;
  caption?: string;
  alt?: string;
  matrixSizes?: number[]; // [512, 1024, 2048, 4096, 8192]
  gflopsValues?: number[];
}

export interface KernelStage {
  id: number;
  slug: string;
  codePrefix?: string; // 'K' for GPU, 'C' for CPU, 'T' for TPU
  title: string;
  subtitle: string;
  authorNote?: string;
  category: string;
  tflopsA100: number; // at N=4096 (or equivalent throughput metric)
  tflops4090?: number;
  tflopsV100?: number;
  throughputGflops?: number;
  percentCuBlas: number;
  speedupVsCpu?: number;
  speedupVsbase?: number;
  arithmeticIntensity: number; // FLOP / byte
  dramBandwidthGBs: number;
  registersPerThread: number;
  sharedMemBytesPerBlock: number;
  keyTechnique: string;
  bottleneckSolves: string;
  remainingBottleneck: string;
  cudaCode: string;
  language?: string; // 'cuda' | 'cpp' | 'python'
  sassInspection?: string;
  assemblyTitle?: string;
  explanationMarkdown: string[];
  architecturalPointers: {
    title: string;
    description: string;
  }[];
  // Image graph showing performance progress for each matrix size vs GFLOPs
  performanceGraph?: PerformanceGraphData;
}

export interface BenchmarkPoint {
  matrixSize: number;
  kernelId: number;
  kernelName: string;
  timeMs: number;
  gflops: number;
  cuBlasGflops: number;
  percentCuBlas: number;
}

export interface TilingConfig {
  BM: number; // Block M
  BN: number; // Block N
  BK: number; // Block K
  TM: number; // Thread Tile M
  TN: number; // Thread Tile N
  matrixSize: number;
}
