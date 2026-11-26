import React, { useState } from 'react';
import { DiagramFrame } from './DiagramFrame';
import { MathTex } from './MathTex';
import {
  evaluatePolicy,
  FalkModelParams,
  PolicyId,
} from '@/lib/gt/economics';

interface Module6Props {
  falkParams: FalkModelParams;
}

const POLICY_OPTIONS: { id: PolicyId; label: string; shortTag: string }[] = [
  { id: 'none', label: 'No Policy (Baseline)', shortTag: 'Baseline' },
  { id: 'ubi', label: 'Universal Basic Income (UBI)', shortTag: '∂U/∂α = 0' },
  { id: 'profitTax', label: 'Corporate Profit Tax (τ)', shortTag: '(1−τ) cancels' },
  { id: 'upskilling', label: 'Upskilling & Retraining (+Δη)', shortTag: 'Shrinks ℓ' },
  { id: 'equityPact', label: 'Worker Equity & CEO Pacts', shortTag: 'Unstable' },
  { id: 'pigouvian', label: 'Pigouvian Automation Tax (t*)', shortTag: 'Closes wedge' },
];

export const Module6PolicyLab: React.FC<Module6Props> = ({ falkParams }) => {
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyId>('none');
  const evaluation = evaluatePolicy(selectedPolicy, falkParams);
  const { equilibrium: eq, effectiveParams: eff, automationTax } = evaluation;

  // SVG Chart coordinate mapping matching Module 3 visual language
  const W = 680;
  const H = 285;
  const padL = 62;
  const padR = 28;
  const padT = 24;
  const padB = 46;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const yMax = Math.max(1.2, eq.s + 0.25, eq.ell + eff.k * 1.0);
  const toX = (a: number) => padL + a * plotW;
  const toY = (v: number) => padT + plotH - Math.min(Math.max(v / yMax, 0), 1) * plotH;

  // Private MC including Pigouvian automation tax t*: (ℓ/N + t*) + kα
  const privateMCAt = (a: number) => eq.ell / eff.N + automationTax + eff.k * a;
  const socialMCAt = (a: number) => eq.ell + eff.k * a;

  const clipLine = (fn: (a: number) => number): [number, number, number, number] => {
    const y0 = fn(0);
    const y1 = fn(1);
    let aEnd = 1;
    if (y1 > yMax && eff.k > 0) {
      aEnd = Math.min(1, Math.max(0, (yMax - y0) / eff.k));
    }
    return [toX(0), toY(Math.min(y0, yMax)), toX(aEnd), toY(Math.min(fn(aEnd), yMax))];
  };

  const [px0, py0, px1, py1] = clipLine(privateMCAt);
  const [sx0, sy0, sx1, sy1] = clipLine(socialMCAt);

  const xCoop = toX(eq.alphaCoop);
  const xNash = toX(eq.alphaNash);
  const yS = toY(eq.s);

  return (
    <section id="module-6" className="scroll-mt-24 border-t border-[#ECEEF2] pt-14 mt-16">
      <h2 className="font-serif text-[26px] sm:text-[29px] font-medium tracking-[-0.015em] text-[#1A1D24] mb-5">
        6. Policy Stress-Test: Why Most Fixes Fail Mathematically
      </h2>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-5">
        Once you have the firm’s first-order condition in front of you, evaluating policy proposals
        stops being ideological and becomes a one-line derivative check. A policy can only reduce
        equilibrium over-automation <MathTex tex="\textcolor{#4F46E5}{\alpha^{\text{Nash}}}" /> if
        it actually survives differentiation with respect to{' '}
        <MathTex tex="\textcolor{#4F46E5}{\alpha_i}" />:
      </p>

      <ul className="space-y-3 my-5 pl-5 list-disc text-[15.5px] leading-[1.78] text-[#374151] marker:text-[#7C8492]">
        <li>
          <strong className="font-semibold text-[#1A1D24]">Universal Basic Income (UBI):</strong>{' '}
          Adds a constant <MathTex tex="+U" /> to autonomous demand <MathTex tex="A" />. When firm{' '}
          <MathTex tex="i" /> differentiates <MathTex tex="\pi_i" /> with respect to{' '}
          <MathTex tex="\textcolor{#4F46E5}{\alpha_i}" />,{' '}
          <MathTex tex="\frac{\partial U}{\partial \textcolor{#4F46E5}{\alpha_i}} = 0" />. UBI
          protects human living standards and props up aggregate spending, but does{' '}
          <em>not</em> alter the layoff margin at all.
        </li>
        <li>
          <strong className="font-semibold text-[#1A1D24]">
            Corporate Profit / Capital Tax (<MathTex tex="\tau" />):
          </strong>{' '}
          Multiplies firm profit by <MathTex tex="(1 - \tau)" />. Setting{' '}
          <MathTex tex="(1-\tau)\frac{\partial \pi_i}{\partial \textcolor{#4F46E5}{\alpha_i}} = 0" />{' '}
          cancels <MathTex tex="(1-\tau)" /> out cleanly again bringing zero change to equilibrium layoffs.
        </li>
        <li>
          <strong className="font-semibold text-[#1A1D24]">Upskilling &amp; Retraining:</strong>{' '}
          Raises reabsorption <MathTex tex="\textcolor{#059669}{\eta}" />, directly shrinking{' '}
          <MathTex tex="\textcolor{#DC2626}{\ell} = \lambda(1 - \textcolor{#059669}{\eta})w" /> and
          narrowing the wedge. Genuinely helpful, yet unable to close the wedge completely unless{' '}
          <MathTex tex="\textcolor{#059669}{\eta} = 1" /> (zero transition income loss).
        </li>
        <li>
          <strong className="font-semibold text-[#1A1D24]">
            Worker Equity &amp; Coasean CEO Pacts:
          </strong>{' '}
          Giving workers shares in their own firm does not halt rival firms’ layoffs, and voluntary
          industry slowdowns break because defection still yields a positive gradient{' '}
          <MathTex tex="\textcolor{#DC2626}{\ell}(1 - 1/\textcolor{#0F766E}{N}) > 0" />.
        </li>
        <li>
          <strong className="font-semibold text-[#1A1D24]">
            Pigouvian Automation Tax (
            <MathTex tex="t^* = \textcolor{#DC2626}{\ell}(1 - 1/\textcolor{#0F766E}{N})" />):
          </strong>{' '}
          Enters <em>inside</em> the per-task marginal cost of{' '}
          <MathTex tex="\textcolor{#4F46E5}{\alpha_i}" />, forcing every firm to internalize the
          exact demand externality it exports to its{' '}
          <MathTex tex="\textcolor{#0F766E}{N} - 1" /> rivals and shifting{' '}
          <MathTex tex="\textcolor{#4F46E5}{\alpha^{\text{Nash}}} \to \textcolor{#4F46E5}{\alpha^{\text{Coop}}}" />.
        </li>
      </ul>

      <DiagramFrame
        figureNumber={6}
        title="Interactive Policy Stress-Test Simulator"
        subtitle={`Using live Module 3 parameters: N = ${falkParams.N}, k = ${falkParams.k.toFixed(2)}, η = ${Math.round(falkParams.eta * 100)}%`}
        footer={
          <div className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-xs font-semibold text-[#1A1D24]">{evaluation.name}</span>
              <span
                className={`font-mono text-xs font-semibold ${
                  evaluation.closesWedge === 'full'
                    ? 'text-[#059669]'
                    : evaluation.closesWedge === 'partial'
                    ? 'text-[#B45309]'
                    : 'text-[#DC2626]'
                }`}
              >
                {evaluation.derivativeVerdict}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#555B66]">{evaluation.plainExplanation}</p>
          </div>
        }
      >
        {/* Accessible Radio Group for Policies */}
        <fieldset className="mb-5">
          <legend className="sr-only">Select an economic policy to test against the first-order condition</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {POLICY_OPTIONS.map((opt) => {
              const checked = selectedPolicy === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`flex items-start gap-2.5 px-3 py-2.5 rounded-sm border text-xs cursor-pointer transition-colors ${
                    checked
                      ? 'border-[#4F46E5] bg-[#F5F6FF] text-[#1A1D24]'
                      : 'border-[#E5E7EB] bg-white text-[#374151] hover:border-[#9CA3AF]'
                  }`}
                >
                  <input
                    type="radio"
                    name="policy-stress-test"
                    value={opt.id}
                    checked={checked}
                    onChange={() => setSelectedPolicy(opt.id)}
                    className="mt-0.5 accent-[#4F46E5] cursor-pointer"
                  />
                  <span className="flex flex-col">
                    <span className="font-medium leading-snug">{opt.label}</span>
                    <span className="font-mono text-[10.5px] text-[#7C8492] mt-0.5">
                      {opt.shortTag}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Live Derivative Banner */}
        <div className="mb-5 py-3 px-4 border border-[#ECEEF2] bg-[#FAFAFC] rounded-sm">
          <div className="text-[11px] text-[#7C8492] mb-1 text-center">
            Active First-Order Condition (Margin Check)
          </div>
          <MathTex block className="!my-1" tex={evaluation.focLatex} />
        </div>

        {/* Live Policy Response SVG Chart */}
        <div className="w-full">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto max-w-[680px] mx-auto block"
            role="img"
            aria-label="Policy simulator line chart showing how the selected policy shifts or leaves unchanged the Over-Automation Wedge between Cooperative and Nash equilibria"
          >
            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1.0].map((f) => {
              const val = Number((f * yMax).toFixed(2));
              const y = toY(val);
              return (
                <g key={f}>
                  <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#F1F3F6" strokeWidth="1" />
                  <text
                    x={padL - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-[#7C8492] text-[10.5px]"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    {val.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* X-axis ticks */}
            {[0, 0.25, 0.5, 0.75, 1.0].map((t) => {
              const x = toX(t);
              return (
                <g key={t}>
                  <line x1={x} y1={padT + plotH} x2={x} y2={padT + plotH + 5} stroke="#9CA3AF" strokeWidth="1" />
                  <text
                    x={x}
                    y={padT + plotH + 20}
                    textAnchor="middle"
                    className="fill-[#7C8492] text-[10.5px]"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    {t.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#1A1D24" strokeWidth="1.2" />
            <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#1A1D24" strokeWidth="1.2" />

            <text
              x={padL + plotW / 2}
              y={H - 6}
              textAnchor="middle"
              className="fill-[#374151] text-[11.5px] font-medium"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Automation Fraction α
            </text>

            {/* Shaded Wedge (vanishes cleanly under Pigouvian tax!) */}
            {eq.wedgeActual > 0.002 ? (
              <g>
                <rect
                  x={xCoop}
                  y={padT}
                  width={Math.max(0, xNash - xCoop)}
                  height={plotH}
                  fill="#4F46E5"
                  fillOpacity="0.09"
                />
                {xNash - xCoop > 54 && (
                  <text
                    x={(xCoop + xNash) / 2}
                    y={padT + 18}
                    textAnchor="middle"
                    className="fill-[#4F46E5] text-[10.5px] font-semibold"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    Δα = {eq.wedgeActual.toFixed(3)}
                  </text>
                )}
              </g>
            ) : (
              <text
                x={Math.min(Math.max(xCoop, padL + 90), W - padR - 90)}
                y={padT + 18}
                textAnchor="middle"
                className="fill-[#059669] text-[11px] font-semibold"
                fontFamily="IBM Plex Mono, monospace"
              >
                Wedge Closed: Δα = 0.000 (Private = Social)
              </text>
            )}

            {/* Marginal Saving Line */}
            <line
              x1={padL}
              y1={yS}
              x2={W - padR}
              y2={yS}
              stroke="#1A1D24"
              strokeWidth="1.6"
              strokeDasharray="5 4"
            />
            <text
              x={W - padR - 4}
              y={yS - 7}
              textAnchor="end"
              className="fill-[#1A1D24] text-[11px] font-medium"
              fontFamily="IBM Plex Mono, monospace"
            >
              Marginal Saving s = {eq.s.toFixed(2)}
            </text>

            {/* Social MC */}
            <line x1={sx0} y1={sy0} x2={sx1} y2={sy1} stroke="#DC2626" strokeWidth="2.2" />

            {/* Private MC (shifts up onto Social MC when Pigouvian tax is selected) */}
            <line
              x1={px0}
              y1={py0}
              x2={px1}
              y2={py1}
              stroke={selectedPolicy === 'pigouvian' ? '#059669' : '#4F46E5'}
              strokeWidth="2"
              strokeDasharray={selectedPolicy === 'pigouvian' ? '6 3' : undefined}
            />

            {/* Equilibrium Drop Lines */}
            <line x1={xCoop} y1={yS} x2={xCoop} y2={padT + plotH} stroke="#DC2626" strokeWidth="1.2" strokeDasharray="3 3" />
            <circle cx={xCoop} cy={toY(Math.min(socialMCAt(eq.alphaCoop), yMax))} r="4.5" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2" />

            <line
              x1={xNash}
              y1={yS}
              x2={xNash}
              y2={padT + plotH}
              stroke={selectedPolicy === 'pigouvian' ? '#059669' : '#4F46E5'}
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            <circle
              cx={xNash}
              cy={toY(Math.min(privateMCAt(eq.alphaNash), yMax))}
              r="4.5"
              fill={selectedPolicy === 'pigouvian' ? '#059669' : '#4F46E5'}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Tabular Output Strip */}
        <div className="mt-4 pt-3 border-t border-[#ECEEF2] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-[11px] text-[#7C8492]">Resulting α_Nash</div>
            <div className="font-mono tabular-nums text-base font-semibold text-[#4F46E5]">
              {(eq.alphaNash * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#7C8492]">Cooperative α_Coop</div>
            <div className="font-mono tabular-nums text-base font-semibold text-[#DC2626]">
              {(eq.alphaCoop * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#7C8492]">Remaining Wedge Δα</div>
            <div className="font-mono tabular-nums text-base font-semibold text-[#1A1D24]">
              {eq.wedgeActual.toFixed(3)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#7C8492]">Wedge Reduced</div>
            <div
              className={`font-mono tabular-nums text-base font-semibold ${
                evaluation.wedgeReductionPct > 99
                  ? 'text-[#059669]'
                  : evaluation.wedgeReductionPct > 0
                  ? 'text-[#B45309]'
                  : 'text-[#7C8492]'
              }`}
            >
              {evaluation.wedgeReductionPct.toFixed(0)}%
            </div>
          </div>
        </div>
      </DiagramFrame>
    </section>
  );
};
