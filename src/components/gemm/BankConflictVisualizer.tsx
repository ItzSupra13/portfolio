import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Shield, Info, RefreshCw } from 'lucide-react';

export const BankConflictVisualizer: React.FC = () => {
  const [strategy, setStrategy] = useState<'naive' | 'padded' | 'swizzled'>('padded');
  const [activeLane, setActiveLane] = useState<number | null>(null);

  // 32 banks in NVIDIA Shared Memory
  const numBanks = 32;

  // Simulate warp access pattern (32 threads in warp)
  // Let thread t access row t of shared memory
  // Without padding: row_stride = 32 floats (BK = 32)
  // With padding: row_stride = 36 floats (BK + 4)
  // Swizzling: bank = lane ^ (row % 32)
  const calculateBank = (threadIdx: number, strat: 'naive' | 'padded' | 'swizzled') => {
    if (strat === 'naive') {
      // With stride of 32 floats, every row starts at 32 * threadIdx
      // (threadIdx * 32) % 32 = 0 -> ALL THREADS HIT BANK 0!
      // In 2D thread tile fetching columns: (col * 32) % 32 = 0
      return (threadIdx * 32) % 32;
    } else if (strat === 'padded') {
      // With +4 float padding, row stride is 36
      // (threadIdx * 36) % 32 = (threadIdx * 4) % 32
      // Distributes threads across banks without multiple threads sharing same bank for distinct words
      return (threadIdx * 4) % 32;
    } else {
      // Swizzled: XOR with row index
      return (threadIdx ^ 5) % 32;
    }
  };

  // Group threads by bank
  const bankOccupancy: number[][] = Array.from({ length: numBanks }, () => []);
  for (let t = 0; t < 32; t++) {
    const bank = calculateBank(t, strategy);
    bankOccupancy[bank].push(t);
  }

  // Conflict metrics
  const maxThreadsPerBank = Math.max(...bankOccupancy.map((b) => b.length));
  const hasConflict = maxThreadsPerBank > 1;
  const serializationWays = maxThreadsPerBank;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1">HARDWARE MICRO-INSPECTION</div>
          <h3 className="text-lg font-bold text-white">
            Shared Memory 32-Bank Conflict Simulator
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize how 32 warp lanes map to physical SRAM banks (4-byte words per bank).
          </p>
        </div>

        {/* Strategy Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setStrategy('naive')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              strategy === 'naive'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Naive (Stride 32)
          </button>
          <button
            onClick={() => setStrategy('padded')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              strategy === 'padded'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            +4 Float Padding
          </button>
          <button
            onClick={() => setStrategy('swizzled')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              strategy === 'swizzled'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            XOR Swizzling
          </button>
        </div>
      </div>

      {/* Metrics Alert Banner */}
      <div
        className={`p-4 rounded-lg border mb-6 flex items-start gap-3 text-xs leading-relaxed ${
          hasConflict
            ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
        }`}
      >
        {hasConflict ? (
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <div className="font-bold font-mono text-sm mb-0.5">
            {hasConflict
              ? `SEVERITY: ${serializationWays}-Way Bank Conflict Detected!`
              : 'STATUS: Conflict-Free! Full 128-Byte Single-Cycle Broadcast'}
          </div>
          <div>
            {hasConflict ? (
              <span>
                All {maxThreadsPerBank} warp threads are requesting distinct 4-byte words located in the <strong>exact same memory bank</strong>. The shared memory hardware controller must serialize the transaction into {serializationWays} consecutive clock cycles, causing a massive pipeline stall.
              </span>
            ) : (
              <span>
                Every active warp lane maps to an independent memory bank or broadcast channel. The hardware satisfies the entire warp request in <strong>exactly 1 clock cycle</strong> with 100% bandwidth efficiency.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Visual Bank Grid (32 Banks) */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>PHYSICAL SHARED MEMORY BANKS (0 TO 31)</span>
          <span className="text-[11px] text-slate-400">Hover over bank to see warp threads</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-16 gap-1.5">
          {Array.from({ length: 32 }).map((_, bankIdx) => {
            const threads = bankOccupancy[bankIdx];
            const count = threads.length;
            const isHeavy = count > 1;

            return (
              <div
                key={bankIdx}
                onMouseEnter={() => setActiveLane(bankIdx)}
                onMouseLeave={() => setActiveLane(null)}
                className={`p-2 rounded border text-center transition-all cursor-pointer ${
                  count === 0
                    ? 'bg-slate-950/60 border-slate-800 text-slate-600'
                    : isHeavy
                    ? 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                    : 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-400">B{bankIdx}</div>
                <div className="text-xs font-mono font-bold mt-0.5">
                  {count > 0 ? `${count}T` : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Code Solution snippet */}
      <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs">
        <div className="text-slate-400 text-[11px] mb-1">THE C++ FIX IN KERNEL 6:</div>
        <div className="text-slate-300">
          <span className="text-rose-400 line-through mr-3">
            __shared__ float As[BM][BK]; // BK is multiple of 32 -&gt; Collision!
          </span>
          <br className="sm:hidden"/>
          <span className="text-emerald-400 font-bold">
            __shared__ float As[BM][BK + 4]; // +4 floats offset cures bank collision completely
          </span>
        </div>
      </div>
    </div>
  );
};
