import React from 'react';
import { RotateCcw } from 'lucide-react';
import { DiagramFrame } from './DiagramFrame';
import { MathTex } from './MathTex';
import { DEFAULT_TOY_PARAMS, evaluateToyEconomy } from '@/lib/gt/economics';

interface Module1Props {
  automateA: boolean;
  automateB: boolean;
  onToggleA: () => void;
  onToggleB: () => void;
  onReset: () => void;
}

export const Module1ToyEconomy: React.FC<Module1Props> = ({
  automateA,
  automateB,
  onToggleA,
  onToggleB,
  onReset,
}) => {
  const outcome = evaluateToyEconomy(automateA, automateB, DEFAULT_TOY_PARAMS);
  const baseline = evaluateToyEconomy(false, false, DEFAULT_TOY_PARAMS);

  const deltaProfitA = outcome.firmA.profit - baseline.firmA.profit;
  const deltaProfitB = outcome.firmB.profit - baseline.firmB.profit;
  const deltaZ = outcome.totalPoolZ - baseline.totalPoolZ;

  let scenarioHeadline = 'Baseline — Both Companies Keep All 10 Workers';
  let scenarioNote =
    'Each firm pays 100 coins in wages, workers spend 80% of their income (160 coins) alongside 120 coins of outside demand, and each firm earns 140 coins in revenue for a 40-coin profit.';

  if (automateA && !automateB) {
    scenarioHeadline = 'Unilateral Automation — Company A Wins, Company B Bleeds';
    scenarioNote =
      'Company A replaces 5 workers with AI, cutting costs by 30 coins. Lost worker spending shrinks the shared market pool Z by 40 coins, so each firm loses only 20 coins of revenue. Result: Company A profit jumps +10 (to 50), while Company B drops −20 (to 20).';
  } else if (!automateA && automateB) {
    scenarioHeadline = 'Unilateral Restraint — Company A Pays the Price';
    scenarioNote =
      'Company B automates 5 workers and pockets +10 extra coins. Company A keeps full payroll (100 coins) while absorbing half of the lost spending from B’s fired workers, cutting A’s profit in half from 40 to 20 coins.';
  } else if (automateA && automateB) {
    scenarioHeadline = 'Mutual Automation — Everyone Ends Up Worse Off';
    scenarioNote =
      'Both firms automate 50% of their staff. Total wages fall by 100 coins and market pool Z collapses from 280 to 200 coins. Both companies now earn only 30 coins—10 coins less than if neither had automated—while 10 workers are out of a job.';
  }

  const formatDelta = (n: number) => (n > 0 ? `+${n}` : `${n}`);

  return (
    <section id="module-1" className="scroll-mt-24">
      <p className="editorial-dropcap text-[16px] leading-[1.82] text-[#374151] mb-6">
        When major companies announce thousands of layoffs while simultaneously committing billions
        to artificial intelligence, a stubborn economic riddle surfaces immediately: if every firm
        replaces its payroll with software, who has money left to buy the products? You might expect
        rational executives to foresee that cliff and stop well short of it. Yet in a competitive
        economy, rational profit-maximizers can march straight over the cliff with their eyes wide
        open.
      </p>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-10">
        You do not need any background in game theory to see why. We are going to derive the entire
        mechanism from scratch using nothing more than simple arithmetic, a closed economy of coins,
        and eventually first-year calculus.
      </p>

      <h2 className="font-serif text-[26px] sm:text-[29px] font-medium tracking-[-0.015em] text-[#1A1D24] mt-14 mb-5">
        1. The Toy Economy: <MathTex tex="\textcolor{#0F766E}{N}" /> Companies,{' '}
        <MathTex tex="L" /> Workers, <MathTex tex="Z" /> Coins
      </h2>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-5">
        Imagine a closed miniature town with{' '}
        <MathTex tex="\textcolor{#0F766E}{N} = 2" /> identical companies: Company A and Company B.
        Each company employs <MathTex tex="L = 10" /> workers and pays every worker a wage of{' '}
        <MathTex tex="w = 10" /> coins. Every month, workers spend a fraction{' '}
        <MathTex tex="\lambda = 0.8" /> of their wages buying goods split equally between the two
        companies, while outside buyers contribute a fixed <MathTex tex="A_0 = 120" /> coins into
        the town’s circulating market pool <MathTex tex="Z" />.
      </p>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-6">
        Now an AI vendor offers software that performs any worker’s task for{' '}
        <MathTex tex="c = 4" /> coins instead of <MathTex tex="w = 10" /> coins. Replacing one
        worker directly saves the firm <MathTex tex="s = w - c = 6" /> coins. Toggle either company
        below to automate 50% of its workforce (5 tasks) and watch where the coins actually flow.
      </p>

      <DiagramFrame
        figureNumber={1}
        title="The Circular Coin Flow"
        subtitle="Toggle each company to trace wages, market pool Z, and net profits"
        footer={
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={onToggleA}
                  aria-pressed={automateA}
                  className={`px-4 py-2 text-xs font-medium rounded-sm border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    automateA
                      ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                      : 'bg-white text-[#1A1D24] border-[#D1D5DB] hover:border-[#4F46E5] hover:text-[#4F46E5]'
                  }`}
                >
                  Company A: {automateA ? 'Automated 50% (Active)' : 'Automate 50%'}
                </button>
                <button
                  type="button"
                  onClick={onToggleB}
                  aria-pressed={automateB}
                  className={`px-4 py-2 text-xs font-medium rounded-sm border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    automateB
                      ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                      : 'bg-white text-[#1A1D24] border-[#D1D5DB] hover:border-[#4F46E5] hover:text-[#4F46E5]'
                  }`}
                >
                  Company B: {automateB ? 'Automated 50% (Active)' : 'Automate 50%'}
                </button>
              </div>
              <button
                type="button"
                onClick={onReset}
                disabled={!automateA && !automateB}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#555B66] hover:text-[#1A1D24] disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-default"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                Reset
              </button>
            </div>

            <div className="pt-3 border-t border-[#E6E8EC]">
              <p className="text-xs font-semibold text-[#1A1D24] mb-1">{scenarioHeadline}</p>
              <p className="text-xs leading-relaxed text-[#555B66]">{scenarioNote}</p>
            </div>
          </div>
        }
      >
        {/* Minimalist SVG Box-and-Arrow Flow Schematic */}
        <div className="w-full">
          <svg
            viewBox="0 0 700 320"
            className="w-full h-auto max-w-[700px] mx-auto block"
            role="img"
            aria-label="Circular coin flow diagram showing wages from Company A and Company B flowing to workers, into market pool Z, and back as revenue"
          >
            <defs>
              <marker
                id="arrow-ink"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#4B5563" />
              </marker>
              <marker
                id="arrow-indigo"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#4F46E5" />
              </marker>
              <marker
                id="arrow-teal"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#0F766E" />
              </marker>
            </defs>

            {/* Company A Box (Top Left) */}
            <g transform="translate(24, 24)">
              <rect
                width="196"
                height="96"
                rx="3"
                fill={automateA ? '#F5F6FF' : '#FFFFFF'}
                stroke={automateA ? '#4F46E5' : '#1A1D24'}
                strokeWidth={automateA ? 1.8 : 1.3}
              />
              <text x="14" y="24" className="fill-[#1A1D24] text-[13px] font-semibold" fontFamily="Plus Jakarta Sans, sans-serif">
                Company A
              </text>
              <text
                x="182"
                y="24"
                textAnchor="end"
                className="text-[11px] font-medium"
                fill={automateA ? '#4F46E5' : '#7C8492'}
                fontFamily="IBM Plex Mono, monospace"
              >
                {automateA ? '50% AI' : '0% AI'}
              </text>
              <line x1="14" y1="34" x2="182" y2="34" stroke="#E5E7EB" strokeWidth="1" />
              <text x="14" y="53" className="fill-[#555B66] text-[11px]" fontFamily="IBM Plex Mono, monospace">
                Workers: {outcome.firmA.workersEmployed} · AI: {outcome.firmA.tasksAutomated}
              </text>
              <text x="14" y="70" className="fill-[#555B66] text-[11px]" fontFamily="IBM Plex Mono, monospace">
                Cost: {outcome.firmA.totalCost} · Rev: {outcome.firmA.revenue}
              </text>
              <text
                x="14"
                y="88"
                className="text-[12px] font-semibold"
                fill={deltaProfitA > 0 ? '#059669' : deltaProfitA < 0 ? '#DC2626' : '#1A1D24'}
                fontFamily="IBM Plex Mono, monospace"
              >
                Profit: {outcome.firmA.profit} coins {deltaProfitA !== 0 ? `(${formatDelta(deltaProfitA)})` : ''}
              </text>
            </g>

            {/* Company B Box (Top Right) */}
            <g transform="translate(480, 24)">
              <rect
                width="196"
                height="96"
                rx="3"
                fill={automateB ? '#F5F6FF' : '#FFFFFF'}
                stroke={automateB ? '#4F46E5' : '#1A1D24'}
                strokeWidth={automateB ? 1.8 : 1.3}
              />
              <text x="14" y="24" className="fill-[#1A1D24] text-[13px] font-semibold" fontFamily="Plus Jakarta Sans, sans-serif">
                Company B
              </text>
              <text
                x="182"
                y="24"
                textAnchor="end"
                className="text-[11px] font-medium"
                fill={automateB ? '#4F46E5' : '#7C8492'}
                fontFamily="IBM Plex Mono, monospace"
              >
                {automateB ? '50% AI' : '0% AI'}
              </text>
              <line x1="14" y1="34" x2="182" y2="34" stroke="#E5E7EB" strokeWidth="1" />
              <text x="14" y="53" className="fill-[#555B66] text-[11px]" fontFamily="IBM Plex Mono, monospace">
                Workers: {outcome.firmB.workersEmployed} · AI: {outcome.firmB.tasksAutomated}
              </text>
              <text x="14" y="70" className="fill-[#555B66] text-[11px]" fontFamily="IBM Plex Mono, monospace">
                Cost: {outcome.firmB.totalCost} · Rev: {outcome.firmB.revenue}
              </text>
              <text
                x="14"
                y="88"
                className="text-[12px] font-semibold"
                fill={deltaProfitB > 0 ? '#059669' : deltaProfitB < 0 ? '#DC2626' : '#1A1D24'}
                fontFamily="IBM Plex Mono, monospace"
              >
                Profit: {outcome.firmB.profit} coins {deltaProfitB !== 0 ? `(${formatDelta(deltaProfitB)})` : ''}
              </text>
            </g>

            {/* AI Compute Leakage Box (Top Center, small) */}
            <g transform="translate(274, 24)">
              <rect
                width="152"
                height="56"
                rx="3"
                fill="#FAFAFC"
                stroke="#D1D5DB"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              <text x="76" y="23" textAnchor="middle" className="fill-[#7C8492] text-[11px] font-medium" fontFamily="Plus Jakarta Sans, sans-serif">
                AI Compute Cost (c = 4)
              </text>
              <text x="76" y="42" textAnchor="middle" className="fill-[#1A1D24] text-[12px] font-semibold" fontFamily="IBM Plex Mono, monospace">
                {outcome.firmA.aiSpend + outcome.firmB.aiSpend} coins out
              </text>
            </g>

            {/* AI Cost Arrows */}
            {automateA && (
              <path
                d="M 220 52 L 270 52"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                markerEnd="url(#arrow-indigo)"
              />
            )}
            {automateB && (
              <path
                d="M 480 52 L 430 52"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                markerEnd="url(#arrow-indigo)"
              />
            )}

            {/* Workers Box (Bottom Left) */}
            <g transform="translate(64, 214)">
              <rect width="212" height="82" rx="3" fill="#FFFFFF" stroke="#1A1D24" strokeWidth="1.3" />
              <text x="14" y="24" className="fill-[#1A1D24] text-[13px] font-semibold" fontFamily="Plus Jakarta Sans, sans-serif">
                Workers (Town Households)
              </text>
              <line x1="14" y1="34" x2="198" y2="34" stroke="#E5E7EB" strokeWidth="1" />
              <text x="14" y="54" className="fill-[#374151] text-[11px]" fontFamily="IBM Plex Mono, monospace">
                Employed: {outcome.totalWorkersEmployed} / 20 ({outcome.totalLaidOff} laid off)
              </text>
              <text x="14" y="72" className="fill-[#1A1D24] text-[11px] font-medium" fontFamily="IBM Plex Mono, monospace">
                Total Wages: {outcome.totalWages} coins
              </text>
            </g>

            {/* Market Pool Z Box (Bottom Right) */}
            <g transform="translate(424, 214)">
              <rect
                width="212"
                height="82"
                rx="3"
                fill={deltaZ < 0 ? '#FEF2F2' : '#FFFFFF'}
                stroke={deltaZ < 0 ? '#DC2626' : '#0F766E'}
                strokeWidth="1.5"
              />
              <text x="14" y="24" className="fill-[#1A1D24] text-[13px] font-semibold" fontFamily="Plus Jakarta Sans, sans-serif">
                Market Pool Z
              </text>
              <text
                x="198"
                y="24"
                textAnchor="end"
                className="text-[11px] font-semibold"
                fill={deltaZ < 0 ? '#DC2626' : '#0F766E'}
                fontFamily="IBM Plex Mono, monospace"
              >
                {outcome.totalPoolZ} coins
              </text>
              <line x1="14" y1="34" x2="198" y2="34" stroke="#E5E7EB" strokeWidth="1" />
              <text x="14" y="54" className="fill-[#555B66] text-[11px]" fontFamily="IBM Plex Mono, monospace">
                Worker spend (λ=0.8): {outcome.workerSpending}
              </text>
              <text x="14" y="72" className="fill-[#555B66] text-[11px]" fontFamily="IBM Plex Mono, monospace">
                Outside A₀: 120 {deltaZ !== 0 ? `· ΔZ = ${deltaZ}` : ''}
              </text>
            </g>

            {/* Flow 1: Company A -> Workers (Wages A) */}
            <path
              d="M 100 120 L 100 209"
              fill="none"
              stroke="#4B5563"
              strokeWidth="1.5"
              markerEnd="url(#arrow-ink)"
            />
            <rect x="34" y="152" width="102" height="22" fill="#FFFFFF" />
            <text x="85" y="167" textAnchor="middle" className="fill-[#374151] text-[11px]" fontFamily="IBM Plex Mono, monospace">
              Wages: {outcome.firmA.wageBill}
            </text>

            {/* Flow 2: Company B -> Workers (Wages B) */}
            <path
              d="M 526 120 C 526 170, 232 140, 232 209"
              fill="none"
              stroke="#4B5563"
              strokeWidth="1.4"
              strokeDasharray="4 2"
              markerEnd="url(#arrow-ink)"
            />
            <rect x="292" y="138" width="114" height="20" fill="#FFFFFF" />
            <text x="349" y="152" textAnchor="middle" className="fill-[#555B66] text-[11px]" fontFamily="IBM Plex Mono, monospace">
              B Wages: {outcome.firmB.wageBill}
            </text>

            {/* Flow 3: Workers -> Market Pool Z (Spending) */}
            <path
              d="M 276 256 L 419 256"
              fill="none"
              stroke="#DC2626"
              strokeWidth={deltaZ < 0 ? 1.8 : 1.5}
              markerEnd="url(#arrow-ink)"
            />
            <rect x="294" y="234" width="112" height="18" fill="#FFFFFF" />
            <text x="350" y="247" textAnchor="middle" className="fill-[#1A1D24] text-[11px] font-medium" fontFamily="IBM Plex Mono, monospace">
              Spend: {outcome.workerSpending}
            </text>

            {/* Flow 4: Market Pool Z -> Company B (Revenue B) */}
            <path
              d="M 594 214 L 594 125"
              fill="none"
              stroke="#0F766E"
              strokeWidth="1.6"
              markerEnd="url(#arrow-teal)"
            />
            <rect x="545" y="162" width="108" height="22" fill="#FFFFFF" />
            <text x="599" y="177" textAnchor="middle" className="fill-[#0F766E] text-[11px] font-medium" fontFamily="IBM Plex Mono, monospace">
              Rev B: {outcome.firmB.revenue}
            </text>

            {/* Flow 5: Market Pool Z -> Company A (Revenue A) */}
            <path
              d="M 468 214 C 468 180, 178 190, 178 125"
              fill="none"
              stroke="#0F766E"
              strokeWidth="1.6"
              markerEnd="url(#arrow-teal)"
            />
            <rect x="292" y="175" width="114" height="20" fill="#FFFFFF" />
            <text x="349" y="189" textAnchor="middle" className="fill-[#0F766E] text-[11px] font-medium" fontFamily="IBM Plex Mono, monospace">
              Rev A: {outcome.firmA.revenue}
            </text>
          </svg>
        </div>

        {/* Crisp Tabular Accounting Readout Strip */}
        <div className="mt-5 pt-4 border-t border-[#ECEEF2] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-[11px] text-[#7C8492]">Company A Profit</div>
            <div className="font-mono tabular-nums text-lg font-semibold text-[#1A1D24]">
              {outcome.firmA.profit}
              <span className="text-xs font-normal text-[#7C8492] ml-1">coins</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#7C8492]">Company B Profit</div>
            <div className="font-mono tabular-nums text-lg font-semibold text-[#1A1D24]">
              {outcome.firmB.profit}
              <span className="text-xs font-normal text-[#7C8492] ml-1">coins</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#7C8492]">Market Pool Z</div>
            <div
              className={`font-mono tabular-nums text-lg font-semibold ${
                deltaZ < 0 ? 'text-[#DC2626]' : 'text-[#0F766E]'
              }`}
            >
              {outcome.totalPoolZ}
              <span className="text-xs font-normal text-[#7C8492] ml-1">coins</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#7C8492]">Collective Profit</div>
            <div className="font-mono tabular-nums text-lg font-semibold text-[#1A1D24]">
              {outcome.collectiveProfit}
              <span className="text-xs font-normal text-[#7C8492] ml-1">coins</span>
            </div>
          </div>
        </div>
      </DiagramFrame>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-4">
        Notice the arithmetic asymmetry hiding inside when even one of them starts automating. Firing one worker
        saves Company A <MathTex tex="s = w - c = 6" /> coins and Company A keeps{' '}
        <strong className="font-semibold text-[#1A1D24]">100%</strong> of those savings. That laid-off
        worker stops spending <MathTex tex="\textcolor{#DC2626}{\ell} = \lambda w = 8" /> coins in
        the town, which is more than the 6 coins saved! Socially, the layoff destroys 2 net coins of value.
        Yet because that 8-coin drop in demand is split evenly across both firms (
        <MathTex tex="\textcolor{#DC2626}{\ell} / \textcolor{#0F766E}{N} = 4" /> coins each),
        Company A privately pockets <MathTex tex="6 - 4 = +2" /> coins per fired worker while
        quietly exporting a <MathTex tex="-4" /> coin revenue hit onto Company B.
      </p>
    </section>
  );
};
