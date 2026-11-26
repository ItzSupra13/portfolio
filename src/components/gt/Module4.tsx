import React, { useState } from 'react';
import { DiagramFrame, EditorialSlider } from './DiagramFrame';
import { MathTex } from './MathTex';
import { computeRedQueenCurve, FalkModelParams } from '@/lib/gt/economics';
import { VAR_COLORS } from '@/lib/gt/variables';

interface Module4Props {
  falkParams: FalkModelParams;
}

export const Module4RedQueen: React.FC<Module4Props> = ({ falkParams }) => {
  const [betaMax, setBetaMax] = useState<number>(0.42);
  const rq = computeRedQueenCurve(betaMax, falkParams, 44);

  const W = 680;
  const H = 310;
  const padL = 62;
  const padR = 56;
  const padT = 26;
  const padB = 46;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const profits = rq.points.flatMap((pt) => [pt.jointProfitNash, pt.jointProfitCoop]);
  const minP = Math.min(...profits) - 0.15;
  const maxP = Math.max(...profits) + 0.15;

  const toX = (q: number) => padL + q * plotW;
  const toYProfit = (p: number) =>
    padT + plotH - ((p - minP) / Math.max(maxP - minP, 0.01)) * plotH;
  const toYAlpha = (a: number) => padT + plotH - a * plotH;

  const pathFrom = (pts: [number, number][]) =>
    pts.map(([x, y], idx) => `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

  const profitNashPath = pathFrom(rq.points.map((pt) => [toX(pt.capability), toYProfit(pt.jointProfitNash)]));
  const profitCoopPath = pathFrom(rq.points.map((pt) => [toX(pt.capability), toYProfit(pt.jointProfitCoop)]));
  const alphaNashPath = pathFrom(rq.points.map((pt) => [toX(pt.capability), toYAlpha(pt.alphaNash)]));

  const peakX = toX(rq.peakProfitCapability);
  const peakY = toYProfit(rq.peakProfit);
  const endPt = rq.points[rq.points.length - 1];

  return (
    <section id="module-4" className="scroll-mt-24 border-t border-[#ECEEF2] pt-14 mt-16">
      <h2 className="font-serif text-[26px] sm:text-[29px] font-medium tracking-[-0.015em] text-[#1A1D24] mb-5">
        4. The Red Queen Effect, “AI-Washing,” &amp; Where Do the Customers Go?
      </h2>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-5">
        A natural objection to Module 3 is optimism: <em>“Sure, mediocre AI that barely saves money
        creates a demand trap, but won’t genuinely transformative, vastly more productive AI fix the
        problem?”</em> Surprisingly, the calculus points in the exact opposite direction.
      </p>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-4">
        When AI models grow more capable (indexed by <MathTex tex="\textcolor{#7C3AED}{q} \in [0, 1]" />),
        they do not merely lower internal unit costs <MathTex tex="c(\textcolor{#7C3AED}{q})" />.
        They also let faster-automating firms cut prices, ship faster, and steal market share from
        slower competitors. Formalize firm <MathTex tex="i" />’s market share as:
      </p>

      <MathTex
        block
        tex="S_i(\textcolor{#4F46E5}{\alpha_i}, \textcolor{#4F46E5}{\alpha_{-i}}) = \frac{1}{\textcolor{#0F766E}{N}} + \frac{\beta(\textcolor{#7C3AED}{q})}{\textcolor{#0F766E}{N}}\left(\textcolor{#4F46E5}{\alpha_i} - \bar{\textcolor{#4F46E5}{\alpha}}_{-i}\right)"
      />

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-4">
        Differentiating{' '}
        <MathTex tex="\pi_i = S_i(\textcolor{#4F46E5}{\alpha}) D(\textcolor{#4F46E5}{\alpha}) - w + s(\textcolor{#7C3AED}{q})\textcolor{#4F46E5}{\alpha_i} - \frac{1}{2}\textcolor{#B45309}{k}\textcolor{#4F46E5}{\alpha_i}^2" />{' '}
        adds a positive <strong className="font-semibold text-[#1A1D24]">market-share stealing term</strong>{' '}
        <MathTex tex="+\frac{\beta(\textcolor{#7C3AED}{q})}{\textcolor{#0F766E}{N}} D(\textcolor{#4F46E5}{\alpha})" />{' '}
        to every firm’s private marginal benefit of automating. Yet in symmetric equilibrium (
        <MathTex tex="\textcolor{#4F46E5}{\alpha_i} = \bar{\textcolor{#4F46E5}{\alpha}}" />), the
        relative term <MathTex tex="(\textcolor{#4F46E5}{\alpha_i} - \bar{\textcolor{#4F46E5}{\alpha}}_{-i})" />{' '}
        equals <strong className="font-semibold text-[#1A1D24]">identically zero</strong>. Every
        firm sprints harder to steal share, every rival matches the sprint, market shares stay fixed
        at <MathTex tex="1/\textcolor{#0F766E}{N}" />, and the only permanent residue is a steeper
        collapse in total demand <MathTex tex="D(\textcolor{#4F46E5}{\alpha})" />. Economists call
        this the <strong className="font-semibold text-[#1A1D24]">Red Queen Effect</strong>: you
        must automate faster and faster merely to stay in the same place.
      </p>

      <DiagramFrame
        figureNumber={4}
        title="The Red Queen Curve: Automation Rate vs. Industry Profit"
        subtitle="Early AI lifts profits; once market-share chasing dominates, industry profits peak and dive"
        footer={
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <EditorialSlider
                id="slider-beta"
                symbol="β"
                label="Market-share stealing intensity"
                value={betaMax}
                min={0.0}
                max={0.85}
                step={0.05}
                color={VAR_COLORS.gamma}
                formatValue={(v) => v.toFixed(2)}
                onChange={setBetaMax}
              />
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-[11px] text-[#7C8492]">Profit Peak at q</div>
                  <div className="font-mono tabular-nums font-semibold text-[#1A1D24]">
                    {rq.peakProfitCapability.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#7C8492]">Drop from Peak</div>
                  <div className="font-mono tabular-nums font-semibold text-[#DC2626]">
                    −{rq.profitDropFromPeak.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#7C8492]">End α_Nash</div>
                  <div className="font-mono tabular-nums font-semibold text-[#4F46E5]">
                    {(endPt.alphaNash * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[#555B66] pt-2 border-t border-[#E6E8EC]">
              Notice the divergence at high AI capability (<MathTex tex="\textcolor{#7C3AED}{q} \to 1" />):
              cooperative profits (dashed gray) keep climbing smoothly because coordinated firms stop
              at <MathTex tex="\alpha^{\text{Coop}}" />. Competitive Nash profits (solid crimson) peak
              at <strong className="font-mono text-[#1A1D24]">q = {rq.peakProfitCapability.toFixed(2)}</strong>{' '}
              and then plunge as <MathTex tex="\alpha^{\text{Nash}}" /> (indigo) races toward 100%.
            </p>
          </div>
        }
      >
        <div className="w-full">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto max-w-[680px] mx-auto block"
            role="img"
            aria-label="Red Queen line chart showing industry profit peaking and then diving as AI capability increases and Nash automation approaches 100 percent"
          >
            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((f) => {
              const y = padT + plotH - f * plotH;
              const pVal = minP + f * (maxP - minP);
              return (
                <g key={f}>
                  <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#F1F3F6" strokeWidth="1" />
                  <text
                    x={padL - 9}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-[#DC2626] text-[10px]"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    {pVal.toFixed(1)}
                  </text>
                  <text
                    x={W - padR + 9}
                    y={y + 4}
                    textAnchor="start"
                    className="fill-[#4F46E5] text-[10px]"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    {Math.round(f * 100)}%
                  </text>
                </g>
              );
            })}

            {/* X-axis ticks */}
            {[0, 0.25, 0.5, 0.75, 1].map((q) => {
              const x = toX(q);
              return (
                <g key={q}>
                  <line x1={x} y1={padT + plotH} x2={x} y2={padT + plotH + 5} stroke="#9CA3AF" strokeWidth="1" />
                  <text
                    x={x}
                    y={padT + plotH + 20}
                    textAnchor="middle"
                    className="fill-[#7C8492] text-[10.5px]"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    {q.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Left, Right, and Bottom Axes */}
            <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#1A1D24" strokeWidth="1.2" />
            <line x1={W - padR} y1={padT} x2={W - padR} y2={padT + plotH} stroke="#D1D5DB" strokeWidth="1" />
            <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#1A1D24" strokeWidth="1.2" />

            {/* Axis labels */}
            <text
              x={padL + plotW / 2}
              y={H - 6}
              textAnchor="middle"
              className="fill-[#374151] text-[11.5px] font-medium"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              AI Capability Index q (0 = Early Tools → 1 = Full Automation)
            </text>
            <text
              x={16}
              y={padT + plotH / 2}
              textAnchor="middle"
              transform={`rotate(-90 16 ${padT + plotH / 2})`}
              className="fill-[#DC2626] text-[11px] font-medium"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Industry Profit K
            </text>
            <text
              x={W - 12}
              y={padT + plotH / 2}
              textAnchor="middle"
              transform={`rotate(90 ${W - 12} ${padT + plotH / 2})`}
              className="fill-[#4F46E5] text-[11px] font-medium"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Equilibrium α_Nash
            </text>

            {/* Cooperative Profit (Dashed Benchmark) */}
            <path d={profitCoopPath} fill="none" stroke="#9CA3AF" strokeWidth="1.6" strokeDasharray="5 4" />

            {/* Equilibrium Automation Curve */}
            <path d={alphaNashPath} fill="none" stroke="#4F46E5" strokeWidth="2" />

            {/* Industry Nash Profit Curve */}
            <path d={profitNashPath} fill="none" stroke="#DC2626" strokeWidth="2.2" />

            {/* Profit Peak Marker */}
            <line x1={peakX} y1={peakY} x2={peakX} y2={padT + plotH} stroke="#DC2626" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={peakX} cy={peakY} r="4.5" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2" />
            <text
              x={peakX}
              y={Math.min(peakY + 20, padT + plotH - 10)}
              textAnchor="middle"
              paintOrder="stroke"
              stroke="#FFFFFF"
              strokeWidth="4.5"
              className="fill-[#DC2626] text-[10.5px] font-semibold"
              fontFamily="IBM Plex Mono, monospace"
            >
              Profit Peak (q={rq.peakProfitCapability.toFixed(2)})
            </text>

            {/* Clean inline legend at top left with white backdrop */}
            <g transform={`translate(${padL + 10}, ${padT + 8})`}>
              <rect x="-5" y="-8" width="214" height="52" rx="2" fill="#FFFFFF" fillOpacity="0.92" />
              <line x1="0" y1="0" x2="18" y2="0" stroke="#DC2626" strokeWidth="2.2" />
              <text x="24" y="4" className="fill-[#1A1D24] text-[10.5px]" fontFamily="Plus Jakarta Sans, sans-serif">
                Nash Profit K(α_Nash)
              </text>

              <line x1="0" y1="17" x2="18" y2="17" stroke="#9CA3AF" strokeWidth="1.6" strokeDasharray="4 3" />
              <text x="24" y="21" className="fill-[#555B66] text-[10.5px]" fontFamily="Plus Jakarta Sans, sans-serif">
                Cooperative Profit K(α_Coop)
              </text>

              <line x1="0" y1="34" x2="18" y2="34" stroke="#4F46E5" strokeWidth="2" />
              <text x="24" y="38" className="fill-[#4F46E5] text-[10.5px]" fontFamily="Plus Jakarta Sans, sans-serif">
                Nash Automation α_Nash (right axis)
              </text>
            </g>
          </svg>
        </div>
      </DiagramFrame>

      <h3 className="font-serif text-[20px] font-medium text-[#1A1D24] mt-10 mb-4">
        Why “AI-Washing” and Capex Arms Races Happen in Practice
      </h3>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-5">
        This equilibrium explains a puzzling real-world pattern documented across 2025–2026 labor
        data: firms publicly announce layoffs under the banner of “AI transformation” while funneling
        billions into GPU clusters and AI vendor contracts even when Harvard Business School studies
        find that actual end-to-end AI replacement is still uneven.
      </p>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-5">
        Why use AI as the framing? Because converting recurring operating payroll (OpEx) into AI
        compute (CapEx) signals to institutional investors that management is aggressively defending
        its market-share term <MathTex tex="+\beta(\textcolor{#7C3AED}{q})" />. Even when a
        restructuring is driven partly by post-boom cost discipline (“AI-washing”), attributing
        headcount reductions to AI avoids signaling shrinking demand, and instead signals future
        margin expansion.
      </p>

      <p className="text-[16px] leading-[1.82] text-[#374151]">
        Crucially, this does <strong className="font-semibold text-[#1A1D24]">not</strong> require
        CEOs to be shortsighted or ignorant of the demand cliff. As Gerry Tsoukalas puts it using
        the myth of <em>Odysseus and the Sirens</em>: even if every major executive sat in one room
        and agreed that industry-wide layoffs would shrink everyone’s customer base, fiduciary duty
        to their own shareholders binds them to the dominant strategy the moment they walk out the
        door. Holding back unilaterally simply hands your market share to rivals while still
        suffering the macroeconomic demand drop they trigger.
      </p>
    </section>
  );
};
