export type ProcessingUnit = 'cpu' | 'gpu' | 'tpu' | 'future';

export interface UnitConfig {
  id: ProcessingUnit;
  shortLabel: string;
  name: string;
  fullName: string;
  targetHardware: string;
  sotaBaseline: string;
  peakTflopsFp32: number;
  memoryBandwidth: string;
  architectureType: string;
  accentColor: string; // Tailwind color token or hex
  themeClass: string;
  description: string;
}

export const UNIT_CONFIGS: Record<ProcessingUnit, UnitConfig> = {
  cpu: {
    id: 'cpu',
    shortLabel: 'CPU',
    name: 'Intel Core i7-1355U (Raptor Lake)',
    fullName: 'Central Processing Unit (Laptop i7-1355U · Colab Xeon Cross-Check)',
    targetHardware: 'Intel Core i7-1355U (2P+8E, AVX2/FMA, 12MB L3) & Colab Xeon Cross-Check',
    sotaBaseline: 'OpenBLAS (AVX2 Haswell Kernel) & Intel MKL',
    peakTflopsFp32: 0.24,
    memoryBandwidth: '76.8 GB/s (Dual-Channel LPDDR5/DDR5)',
    architectureType: 'Hybrid P/E Architecture + AVX2 (Dual FMA) + 1.25MB L2',
    accentColor: '#f59e0b',
    themeClass: 'theme-cpu',
    description: 'Measured on a laptop Intel Core i7-1355U with 2 Performance cores (AVX2 dual FMA ports, 48 KiB L1d, 1.25 MiB private L2) pinned via taskset under a performance governor, using OpenBLAS as the open reference and Intel oneAPI MKL as the ceiling, with Google Colab Xeon as a secondary architectural cross-check.',
  },
  gpu: {
    id: 'gpu',
    shortLabel: 'GPU',
    name: 'Massively Parallel GPU',
    fullName: 'Graphics Processing Unit',
    targetHardware: 'NVIDIA T4',
    sotaBaseline: 'cuBLAS 13.1.1.3',
    peakTflopsFp32: 8.141,
    memoryBandwidth: '320.00 GB/s (Peak), 238.05 GB/s (Measured)',
    architectureType: 'SIMT Streaming Multiprocessors + SRAM Banks',
    accentColor: '#10b981',
    themeClass: 'theme-gpu',
    description: 'Throughput-oriented architecture leveraging thousands of concurrent threads grouped into 32-lane warps across 40 Streaming Multiprocessors, 64 KB on-chip shared memory (SRAM), and 320 GB/s GDDR6 VRAM.',
  },
  tpu: {
    id: 'tpu',
    shortLabel: 'TPU',
    name: 'Google TPU Systolic Array',
    fullName: 'Tensor Processing Unit',
    targetHardware: 'Google Cloud TPU v5e-1 (128×128 MXU)',
    sotaBaseline: 'Google XLA / Pallas SOTA',
    peakTflopsFp32: 275.0, // BF16/FP32 mixed accumulation
    memoryBandwidth: '1,600 GB/s (HBM3)',
    architectureType: '2D Systolic Array Matrix Multiply Unit (MXU)',
    accentColor: '#a855f7',
    themeClass: 'theme-tpu',
    description: 'Domain-specific ASIC designed around rhythmic 2D systolic matrix multiply units (MXUs) where weights and activations stream directly from cell to adjacent cell without register writebacks.',
  },
  future: {
    id: 'future',
    shortLabel: 'Future?',
    name: 'Analog In-Memory Computing (AIMC)',
    fullName: 'Analog In-Memory Resistive Crossbar Array',
    targetHardware: '1T1R Memristor / RRAM / PCM Crossbars & Photonic Meshes',
    sotaBaseline: 'Physical Ohm (I=V·G) & Kirchhoff (ΣI) Laws',
    peakTflopsFp32: 1250.0, // Equivalent throughput metric (>100 TOPS/W)
    memoryBandwidth: 'Direct On-Die Physics (Zero Data Transit)',
    architectureType: 'Resistive Memristor Crossbar + Mixed-Signal Peripheral (DAC/ADC)',
    accentColor: '#06b6d4',
    themeClass: 'theme-future',
    description: 'The post-von Neumann paradigm shift: performing General Matrix Multiplication directly inside non-volatile memory cells using physical laws of conductance. Ohm’s Law performs multiplication (I = V·G) and Kirchhoff’s Current Law sums column currents (ΣI) instantaneously in O(1) time without digital memory shuttling.',
  },
};

