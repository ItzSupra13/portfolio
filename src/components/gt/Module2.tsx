import React, { useState } from 'react';
import { DiagramFrame } from './DiagramFrame';
import { MathTex } from './MathTex';
import { buildToyPayoffMatrix, DEFAULT_TOY_PARAMS, PayoffMatrixCell } from '@/lib/gt/economics';

type CellKey = PayoffMatrixCell['key'];

const CELL_INSIGHTS: Record<
  CellKey,
  {
    title: string;
    label: string;
    detail: string;
    bestResponseNote: string;
  }
> = {
  HH: {
    title: '(Hold, Hold) — Mutual Restraint',
    label: 'Pareto-Optimal for Firms & Workers',
    detail:
      'Both firms earn 40 coins (80 collective) and total spending Z stays at 280 coins. Yet this outcome is unstable: either firm can unilaterally switch to Automate and jump from 40 to 50 coins.',
    bestResponseNote: 'Both vertical (A) and horizontal (B) best-response arrows point away from this cell.',
  },
  HA: {
    title: '(Hold, Automate) — Unilateral Restraint by A',
    label: 'The Sucker’s Payoff for Company A',
    detail:
      'Company A keeps full payroll while absorbing half of the lost demand from Company B’s layoffs. A’s profit plunges to 20 while B climbs to 50. A’s best response is to switch immediately to Automate (20 → 30).',
    bestResponseNote: 'Vertical arrow forces Company A downward from 20 to 30.',
  },
  AH: {
    title: '(Automate, Hold) — Unilateral Defection by A',
    label: 'The Free-Rider Temptation',
    detail:
      'Company A captures 100% of its 30-coin cost savings while sharing the 40-coin demand loss with B, lifting A’s profit to 50 and slashing B’s to 20. Company B’s best response is to retaliate (20 → 30).',
    bestResponseNote: 'Horizontal arrow forces Company B rightward from 20 to 30.',
  },
  AA: {
    title: '(Automate, Automate)',
    label: 'Unique Nash Equilibrium',
    detail:
      'Neither firm can improve by unilaterally rehiring workers (moving back to Hold cuts profit from 30 down to 20). Both firms are trapped at (30, 30)—strictly worse than (40, 40)—with 10 workers displaced and Z collapsed to 200.',
    bestResponseNote: 'All best-response arrows terminate here. Zero unilateral escape exists.',
  },
};

export const Module2PayoffMatrix: React.FC = () => {
  const matrix = buildToyPayoffMatrix(DEFAULT_TOY_PARAMS);
  const [selectedCell, setSelectedCell] = useState<CellKey>('AA');
  const [showArrows, setShowArrows] = useState<boolean>(true);

  const activeCell = matrix[selectedCell];
  const insight = CELL_INSIGHTS[selectedCell];

  return (
    <section id="module-2" className="scroll-mt-24 border-t border-[#ECEEF2] pt-14 mt-16">
      <h2 className="font-serif text-[26px] sm:text-[29px] font-medium tracking-[-0.015em] text-[#1A1D24] mb-5">
        2. Discovering the Prisoner’s Dilemma Equivalent with Automation
      </h2>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-5">
        Put all four coin outcomes from Module 1 into a simple <MathTex tex="2 \times 2" /> table.
        Company A picks the row (<em>Hold</em> or <em>Automate 50%</em>), Company B picks the
        column, and each cell records the resulting coin profits{' '}
        <MathTex tex="(\pi_A, \pi_B)" />. Before naming a single game-theory concept, test each
        company’s incentives directly:
      </p>

      <ol className="space-y-3.5 my-6 pl-5 list-decimal text-[15.5px] leading-[1.78] text-[#374151] marker:font-serif marker:font-semibold marker:text-[#1A1D24]">
        <li>
          <strong className="font-semibold text-[#1A1D24]">
            Unilateral Defection (Automating while rivals hold):
          </strong>{' '}
          If Company B holds steady, Company A raises its profit from <strong className="font-mono text-[#1A1D24]">40 → 50</strong>{' '}
          by automating. You pocket <MathTex tex="100\%" /> of your wage savings (<MathTex tex="s = 6" /> per task) while your fired workers’ lost spending is diluted across all{' '}
          <MathTex tex="\textcolor{#0F766E}{N}" /> competitors.
        </li>
        <li>
          <strong className="font-semibold text-[#1A1D24]">
            Unilateral Restraint (Holding while rivals automate):
          </strong>{' '}
          If Company B automates and Company A refuses, Company A’s profit plunges from{' '}
          <strong className="font-mono text-[#1A1D24]">40 → 20</strong>. You carry full payroll
          while losing revenue from your rival’s laid-off workers—so switching to Automate lifts you
          from <strong className="font-mono text-[#1A1D24]">20 → 30</strong>.
        </li>
        <li>
          <strong className="font-semibold text-[#1A1D24]">
            Mutual Defection vs. Mutual Restraint:
          </strong>{' '}
          Notice the punchline. Regardless of what Company B chooses, Company A earns strictly more
          coins by automating (<MathTex tex="50 > 40" /> and <MathTex tex="30 > 20" />). In game
          theory, a move that beats every alternative no matter what rivals do is called a{' '}
          <strong className="font-semibold text-[#1A1D24]">strictly dominant strategy</strong>.
          When both firms play it, they lock into{' '}
          <MathTex tex="(30, 30)" />, technicallt called a{' '}
          <strong className="font-semibold text-[#1A1D24]">Nash Equilibrium</strong> (no player can
          gain by deviating alone) that is{' '}
          <strong className="font-semibold text-[#1A1D24]">Pareto-dominated</strong> by{' '}
          <MathTex tex="(40, 40)" />.
        </li>
      </ol>

      <DiagramFrame
        figureNumber={2}
        title="2 × 2 Payoff Matrix & Best-Response Flow"
        subtitle="Click any outcome cell to inspect unilateral deviation incentives"
        footer={
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xs font-semibold text-[#1A1D24]">{insight.title}</span>
                <span className="text-xs text-[#7C8492]">· {insight.label}</span>
              </div>
              <p className="text-xs leading-relaxed text-[#555B66]">{insight.detail}</p>
              <p className="text-xs font-medium text-[#4F46E5] pt-0.5">{insight.bestResponseNote}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowArrows((prev) => !prev)}
              aria-pressed={showArrows}
              className="self-start px-3.5 py-2 text-xs font-medium rounded-sm border border-[#D1D5DB] bg-white text-[#1A1D24] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {showArrows ? 'Hide Best-Response Arrows' : 'Show Best-Response Arrows'}
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_210px] gap-6 items-center">
          {/* Interactive 2x2 Matrix with Overlaid Best-Response Arrows */}
          <div className="relative max-w-[440px] mx-auto w-full">
            {/* Column Headers */}
            <div className="grid grid-cols-[92px_1fr_1fr] items-end mb-2">
              <div />
              <div className="col-span-2 text-center text-[11px] font-medium text-[#7C8492] pb-1.5">
                Company B’s Choice (Column)
              </div>
              <div className="text-[11px] font-medium text-[#7C8492] text-right pr-3 pb-1">
                Company A
              </div>
              <div className="text-center text-xs font-semibold text-[#1A1D24] pb-1">Hold (0% AI)</div>
              <div className="text-center text-xs font-semibold text-[#4F46E5] pb-1">Automate (50%)</div>
            </div>

            {/* Matrix Body */}
            <div className="relative grid grid-cols-[92px_1fr_1fr] gap-2.5">
              {/* Row 1 Label */}
              <div className="flex items-center justify-end pr-2 text-xs font-semibold text-[#1A1D24]">
                Hold (0%)
              </div>

              {/* Cell HH */}
              <button
                type="button"
                onClick={() => setSelectedCell('HH')}
                aria-label="Inspect Hold Hold outcome: Company A earns 40 coins, Company B earns 40 coins"
                className={`relative p-4 rounded-sm border text-left transition-all cursor-pointer ${
                  selectedCell === 'HH'
                    ? 'border-[#059669] bg-[#F0FDF4]/60 ring-1 ring-[#059669]'
                    : 'border-[#E5E7EB] bg-white hover:border-[#9CA3AF]'
                }`}
              >
                <div className="text-[11px] text-[#059669] font-medium mb-1">Pareto-Optimal</div>
                <div className="font-mono tabular-nums text-lg font-semibold text-[#1A1D24]">
                  (40, 40)
                </div>
                <div className="font-mono tabular-nums text-[11px] text-[#7C8492] mt-1">
                  Z = 280 · 0 layoffs
                </div>
              </button>

              {/* Cell HA */}
              <button
                type="button"
                onClick={() => setSelectedCell('HA')}
                aria-label="Inspect Hold Automate outcome: Company A earns 20 coins, Company B earns 50 coins"
                className={`relative p-4 rounded-sm border text-left transition-all cursor-pointer ${
                  selectedCell === 'HA'
                    ? 'border-[#4F46E5] bg-[#F5F6FF] ring-1 ring-[#4F46E5]'
                    : 'border-[#E5E7EB] bg-white hover:border-[#9CA3AF]'
                }`}
              >
                <div className="text-[11px] text-[#7C8492] font-medium mb-1">B Defects</div>
                <div className="font-mono tabular-nums text-lg font-semibold text-[#1A1D24]">
                  (<span className="text-[#DC2626]">20</span>,{' '}
                  <span className="text-[#059669]">50</span>)
                </div>
                <div className="font-mono tabular-nums text-[11px] text-[#7C8492] mt-1">
                  Z = 240 · 5 layoffs
                </div>
              </button>

              {/* Row 2 Label */}
              <div className="flex items-center justify-end pr-2 text-xs font-semibold text-[#4F46E5]">
                Automate
              </div>

              {/* Cell AH */}
              <button
                type="button"
                onClick={() => setSelectedCell('AH')}
                aria-label="Inspect Automate Hold outcome: Company A earns 50 coins, Company B earns 20 coins"
                className={`relative p-4 rounded-sm border text-left transition-all cursor-pointer ${
                  selectedCell === 'AH'
                    ? 'border-[#4F46E5] bg-[#F5F6FF] ring-1 ring-[#4F46E5]'
                    : 'border-[#E5E7EB] bg-white hover:border-[#9CA3AF]'
                }`}
              >
                <div className="text-[11px] text-[#7C8492] font-medium mb-1">A Defects</div>
                <div className="font-mono tabular-nums text-lg font-semibold text-[#1A1D24]">
                  (<span className="text-[#059669]">50</span>,{' '}
                  <span className="text-[#DC2626]">20</span>)
                </div>
                <div className="font-mono tabular-nums text-[11px] text-[#7C8492] mt-1">
                  Z = 240 · 5 layoffs
                </div>
              </button>

              {/* Cell AA (Nash Equilibrium) */}
              <button
                type="button"
                onClick={() => setSelectedCell('AA')}
                aria-label="Inspect Automate Automate Nash Equilibrium outcome: Company A earns 30 coins, Company B earns 30 coins"
                className={`relative p-4 rounded-sm border text-left transition-all cursor-pointer ${
                  selectedCell === 'AA'
                    ? 'border-[#DC2626] bg-[#FEF2F2]/70 ring-1 ring-[#DC2626]'
                    : 'border-[#FCA5A5] bg-[#FEF2F2]/30 hover:border-[#DC2626]'
                }`}
              >
                <div className="text-[11px] text-[#DC2626] font-semibold mb-1">
                  Nash Equilibrium
                </div>
                <div className="font-mono tabular-nums text-lg font-semibold text-[#1A1D24]">
                  (30, 30)
                </div>
                <div className="font-mono tabular-nums text-[11px] text-[#7C8492] mt-1">
                  Z = 200 · 10 layoffs
                </div>
              </button>

              {/* Clean SVG Best-Response Directional Arrows Overlay */}
              {showArrows && (
                <svg
                  viewBox="0 0 440 200"
                  className="pointer-events-none absolute inset-0 w-full h-full"
                  aria-hidden="true"
                >
                  <defs>
                    <marker
                      id="br-arrow"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="5.5"
                      markerHeight="5.5"
                      orient="auto"
                    >
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#4F46E5" />
                    </marker>
                  </defs>
                  {/* Top Horizontal: HH -> HA (B best response: 40 -> 50) */}
                  <line
                    x1="252"
                    y1="48"
                    x2="284"
                    y2="48"
                    stroke="#4F46E5"
                    strokeWidth="2"
                    markerEnd="url(#br-arrow)"
                  />
                  {/* Bottom Horizontal: AH -> AA (B best response: 20 -> 30) */}
                  <line
                    x1="252"
                    y1="152"
                    x2="284"
                    y2="152"
                    stroke="#4F46E5"
                    strokeWidth="2"
                    markerEnd="url(#br-arrow)"
                  />
                  {/* Left Vertical: HH -> AH (A best response: 40 -> 50) */}
                  <line
                    x1="178"
                    y1="82"
                    x2="178"
                    y2="114"
                    stroke="#4F46E5"
                    strokeWidth="2"
                    markerEnd="url(#br-arrow)"
                  />
                  {/* Right Vertical: HA -> AA (A best response: 20 -> 30) */}
                  <line
                    x1="352"
                    y1="82"
                    x2="352"
                    y2="114"
                    stroke="#4F46E5"
                    strokeWidth="2"
                    markerEnd="url(#br-arrow)"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Side Metric Summary of Selected Cell */}
          <div className="border-t md:border-t-0 md:border-l border-[#ECEEF2] pt-4 md:pt-0 md:pl-5 space-y-3">
            <div className="text-xs font-medium text-[#7C8492]">Selected Outcome</div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#555B66]">Firm A profit</span>
                <span className="font-mono tabular-nums font-semibold text-[#1A1D24]">
                  {activeCell.profitA} coins
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555B66]">Firm B profit</span>
                <span className="font-mono tabular-nums font-semibold text-[#1A1D24]">
                  {activeCell.profitB} coins
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555B66]">Collective profit</span>
                <span className="font-mono tabular-nums font-semibold text-[#1A1D24]">
                  {activeCell.collectiveProfit} coins
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555B66]">Market pool Z</span>
                <span className="font-mono tabular-nums font-semibold text-[#1A1D24]">
                  {activeCell.totalPoolZ} coins
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#ECEEF2]">
                <span className="text-[#555B66]">Workers laid off</span>
                <span className="font-mono tabular-nums font-semibold text-[#DC2626]">
                  {activeCell.totalLaidOff} / 20
                </span>
              </div>
            </div>
          </div>
        </div>
      </DiagramFrame>

      <p className="text-[16px] leading-[1.82] text-[#374151]">
        That is equivalent to our typical Prisoner’s Dilemma unexpectedly derived without a single line of jargon. Now, neither
        company is stupid, malicious, or blind to the shrinking market. Both see the exact same
        table. Yet because every unilateral arrow points away from restraint and straight into{' '}
        <MathTex tex="(30, 30)" />, competition transforms a collectively destructive move into an
        individually mandatory one. Now let’s leave the two-firm toy world behind and formalize the
        continuous <MathTex tex="\textcolor{#0F766E}{N}" />-firm economy using calculus.
      </p>
    </section>
  );
};
