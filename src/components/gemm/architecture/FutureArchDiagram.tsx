import React, { useState, useEffect } from 'react';
import { Cpu, Play, Pause, RotateCcw, Zap, Layers, RefreshCw, AlertCircle, Sparkles, Sliders, ArrowRight, Shield } from 'lucide-react';

export const FutureArchDiagram: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [step, setStep] = useState<number>(0);
  const [activeSubsystem, setActiveSubsystem] = useState<'crossbar' | 'cell' | 'dac_adc' | 'physics' | 'nonidealities'>('crossbar');

  // Input voltages (normalized V)
  const [inputVoltages, setInputVoltages] = useState<number[]>([1.0, 0.5, 0.8, 0.2]);

  // Conductance matrix (4x4) in arbitrary micro-Siemens (uS)
  const [conductanceMatrix, setConductanceMatrix] = useState<number[][]>([
    [80, 20, 50, 90],
    [30, 70, 40, 10],
    [60, 90, 80, 30],
    [10, 40, 70, 60],
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep((prev) => (prev + 1) % 4);
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Calculate currents per cell I_ij = V_i * G_ij (Ohm's Law)
  // Calculate column sum I_j = sum_i(I_ij) (Kirchhoff's Current Law)
  const cellCurrents = conductanceMatrix.map((row, i) =>
    row.map((g) => (inputVoltages[i] * g))
  );

  const columnCurrents = [0, 1, 2, 3].map((colIdx) =>
    cellCurrents.reduce((acc, row) => acc + row[colIdx], 0)
  );

  const subsystems = {
    crossbar: {
      name: 'Resistive Analog Crossbar Array (AIMC Core)',
      capacity: 'Dense 2D crosspoint grid (e.g. 512 × 512 to 2048 × 2048 cells)',
      latency: '~10–50 ps physics response time (Time-of-flight conductance)',
      throughput: '> 100–300 TOPS/Watt (10× to 50× beyond modern GPUs)',
      details: 'Analog In-Memory Computing performs General Matrix Multiplication directly where data lives. Wordlines apply input voltage vector V, columns aggregate currents I down bitlines. Matrix weights are encoded as non-volatile physical conductances G (G = 1/R).',
      gemmImpact: 'Collapses the classic O(N³) digital instruction loop into an O(1) single-cycle physical law phenomenon with zero DRAM memory bus traffic.',
    },
    cell: {
      name: '1T1R Memristor / Resistive Cell (Crosspoint Element)',
      capacity: 'Multi-level cell (MLC) storing 4-bit to 8-bit analog conductance',
      latency: 'Instantaneous passive conduction; ~1–10 ns write pulse programming',
      throughput: 'Tens of billions of crosspoints per die (4F² footprint per cell)',
      details: 'Composed of 1 Transistor (for sneak-path isolation) and 1 Resistor/Memristor (1T1R). Memristive technologies include Resistive RAM (RRAM: metal-oxide filament formation like HfOx/TaOx) and Phase-Change Memory (PCM: amorphous vs crystalline chalcogenide GST states).',
      gemmImpact: 'Stores the stationary matrix weights non-volatilely on-die forever, consuming zero static leakage power.',
    },
    physics: {
      name: 'Ohm’s Law & Kirchhoff’s Current Law (Compute-in-Physics)',
      capacity: 'Continuous analog domain mathematical execution',
      latency: 'Light/electron propagation speed through nanoscale metal wires',
      throughput: 'Zero instruction decoders, zero ALU register banks, zero clock trees',
      details: 'Multiplication is computed by Ohm’s Law: I_ij = V_i · G_ij. Accumulation is computed passively by Kirchhoff’s Current Law (KCL): I_j = Σ_i I_ij along the bitline metal rail. Physics executes addition for free as charge conservation.',
      gemmImpact: 'Eliminates 95% of digital chip silicon area that traditional GPUs dedicate to cache hierarchies and register files.',
    },
    dac_adc: {
      name: 'Mixed-Signal Periphery: Wordline DACs & Bitline ADCs',
      capacity: 'High-speed SAR/Flash ADCs (4-bit to 8-bit precision, 1–5 GS/s)',
      latency: '1–5 ns conversion time (constitutes 85%+ of total latency)',
      throughput: 'Processes entire column vector simultaneously in parallel',
      details: 'The fundamental interface between the digital host processor and the analog crossbar. Input DACs convert digital activation integers into analog voltage levels. Output ADCs digitize the aggregated column current into result matrices.',
      gemmImpact: 'The "ADC Tax": Mixed-signal data converters dominate over 75% of total chip energy and silicon area in modern AIMC chips.',
    },
    nonidealities: {
      name: 'Physical Non-Idealities & Engineering Trade-Offs',
      capacity: 'Equivalent to INT4–INT8 deep learning inference precision',
      latency: 'Requires software calibration and drift compensation loops',
      throughput: 'Resilient to neural network noise; unsuitable for exact IEEE 754 FP64',
      details: 'Real-world analog crossbars encounter metal wire resistance (IR voltage drops along bitlines), cycle-to-cycle conductance variability, thermal resistance drift (relaxation in PCM), and ADC quantization noise.',
      gemmImpact: 'Requires Hardware-Aware Training (HAT) or noise-tolerant neural architectures. While not a replacement for IEEE 754 FP32 scientific simulations, it delivers unmatched efficiency for transformer/LLM inference.',
    },
  };

  const curr = subsystems[activeSubsystem];

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-colors duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>POST-VON NEUMANN PARADIGM · ANALOG IN-MEMORY COMPUTING (AIMC)</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mt-0.5">
            Memristive Crossbar Array: Computing with Physical Laws
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Eliminating the von Neumann memory wall: Inputs are encoded as voltages V_i, matrix weights as conductances G_ij, and outputs as physical column currents I_j = ∑ V_i · G_ij.
          </p>
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border border-border self-start sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 rounded bg-primary text-primary-foreground font-mono text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Play Flow'}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setStep(0);
            }}
            className="p-1 rounded text-muted-foreground hover:text-foreground cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-muted-foreground px-1 tabular-nums">
            Step: <strong className="text-foreground">{step + 1}</strong>/4
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Crossbar Array Visualization */}
        <div className="lg:col-span-7 bg-background/90 rounded-xl border border-border p-5 space-y-4">
          {/* Phase Header */}
          <div className="text-[11px] font-mono text-muted-foreground flex items-center justify-between border-b border-border pb-2.5">
            <span>DATAFLOW: DIGITAL X → DAC [V] → OHM [V·G] → KIRCHHOFF [ΣI] → ADC [Y]</span>
            <span className="text-primary font-bold">
              {step === 0 && '1. DAC Voltage Drive (Wordlines)'}
              {step === 1 && '2. Parallel Ohm Conduction (I=V·G)'}
              {step === 2 && '3. Kirchhoff Current Sum (Bitlines)'}
              {step === 3 && '4. ADC Output Quantization'}
            </span>
          </div>

          {/* Interactive Crossbar Circuit Diagram */}
          <div className="p-4 rounded-xl bg-card border border-border space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-primary" />
                4×4 RESISTIVE MEMRISTOR CROSSBAR GRID
              </span>
              <span className="text-[10px] text-primary">Interactive Real-Time Physics</span>
            </div>

            {/* Crossbar Grid Container */}
            <div className="relative overflow-x-auto pb-2">
              <div className="min-w-[480px]">
                {/* Column Headers (Bitlines / Output ADCs) */}
                <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-mono text-muted-foreground mb-2">
                  <div className="col-span-2 text-left pl-2">Wordline Inputs (DAC)</div>
                  <div>BL 0</div>
                  <div>BL 1</div>
                  <div>BL 2</div>
                  <div>BL 3</div>
                </div>

                {/* Crossbar Rows */}
                {conductanceMatrix.map((row, rowIdx) => {
                  const v = inputVoltages[rowIdx];
                  const isRowActive = step >= 0;

                  return (
                    <div key={rowIdx} className="grid grid-cols-6 gap-2 items-center mb-2 text-xs font-mono">
                      {/* Row Input Voltage Controller */}
                      <div className="col-span-2 p-2 rounded bg-background border border-border flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-muted-foreground block">WL {rowIdx} (DAC)</span>
                          <span className="text-primary font-bold text-xs">{v.toFixed(1)} V</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.1"
                          value={v}
                          onChange={(e) => {
                            const newV = [...inputVoltages];
                            newV[rowIdx] = parseFloat(e.target.value);
                            setInputVoltages(newV);
                          }}
                          className="w-16 h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>

                      {/* 4 Crosspoint Memristor Cells */}
                      {row.map((g, colIdx) => {
                        const cellCurrent = (v * g).toFixed(1);
                        const isHigh = g > 60;

                        return (
                          <div
                            key={colIdx}
                            onClick={() => setActiveSubsystem('cell')}
                            className={`p-2 rounded-lg border text-center transition-all cursor-pointer relative ${
                              step >= 1
                                ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                                : 'bg-background border-border hover:border-primary/50'
                            }`}
                          >
                            <span className="text-[9px] text-muted-foreground block">
                              G: {g} μS
                            </span>
                            <div className="text-[11px] font-bold text-foreground mt-0.5">
                              {cellCurrent} μA
                            </div>
                            <span className="text-[8px] text-primary block mt-0.5 font-mono">
                              Ohm (I=V·G)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Bottom Row: Bitline Current Sums & Output ADCs */}
                <div className="grid grid-cols-6 gap-2 items-center pt-3 border-t border-border text-xs font-mono">
                  <div className="col-span-2 p-2 rounded bg-secondary/30 border border-primary/30">
                    <span className="text-[10px] font-bold text-primary block">KIRCHHOFF SUMMATION (KCL)</span>
                    <span className="text-[10px] text-muted-foreground block">Total Column Current (ΣI)</span>
                  </div>

                  {columnCurrents.map((totI, colIdx) => (
                    <div
                      key={colIdx}
                      onClick={() => setActiveSubsystem('dac_adc')}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        step >= 2
                          ? 'bg-secondary/80 border-primary shadow-xs'
                          : 'bg-card border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-[9px] text-muted-foreground block">ADC {colIdx}</span>
                      <div className="text-xs font-bold text-primary mt-0.5 tabular-nums">
                        {totI.toFixed(1)} μA
                      </div>
                      <span className="text-[9px] text-foreground font-semibold block mt-0.5">
                        Y[{colIdx}]
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Key Physics Comparison Cards (Zero text clipping, tall, roomy) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div
              onClick={() => setActiveSubsystem('physics')}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                activeSubsystem === 'physics'
                  ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-foreground">1. OHM’S MULTIPLICATION</span>
                <span className="text-[10px] text-primary font-bold">I = V · G</span>
              </div>
              <p className="text-[12px] sm:text-[13px] text-muted-foreground leading-relaxed font-serif">
                Applying voltage V_i across conductance G_ij creates current I_ij. Multiplication occurs instantaneously in the analog domain via electron drift with zero instruction execution.
              </p>
            </div>

            <div
              onClick={() => setActiveSubsystem('physics')}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                activeSubsystem === 'physics'
                  ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-foreground">2. KIRCHHOFF’S ACCUMULATION</span>
                <span className="text-[10px] text-primary font-bold">I_col = Σ I_ij</span>
              </div>
              <p className="text-[12px] sm:text-[13px] text-muted-foreground leading-relaxed font-serif">
                Connecting all cell outputs to a common bitline wire sums their currents passively by Kirchhoff’s Current Law. Addition costs zero clock cycles, zero registers, and zero ALU power.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Technical Specification Inspector & Non-Idealities */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Subsystem Specification Card */}
          <div className="p-5 rounded-xl bg-background border border-border shadow-xs">
            <div className="text-[11px] font-mono text-primary font-semibold uppercase mb-1">
              IN-MEMORY COMPUTING SPECIFICATION
            </div>
            <h4 className="text-base font-bold text-foreground font-mono mb-3">
              {curr.name}
            </h4>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-card border border-border">
                <span className="text-muted-foreground block text-[10px]">CAPACITY:</span>
                <span className="text-foreground font-bold">{curr.capacity}</span>
              </div>
              <div className="p-2.5 rounded bg-card border border-border">
                <span className="text-muted-foreground block text-[10px]">LATENCY:</span>
                <span className="text-primary font-bold">{curr.latency}</span>
              </div>
              <div className="p-2.5 rounded bg-card border border-border">
                <span className="text-muted-foreground block text-[10px]">ENERGY EFFICIENCY:</span>
                <span className="text-foreground font-bold">{curr.throughput}</span>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-border text-xs text-muted-foreground leading-relaxed space-y-2 font-serif">
              <div>
                <strong className="text-foreground block mb-0.5 font-mono text-xs">Architectural Details:</strong>
                {curr.details}
              </div>
              <div>
                <strong className="text-primary block mb-0.5 font-mono text-xs">GEMM Optimization Impact:</strong>
                {curr.gemmImpact}
              </div>
            </div>
          </div>

          {/* Subsystem Quick Switcher Tabs */}
          <div className="p-4 rounded-xl bg-card border border-border space-y-3">
            <div className="text-xs font-mono font-bold text-foreground flex items-center justify-between">
              <span>EXPLORE AIMC ARCHITECTURAL LAYERS</span>
              <span className="text-[10px] text-primary font-mono">Click to inspect</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => setActiveSubsystem('crossbar')}
                className={`p-2 rounded text-left transition-colors cursor-pointer border ${
                  activeSubsystem === 'crossbar'
                    ? 'bg-secondary text-primary border-primary font-bold'
                    : 'bg-background text-muted-foreground hover:text-foreground border-border'
                }`}
              >
                1. Crossbar Array
              </button>
              <button
                onClick={() => setActiveSubsystem('cell')}
                className={`p-2 rounded text-left transition-colors cursor-pointer border ${
                  activeSubsystem === 'cell'
                    ? 'bg-secondary text-primary border-primary font-bold'
                    : 'bg-background text-muted-foreground hover:text-foreground border-border'
                }`}
              >
                2. 1T1R Memristor Cell
              </button>
              <button
                onClick={() => setActiveSubsystem('physics')}
                className={`p-2 rounded text-left transition-colors cursor-pointer border ${
                  activeSubsystem === 'physics'
                    ? 'bg-secondary text-primary border-primary font-bold'
                    : 'bg-background text-muted-foreground hover:text-foreground border-border'
                }`}
              >
                3. Ohm &amp; Kirchhoff Laws
              </button>
              <button
                onClick={() => setActiveSubsystem('dac_adc')}
                className={`p-2 rounded text-left transition-colors cursor-pointer border ${
                  activeSubsystem === 'dac_adc'
                    ? 'bg-secondary text-primary border-primary font-bold'
                    : 'bg-background text-muted-foreground hover:text-foreground border-border'
                }`}
              >
                4. Mixed-Signal ADC/DAC
              </button>
            </div>

            <button
              onClick={() => setActiveSubsystem('nonidealities')}
              className={`w-full p-2 rounded text-left transition-colors cursor-pointer border text-xs font-mono ${
                activeSubsystem === 'nonidealities'
                  ? 'bg-secondary text-primary border-primary font-bold'
                  : 'bg-background text-muted-foreground hover:text-foreground border-border'
              }`}
            >
              5. Physical Non-Idealities (IR Drop, Thermal Drift &amp; Noise)
            </button>
          </div>

          {/* Energy Breakdown Banner */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-primary/30 space-y-2 text-xs">
            <div className="font-mono text-primary font-bold flex items-center gap-1.5 text-xs">
              <Zap className="w-4 h-4" />
              <span>THE ENERGY REVOLUTION: AIMC VS DIGITAL GEMM</span>
            </div>
            <p className="text-muted-foreground leading-relaxed font-serif text-[12px] sm:text-[13px]">
              In digital GPUs (A100/H100), fetching two 32-bit floats from HBM to registers costs <strong>~200 pJ</strong>, while computing the FMA costs only <strong>~1 pJ</strong>. Over 95% of energy is lost moving bits over metal wires.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 rounded bg-background border border-border">
                <span className="text-muted-foreground block text-[10px]">DIGITAL GPU / TPU:</span>
                <span className="font-bold text-foreground block mt-0.5">~3–10 TOPS/Watt</span>
                <span className="text-[10px] text-muted-foreground">Memory transit dominant</span>
              </div>
              <div className="p-2 rounded bg-background border border-primary/40">
                <span className="text-muted-foreground block text-[10px]">ANALOG IN-MEMORY:</span>
                <span className="font-bold text-primary block mt-0.5">100–300 TOPS/Watt</span>
                <span className="text-[10px] text-primary">Zero memory transit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
