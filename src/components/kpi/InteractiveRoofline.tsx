"use client"
import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContextKPI';
import { X, Cpu, Zap, Activity, HelpCircle, Layers, ArrowUpRight } from 'lucide-react';

interface GPUProfile {
  name: string;
  architecture: string;
  peakComputeTflops: number; // TFLOP/s (FP16 / BF16 Tensor Cores)
  memoryBandwidthGBs: number; // GB/s (HBM3e / GDDR6X)
  tdpWatts: number;
}

const GPU_DEVICES: GPUProfile[] = [
  {
    name: 'NVIDIA B200 (Blackwell)',
    architecture: 'Blackwell · NVFP4 / FP8 / BF16',
    peakComputeTflops: 4500, // Dense FP16 TC peak
    memoryBandwidthGBs: 8000, // 8 TB/s HBM3e
    tdpWatts: 1000
  },
  {
    name: 'NVIDIA H100 SXM (Hopper)',
    architecture: 'Hopper · FP16 TC / TMA / WGMMA',
    peakComputeTflops: 989, // Dense FP16 TC peak without sparsity
    memoryBandwidthGBs: 3350, // 3.35 TB/s HBM3
    tdpWatts: 700
  },
  {
    name: 'NVIDIA A100 SXM (Ampere)',
    architecture: 'Ampere · FP16 Tensor Cores',
    peakComputeTflops: 312,
    memoryBandwidthGBs: 2039, // 2.0 TB/s HBM2e
    tdpWatts: 400
  },
  {
    name: 'NVIDIA RTX 4090 (Ada)',
    architecture: 'Ada Lovelace · Consumer Workstation',
    peakComputeTflops: 165,
    memoryBandwidthGBs: 1008, // 1.0 TB/s GDDR6X
    tdpWatts: 450
  }
];

interface KernelPreset {
  name: string;
  intensity: number; // FLOPs per byte
  description: string;
  codeSnippet: string;
}

const PRESETS: KernelPreset[] = [
  {
    name: 'Naive FP16 GEMM',
    intensity: 1.2,
    description: 'Global memory bound. Every multiply-accumulate re-reads matrices from HBM.',
    codeSnippet: 'C[i*N + j] += A[i*K + k] * B[k*N + j]; // No SRAM caching'
  },
  {
    name: 'Tiled SRAM GEMM',
    intensity: 32.0,
    description: 'Shared memory tiled matrix multiplication reusing tiles across threads.',
    codeSnippet: '__shared__ half sA[32][32]; __shared__ half sB[32][32];'
  },
  {
    name: 'FlashAttention-2',
    intensity: 140.0,
    description: 'IO-aware online softmax tiling. Only reads Q, K, V once into SRAM; eliminates intermediate N×N attention matrix.',
    codeSnippet: '# Triton fused FlashAttention block loop\nm_i, l_i = online_softmax_step(q, k, v)'
  },
  {
    name: 'Triton Fused LayerNorm',
    intensity: 0.5,
    description: 'Heavily memory bound. Requires high bandwidth read/write with low compute per byte.',
    codeSnippet: 'mean = tl.sum(x, axis=0) / N; var = tl.sum((x-mean)**2) / N;'
  },
  {
    name: 'cuBLAS HGEMM (Peak Parity)',
    intensity: 220.0,
    description: 'Near-hardware limit Tensor Core execution with double buffering, pipeline stages & warp swizzling.',
    codeSnippet: 'mma.sync.aligned.m16n8k16.row.col; // Asynchronous hardware pipeline'
  }
];

export const InteractiveRoofline: React.FC = () => {
  const { activeLab, setActiveLab } = useJournal();
  const [selectedGpuIndex, setSelectedGpuIndex] = useState<number>(1); // Default H100
  const [arithmeticIntensity, setArithmeticIntensity] = useState<number>(32.0); // FLOP/byte
  const [customKernelName, setCustomKernelName] = useState<string>('Tiled SRAM GEMM');

  if (activeLab !== 'roofline') return null;

  const gpu = GPU_DEVICES[selectedGpuIndex];

  // Theoretical Ridge Point (FLOPs / byte)
  // Ridge point = Peak Compute (FLOP/s) / Memory Bandwidth (Bytes/s)
  // = (peakComputeTflops * 1e12) / (memoryBandwidthGBs * 1e9)
  const ridgePoint = (gpu.peakComputeTflops * 1000) / gpu.memoryBandwidthGBs;

  // Attainable Performance = min(Peak Compute, Intensity * Bandwidth)
  const bandwidthBoundCompute = (arithmeticIntensity * gpu.memoryBandwidthGBs) / 1000; // in TFLOP/s
  const attainableCompute = Math.min(gpu.peakComputeTflops, bandwidthBoundCompute);
  const isComputeBound = arithmeticIntensity >= ridgePoint;
  const percentageOfPeak = Math.min(100, (attainableCompute / gpu.peakComputeTflops) * 100);

  // SVG Chart bounds in Log-Log space
  // X: Intensity from 0.1 to 1000 FLOP/byte
  // Y: Compute from 0.1 to 10,000 TFLOP/s
  const minLogX = -1; // 10^-1 = 0.1
  const maxLogX = 3.5; // 10^3.5 = ~3162
  const minLogY = -1; // 10^-1 = 0.1
  const maxLogY = 4; // 10^4 = 10,000

  const plotWidth = 560;
  const plotHeight = 240;
  const paddingLeft = 52;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;

  const mapX = (intensityVal: number) => {
    const val = Math.max(0.1, intensityVal);
    const logVal = Math.log10(val);
    const ratio = (logVal - minLogX) / (maxLogX - minLogX);
    return paddingLeft + ratio * (plotWidth - paddingLeft - paddingRight);
  };

  const mapY = (tflopsVal: number) => {
    const val = Math.max(0.1, tflopsVal);
    const logVal = Math.log10(val);
    const ratio = (logVal - minLogY) / (maxLogY - minLogY);
    // SVG origin is top-left
    return plotHeight - paddingBottom - ratio * (plotHeight - paddingTop - paddingBottom);
  };

  // Coordinates for the roofline curve:
  const leftX = mapX(0.1);
  const leftY = mapY((0.1 * gpu.memoryBandwidthGBs) / 1000);
  const ridgeX = mapX(ridgePoint);
  const ridgeY = mapY(gpu.peakComputeTflops);
  const rightX = mapX(3000);

  // Current kernel position:
  const currentKernelX = mapX(arithmeticIntensity);
  const currentKernelY = mapY(attainableCompute);

  const applyPreset = (preset: KernelPreset) => {
    setArithmeticIntensity(preset.intensity);
    setCustomKernelName(preset.name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-card/95 border border-emerald-500/30 rounded-2xl shadow-[0_8px_32px_rgba(4,24,18,0.5)] text-foreground overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-lime-400/15 text-lime-400 border border-lime-400/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="font-editorial text-lg font-bold text-foreground">
                GPU Roofline Model & Operational Intensity Analyzer
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                Real-Time Compute Wall & Memory Bandwidth Simulator
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveLab(null)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Control Strip: GPU Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-emerald-500/25 bg-muted/30 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-lime-400" />
              <span className="font-semibold text-foreground">Target Accelerator:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {GPU_DEVICES.map((d, idx) => (
                <button
                  key={d.name}
                  type="button"
                  onClick={() => setSelectedGpuIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                    selectedGpuIndex === idx
                      ? 'bg-lime-400 text-slate-950 font-bold border border-lime-400'
                      : 'bg-card/70 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Target Specs Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl border border-border/80 bg-card/60">
              <div className="text-[11px] text-muted-foreground">Peak Compute</div>
              <div className="text-base font-bold text-foreground mt-0.5">
                {gpu.peakComputeTflops} <span className="text-xs font-normal text-muted-foreground">TFLOP/s</span>
              </div>
              <div className="text-[10px] text-lime-400 font-semibold">{gpu.architecture}</div>
            </div>

            <div className="p-3 rounded-xl border border-border/80 bg-card/60">
              <div className="text-[11px] text-muted-foreground">HBM Bandwidth</div>
              <div className="text-base font-bold text-foreground mt-0.5">
                {gpu.memoryBandwidthGBs} <span className="text-xs font-normal text-muted-foreground">GB/s</span>
              </div>
              <div className="text-[10px] text-muted-foreground">Bus saturation ceiling</div>
            </div>

            <div className="p-3 rounded-xl border border-border/80 bg-card/60">
              <div className="text-[11px] text-muted-foreground">Ridge Point</div>
              <div className="text-base font-bold text-white mt-0.5">
                {ridgePoint.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">FLOP/byte</span>
              </div>
              <div className="text-[10px] text-muted-foreground">Balance boundary</div>
            </div>

            <div className="p-3 rounded-xl border border-border/80 bg-card/60">
              <div className="text-[11px] text-muted-foreground">Attainable Performance</div>
              <div className="text-base font-bold text-white mt-0.5">
                {attainableCompute.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">TFLOP/s</span>
              </div>
              <div className="text-[10px] text-foreground font-semibold">
                {percentageOfPeak.toFixed(0)}% of peak ({isComputeBound ? 'Compute-Bound' : 'Memory-Bound'})
              </div>
            </div>
          </div>

          {/* Interactive Log-Log Roofline SVG Chart with Emerald-Lemongrass Oscilloscope Style */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-[#06120e] text-slate-100 space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Log-Log Roofline Chart</span>
                <span className="text-[10px] text-slate-400">
                  (FLOPs/byte vs Attainable TFLOP/s)
                </span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-0.5 bg-emerald-400 inline-block shadow-[0_0_6px_#10b981]" />
                  <span>Bandwidth Slope</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-0.5 bg-lime-400 inline-block shadow-[0_0_6px_#bef264]" />
                  <span>Compute Ceiling</span>
                </div>
              </div>
            </div>

            <div className="relative w-full overflow-x-auto">
              <svg 
                viewBox={`0 0 ${plotWidth} ${plotHeight}`} 
                className="w-full h-64 select-none font-mono text-[10px]"
              >
                {/* Background Grid Lines in subtle emerald */}
                {[-1, 0, 1, 2, 3].map((exp) => {
                  const x = mapX(Math.pow(10, exp));
                  return (
                    <g key={`x-grid-${exp}`}>
                      <line x1={x} y1={paddingTop} x2={x} y2={plotHeight - paddingBottom} stroke="rgba(16, 185, 129, 0.15)" strokeDasharray="3 3" />
                      <text x={x} y={plotHeight - paddingBottom + 16} fill="#94a3b8" textAnchor="middle" opacity="0.8">
                        {Math.pow(10, exp)}
                      </text>
                    </g>
                  );
                })}

                {[-1, 0, 1, 2, 3].map((exp) => {
                  const y = mapY(Math.pow(10, exp));
                  return (
                    <g key={`y-grid-${exp}`}>
                      <line x1={paddingLeft} y1={y} x2={plotWidth - paddingRight} y2={y} stroke="rgba(16, 185, 129, 0.15)" strokeDasharray="3 3" />
                      <text x={paddingLeft - 8} y={y + 3} fill="#94a3b8" textAnchor="end" opacity="0.8">
                        {Math.pow(10, exp)}T
                      </text>
                    </g>
                  );
                })}

                {/* Axis Labels */}
                <text 
                  x={(plotWidth - paddingLeft - paddingRight) / 2 + paddingLeft} 
                  y={plotHeight - 6} 
                  fill="#f8fafc" 
                  textAnchor="middle" 
                  className="font-sans text-[11px]"
                >
                  Arithmetic Intensity (FLOPs / byte)
                </text>

                {/* Roofline Boundary Path */}
                {/* 1. Diagonal Memory Bandwidth Slope (Emerald) */}
                <line 
                  x1={leftX} 
                  y1={leftY} 
                  x2={ridgeX} 
                  y2={ridgeY} 
                  stroke="#10b981" 
                  strokeWidth="3" 
                  style={{ filter: 'drop-shadow(0px 0px 6px rgba(16, 185, 129, 0.7))' }}
                />
                
                {/* 2. Horizontal Peak Compute Ceiling (Lemongrass Green) */}
                <line 
                  x1={ridgeX} 
                  y1={ridgeY} 
                  x2={rightX} 
                  y2={ridgeY} 
                  stroke="#bef264" 
                  strokeWidth="3" 
                  style={{ filter: 'drop-shadow(0px 0px 6px rgba(190, 242, 100, 0.8))' }}
                />

                {/* Ridge Point Marker */}
                <circle cx={ridgeX} cy={ridgeY} r="5.5" fill="#bef264" stroke="#041812" strokeWidth="2" />
                <text x={ridgeX + 8} y={ridgeY - 6} fill="#bef264" fontWeight="bold">
                  Ridge: {ridgePoint.toFixed(0)} FLOP/B
                </text>

                {/* Preset Kernel Reference Dots */}
                {PRESETS.map((p) => {
                  const px = mapX(p.intensity);
                  const py = mapY(Math.min(gpu.peakComputeTflops, (p.intensity * gpu.memoryBandwidthGBs) / 1000));
                  const isCurrent = Math.abs(p.intensity - arithmeticIntensity) < 0.05;

                  return (
                    <g key={p.name} className="cursor-pointer" onClick={() => applyPreset(p)}>
                      <circle 
                        cx={px} 
                        cy={py} 
                        r={isCurrent ? 6 : 4} 
                        fill={isCurrent ? '#bef264' : '#10b981'} 
                        stroke="#041812" 
                        strokeWidth={isCurrent ? 2 : 1} 
                      />
                    </g>
                  );
                })}

                {/* Current Active Kernel Point (Interactive Pulsing Marker) */}
                <g>
                  <circle 
                    cx={currentKernelX} 
                    cy={currentKernelY} 
                    r="9" 
                    fill="none" 
                    stroke={isComputeBound ? '#bef264' : '#10b981'} 
                    strokeWidth="2" 
                    className="animate-ping" 
                    opacity="0.6"
                  />
                  <circle 
                    cx={currentKernelX} 
                    cy={currentKernelY} 
                    r="5" 
                    fill={isComputeBound ? '#bef264' : '#10b981'} 
                    stroke="#ffffff" 
                    strokeWidth="2" 
                  />
                  <text 
                    x={currentKernelX} 
                    y={currentKernelY - 12} 
                    fill={isComputeBound ? '#bef264' : '#34d399'} 
                    textAnchor="middle" 
                    fontWeight="bold"
                    fontSize="10px"
                  >
                    {customKernelName} ({attainableCompute.toFixed(0)} TF)
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Interactive Intensity Slider */}
          <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Adjust Kernel Operational Intensity:</span>
              <span className="text-lime-400 font-bold text-sm">
                {arithmeticIntensity.toFixed(2)} FLOPs / byte
              </span>
            </div>
            <input 
              type="range"
              min="0.1"
              max="200"
              step="0.1"
              value={arithmeticIntensity}
              onChange={(e) => {
                setArithmeticIntensity(parseFloat(e.target.value));
                setCustomKernelName('Manual Intensity Tuning');
              }}
              className="w-full accent-lime-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0.1 (Severe Bandwidth Bottleneck)</span>
              <span className="text-lime-400 font-semibold">Ridge ({ridgePoint.toFixed(0)})</span>
              <span>200.0 (Pure Compute Bound)</span>
            </div>
          </div>

          {/* Canonical Kernel Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span className="uppercase tracking-wider">Canonical Kernel Architectural Benchmarks:</span>
              <span>Click to test on {gpu.name}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {PRESETS.map((p) => {
                const isSelected = Math.abs(p.intensity - arithmeticIntensity) < 0.05 && customKernelName === p.name;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer font-mono text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'border-lime-400/80 bg-lime-400/15 shadow-[0_0_12px_rgba(190,242,100,0.2)]'
                        : 'border-border/70 bg-card/60 hover:border-lime-400/30 hover:bg-card'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-[11px] truncate">{p.name}</span>
                        <span className="text-[10px] text-lime-400 font-semibold">{p.intensity} F/B</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-sans mt-1 line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                    <code className="mt-2 text-[9px] text-lime-400/90 bg-muted/40 p-1 rounded block truncate font-mono">
                      {p.codeSnippet}
                    </code>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border/80 bg-muted/20 text-xs font-mono">
          <span className="text-muted-foreground text-[11px]">
            Attainable TFLOP/s = min(Peak Compute, Intensity × Bandwidth)
          </span>
          <button
            type="button"
            onClick={() => setActiveLab(null)}
            className="px-4 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold hover:bg-lime-300 border border-lime-400 transition-colors cursor-pointer"
          >
            Done Analyzing
          </button>
        </div>
      </div>
    </div>
  );
};
