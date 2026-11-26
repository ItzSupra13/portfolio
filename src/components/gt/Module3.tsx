import React from 'react';
import { DiagramFrame, EditorialSlider } from './DiagramFrame';
import { MathTex } from './MathTex';
import {
  FalkModelParams,
  FALK_PRESETS,
  solveFalkModel,
} from '@/lib/gt/economics';
import { VAR_COLORS } from '@/lib/gt/variables';

interface Module3Props {
  params: FalkModelParams;
  onChangeParams: (next: FalkModelParams) => void;
}

export const Module3FormalModel: React.FC<Module3Props> = ({ params, onChangeParams }) => {
  const eq = solveFalkModel(params);

  // SVG Chart coordinate mapping: x = alpha ∈ [0, 1], y = marginal value ∈ [0, yMax]
  const W = 680;
  const H = 300;
  const padL = 62;
  const padR = 28;
  const padT = 24;
  const padB = 46;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const yMax = Math.max(1.2, eq.s + 0.25, eq.ell + params.k * 1.0);
  const toX = (a: number) => padL + a * plotW;
  const toY = (v: number) => padT + plotH - Math.min(Math.max(v / yMax, 0), 1) * plotH;

  // Compute polyline coordinates for Private MC = ℓ/N + k*α and Social MC = ℓ + k*α
  const privateMCAt = (a: number) => eq.ell / params.N + params.k * a;
  const socialMCAt = (a: number) => eq.ell + params.k * a;

  const clipLineToYMax = (fn: (a: number) => number): [number, number, number, number] => {
    const y0 = fn(0);
    const y1 = fn(1);
    let aEnd = 1;
    if (y1 > yMax && params.k > 0) {
      aEnd = Math.min(1, Math.max(0, (yMax - y0) / params.k));
    }
    return [toX(0), toY(Math.min(y0, yMax)), toX(aEnd), toY(Math.min(fn(aEnd), yMax))];
  };

  const [px0, py0, px1, py1] = clipLineToYMax(privateMCAt);
  const [sx0, sy0, sx1, sy1] = clipLineToYMax(socialMCAt);

  const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map((f) => Number((f * yMax).toFixed(2)));
  const xTicks = [0, 0.25, 0.5, 0.75, 1.0];

  const xCoop = toX(eq.alphaCoop);
  const xNash = toX(eq.alphaNash);
  const yS = toY(eq.s);

  return (
    <section id="module-3" className="scroll-mt-24 border-t border-[#ECEEF2] pt-14 mt-16">
      <h2 className="font-serif text-[26px] sm:text-[29px] font-medium tracking-[-0.015em] text-[#1A1D24] mb-5">
        3. Formalizing “The AI Layoff Trap” (Falk &amp; Tsoukalas, 2026)
      </h2>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-5">
        In their 2026 working paper <em>The AI Layoff Trap</em> (arXiv:2603.20617), Brett Hemenway
        Falk and Gerry Tsoukalas generalize our two-firm coin economy into a continuous{' '}
        <MathTex tex="\textcolor{#0F766E}{N}" />-firm game. Every firm{' '}
        <MathTex tex="i \in \{1, \dots, \textcolor{#0F766E}{N}\}" /> chooses a continuous automation
        fraction <MathTex tex="\textcolor{#4F46E5}{\alpha_i} \in [0, 1]" />, displacing{' '}
        <MathTex tex="\textcolor{#4F46E5}{\alpha_i} L" /> workers. Each automated task yields a
        direct cost saving of <MathTex tex="s = w - c" />, offset by a convex integration friction
        cost <MathTex tex="\frac{1}{2}\textcolor{#B45309}{k} L \textcolor{#4F46E5}{\alpha_i}^2" />{' '}
        (parameterized by <MathTex tex="\textcolor{#B45309}{k} > 0" />: early routine tasks are
        cheap to automate, while the final edge-case workflows are increasingly expensive).
      </p>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-4">
        Now suppose displaced workers recover a fraction{' '}
        <MathTex tex="\textcolor{#059669}{\eta} \in [0, 1]" /> of their lost wage income through
        reemployment or transfers. Because workers spend a fraction <MathTex tex="\lambda" /> of
        their income inside the sector, the net sectoral demand lost per displaced worker is:
      </p>

      <MathTex
        block
        tex="\textcolor{#DC2626}{\ell} = \lambda \left(1 - \textcolor{#059669}{\eta}\right) w"
      />

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-4">
        Adding autonomous outside demand <MathTex tex="A > 0" />, total sectoral demand as a
        function of the industry automation vector{' '}
        <MathTex tex="\textcolor{#4F46E5}{\alpha} = (\textcolor{#4F46E5}{\alpha_1}, \dots, \textcolor{#4F46E5}{\alpha_N})" />{' '}
        is:
      </p>

      <MathTex
        block
        tex="D(\textcolor{#4F46E5}{\alpha}) = A + \lambda w L \left[ \textcolor{#0F766E}{N} - \left(1 - \textcolor{#059669}{\eta}\right)\sum_{j=1}^{\textcolor{#0F766E}{N}} \textcolor{#4F46E5}{\alpha_j} \right]"
      />

      <h3 className="font-serif text-[20px] font-medium text-[#1A1D24] mt-10 mb-4">
        Step-by-Step Calculus Proof: Private vs. Cooperative First-Order Conditions
      </h3>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-4">
        In a symmetric sector, each firm captures an equal share{' '}
        <MathTex tex="\frac{1}{\textcolor{#0F766E}{N}} D(\textcolor{#4F46E5}{\alpha})" /> of
        aggregate demand. Compare a single firm’s private profit{' '}
        <MathTex tex="\pi_i(\textcolor{#4F46E5}{\alpha_i}, \textcolor{#4F46E5}{\alpha_{-i}})" />{' '}
        against the cooperative joint industry profit{' '}
        <MathTex tex="\mathcal{K}(\textcolor{#4F46E5}{\alpha}) = \sum_{i=1}^{\textcolor{#0F766E}{N}} \pi_i" />{' '}
        (normalizing <MathTex tex="L = 1" /> for clean notation):
      </p>

      <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-y border-[#ECEEF2] py-6">
        <div className="space-y-3">
          <div className="text-xs font-semibold text-[#4F46E5]">
            Private Firm Optimization (Nash Equilibrium)
          </div>
          <MathTex
            block
            className="!my-2 !text-left"
            tex="\pi_i = \frac{D(\textcolor{#4F46E5}{\alpha})}{\textcolor{#0F766E}{N}} - w + s\textcolor{#4F46E5}{\alpha_i} - \frac{1}{2}\textcolor{#B45309}{k}\textcolor{#4F46E5}{\alpha_i}^2"
          />
          <p className="text-xs leading-relaxed text-[#555B66]">
            Differentiate with respect to <MathTex tex="\textcolor{#4F46E5}{\alpha_i}" /> holding
            rivals fixed. Note that{' '}
            <MathTex tex="\frac{\partial}{\partial \textcolor{#4F46E5}{\alpha_i}}\!\left(\frac{D}{\textcolor{#0F766E}{N}}\right) = -\frac{\textcolor{#DC2626}{\ell}}{\textcolor{#0F766E}{N}}" />:
          </p>
          <MathTex
            block
            className="!my-2 !text-left"
            tex="\frac{\partial \pi_i}{\partial \textcolor{#4F46E5}{\alpha_i}} = s - \frac{\textcolor{#DC2626}{\ell}}{\textcolor{#0F766E}{N}} - \textcolor{#B45309}{k}\textcolor{#4F46E5}{\alpha_i} = 0"
          />
          <MathTex
            block
            className="!my-2 !text-left"
            tex="\textcolor{#4F46E5}{\alpha^{\text{Nash}}} = \frac{s - \textcolor{#DC2626}{\ell}/\textcolor{#0F766E}{N}}{\textcolor{#B45309}{k}}"
          />
        </div>

        <div className="space-y-3 md:border-l md:border-[#ECEEF2] md:pl-6">
          <div className="text-xs font-semibold text-[#DC2626]">
            Joint Industry Optimization (Cooperative)
          </div>
          <MathTex
            block
            className="!my-2 !text-left"
            tex="\mathcal{K}(\textcolor{#4F46E5}{\alpha}) = D(\textcolor{#4F46E5}{\alpha}) + \textcolor{#0F766E}{N}\!\left(-w + s\textcolor{#4F46E5}{\alpha} - \frac{1}{2}\textcolor{#B45309}{k}\textcolor{#4F46E5}{\alpha}^2\right)"
          />
          <p className="text-xs leading-relaxed text-[#555B66]">
            Differentiate total profit with respect to symmetric{' '}
            <MathTex tex="\textcolor{#4F46E5}{\alpha}" />. Here the entire demand drop{' '}
            <MathTex tex="-\textcolor{#0F766E}{N}\textcolor{#DC2626}{\ell}" /> is internalized:
          </p>
          <MathTex
            block
            className="!my-2 !text-left"
            tex="\frac{d\mathcal{K}}{d\textcolor{#4F46E5}{\alpha}} = \textcolor{#0F766E}{N}\!\left(s - \textcolor{#DC2626}{\ell} - \textcolor{#B45309}{k}\textcolor{#4F46E5}{\alpha}\right) = 0"
          />
          <MathTex
            block
            className="!my-2 !text-left"
            tex="\textcolor{#4F46E5}{\alpha^{\text{Coop}}} = \frac{s - \textcolor{#DC2626}{\ell}}{\textcolor{#B45309}{k}}"
          />
        </div>
      </div>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-4">
        Subtracting the two interior solutions isolates the exact structural gap between what
        competing firms do and what maximizes their collective profit which we may refer to as the{' '}
        <strong className="font-semibold text-[#1A1D24]">Over-Automation Wedge</strong>:
      </p>

      <MathTex
        block
        tex="\Delta \textcolor{#4F46E5}{\alpha} = \textcolor{#4F46E5}{\alpha^{\text{Nash}}} - \textcolor{#4F46E5}{\alpha^{\text{Coop}}} = \frac{\textcolor{#DC2626}{\ell}\!\left(1 - \dfrac{1}{\textcolor{#0F766E}{N}}\right)}{\textcolor{#B45309}{k}}"
      />

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-5">
        Two counterintuitive corollaries fall straight out of this equation:
      </p>

      <ul className="space-y-3 my-5 pl-5 list-disc text-[15.5px] leading-[1.78] text-[#374151] marker:text-[#7C8492]">
        <li>
          <strong className="font-semibold text-[#1A1D24]">
            More Competition Worsens the Trap:
          </strong>{' '}
          A monopolist (<MathTex tex="\textcolor{#0F766E}{N} = 1" />) bears{' '}
          <MathTex tex="100\%" /> of the demand collapse its layoffs cause, so{' '}
          <MathTex tex="1 - 1/\textcolor{#0F766E}{N} = 0" /> and the wedge vanishes identically. As{' '}
          <MathTex tex="\textcolor{#0F766E}{N} \to \infty" />, each firm ignores{' '}
          <MathTex tex="(1 - 1/\textcolor{#0F766E}{N}) \to 100\%" /> of the damage it exports to
          rivals. Layoffs trigger whenever{' '}
          <MathTex tex="\textcolor{#0F766E}{N} > \textcolor{#DC2626}{\ell} / s" /> even if{' '}
          <MathTex tex="s < \textcolor{#DC2626}{\ell}" /> and automation is socially profit-destroying.
        </li>
        <li>
          <strong className="font-semibold text-[#1A1D24]">
            The Frictionless Limit (<MathTex tex="\textcolor{#B45309}{k} \to 0" />):
          </strong>{' '}
          As AI deployment becomes plug-and-play and integration friction approaches zero, the wedge
          blows up until <MathTex tex="\textcolor{#4F46E5}{\alpha^{\text{Nash}}}" /> slams into{' '}
          <MathTex tex="1.0" /> (100% automation). The continuous game collapses into a pure
          Prisoner’s Dilemma—destroying demand and lowering <em>both</em> firm profits and worker
          income (pure deadweight loss, not merely a transfer from labor to capital).
        </li>
      </ul>

      <DiagramFrame
        figureNumber={3}
        title="Marginal Saving vs. Private & Social Marginal Cost"
        subtitle="Adjust N, k, and η — these parameters also flow live into the Policy Lab in Module 6"
        footer={
          <div className="space-y-5">
            {/* Quick Scenario Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium text-[#7C8492] mr-1">Presets:</span>
              {Object.entries(FALK_PRESETS).map(([key, preset]) => {
                const isActive =
                  params.N === preset.params.N &&
                  Math.abs(params.k - preset.params.k) < 0.001 &&
                  Math.abs(params.eta - preset.params.eta) < 0.001 &&
                  Math.abs(params.lambda - preset.params.lambda) < 0.001 &&
                  Math.abs(params.c - preset.params.c) < 0.001;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onChangeParams({ ...preset.params })}
                    className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'border-[#4F46E5] bg-[#F5F6FF] text-[#4F46E5]'
                        : 'border-[#E5E7EB] bg-white text-[#374151] hover:border-[#4F46E5] hover:text-[#4F46E5]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Live Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <EditorialSlider
                id="slider-n"
                symbol="N"
                label="Competing firms"
                value={params.N}
                min={1}
                max={20}
                step={1}
                color={VAR_COLORS.n}
                formatValue={(v) => `${v} ${v === 1 ? 'firm (Monopoly)' : 'firms'}`}
                onChange={(N) => onChangeParams({ ...params, N })}
              />
              <EditorialSlider
                id="slider-k"
                symbol="k"
                label="Integration friction"
                value={params.k}
                min={0.2}
                max={2.0}
                step={0.05}
                color={VAR_COLORS.k}
                formatValue={(v) => v.toFixed(2)}
                onChange={(k) => onChangeParams({ ...params, k })}
              />
              <EditorialSlider
                id="slider-eta"
                symbol="η"
                label="Reabsorption rate"
                value={params.eta}
                min={0}
                max={0.95}
                step={0.05}
                color={VAR_COLORS.eta}
                formatValue={(v) => `${Math.round(v * 100)}%`}
                onChange={(eta) => onChangeParams({ ...params, eta })}
              />
            </div>

            {/* Secondary fine-tuning readout */}
            <div className="pt-3 border-t border-[#E6E8EC] grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-[11px] text-[#7C8492]">Cooperative α*</div>
                <div className="font-mono tabular-nums text-base font-semibold text-[#DC2626]">
                  {(eq.alphaCoop * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#7C8492]">Nash Equilibrium α</div>
                <div className="font-mono tabular-nums text-base font-semibold text-[#4F46E5]">
                  {(eq.alphaNash * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#7C8492]">Over-Automation Wedge Δα</div>
                <div className="font-mono tabular-nums text-base font-semibold text-[#1A1D24]">
                  {(eq.wedgeActual * 100).toFixed(1)} pp
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#7C8492]">Externality Ignored (1 − 1/N)</div>
                <div className="font-mono tabular-nums text-base font-semibold text-[#0F766E]">
                  {(eq.externalityShareIgnored * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        }
      >
        <div className="w-full">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto max-w-[680px] mx-auto block"
            role="img"
            aria-label="Line chart comparing Marginal Saving s against Private Marginal Cost and Social Marginal Cost across automation fraction alpha from 0 to 1, highlighting the shaded Over-Automation Wedge"
          >
            {/* Subtle horizontal gridlines */}
            {yTicks.map((tick) => {
              const y = toY(tick);
              return (
                <g key={tick}>
                  <line
                    x1={padL}
                    y1={y}
                    x2={W - padR}
                    y2={y}
                    stroke="#F1F3F6"
                    strokeWidth="1"
                  />
                  <text
                    x={padL - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-[#7C8492] text-[10.5px]"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    {tick.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* X-axis ticks */}
            {xTicks.map((t) => {
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
            <line
              x1={padL}
              y1={padT + plotH}
              x2={W - padR}
              y2={padT + plotH}
              stroke="#1A1D24"
              strokeWidth="1.2"
            />

            {/* Axis Titles */}
            <text
              x={padL + plotW / 2}
              y={H - 6}
              textAnchor="middle"
              className="fill-[#374151] text-[11.5px] font-medium"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Automation Fraction α (0 = Human Staff, 1 = Full AI)
            </text>
            <text
              x={16}
              y={padT + plotH / 2}
              textAnchor="middle"
              transform={`rotate(-90 16 ${padT + plotH / 2})`}
              className="fill-[#374151] text-[11.5px] font-medium"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Marginal Benefit / Cost
            </text>

            {/* Shaded Over-Automation Wedge */}
            {eq.wedgeActual > 0.002 && (
              <g>
                <rect
                  x={xCoop}
                  y={padT}
                  width={Math.max(0, xNash - xCoop)}
                  height={plotH}
                  fill="#4F46E5"
                  fillOpacity="0.08"
                />
                {xNash - xCoop > 54 && (
                  <text
                    x={(xCoop + xNash) / 2}
                    y={padT + 18}
                    textAnchor="middle"
                    className="fill-[#4F46E5] text-[10.5px] font-semibold"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    Wedge Δα = {eq.wedgeActual.toFixed(2)}
                  </text>
                )}
              </g>
            )}

            {/* Marginal Benefit (Constant Saving s = w - c) */}
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
              y={yS - 8}
              textAnchor="end"
              paintOrder="stroke"
              stroke="#FFFFFF"
              strokeWidth="4"
              className="fill-[#1A1D24] text-[11px] font-medium"
              fontFamily="IBM Plex Mono, monospace"
            >
              Marginal Saving s = {eq.s.toFixed(2)}
            </text>

            {/* Social Marginal Cost Line: ℓ + kα */}
            <line x1={sx0} y1={sy0} x2={sx1} y2={sy1} stroke="#DC2626" strokeWidth="2.1" />

            {/* Private Marginal Cost Line: ℓ/N + kα */}
            <line x1={px0} y1={py0} x2={px1} y2={py1} stroke="#4F46E5" strokeWidth="2.1" />

            {/* Clean Top-Left Inline Legend (never collides with sloped lines) */}
            <g transform={`translate(${padL + 12}, ${padT + 10})`}>
              <rect x="-6" y="-8" width="154" height="38" rx="2" fill="#FFFFFF" fillOpacity="0.92" />
              <line x1="0" y1="2" x2="18" y2="2" stroke="#DC2626" strokeWidth="2.1" />
              <text x="24" y="6" className="fill-[#DC2626] text-[10.5px] font-medium" fontFamily="Plus Jakarta Sans, sans-serif">
                Social MC (ℓ + kα)
              </text>
              <line x1="0" y1="20" x2="18" y2="20" stroke="#4F46E5" strokeWidth="2.1" />
              <text x="24" y="24" className="fill-[#4F46E5] text-[10.5px] font-medium" fontFamily="Plus Jakarta Sans, sans-serif">
                Private MC (ℓ/N + kα)
              </text>
            </g>

            {/* Vertical Drop Lines & Equilibrium Markers */}
            <line
              x1={xCoop}
              y1={yS}
              x2={xCoop}
              y2={padT + plotH}
              stroke="#DC2626"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            <circle cx={xCoop} cy={toY(Math.min(socialMCAt(eq.alphaCoop), yMax))} r="4.5" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2" />
            <text
              x={xCoop}
              y={padT + plotH - 8}
              textAnchor={eq.alphaCoop < 0.14 ? 'start' : 'end'}
              dx={eq.alphaCoop < 0.14 ? 5 : -5}
              paintOrder="stroke"
              stroke="#FFFFFF"
              strokeWidth="4"
              className="fill-[#DC2626] text-[10.5px] font-semibold"
              fontFamily="IBM Plex Mono, monospace"
            >
              α_Coop={eq.alphaCoop.toFixed(2)}
            </text>

            <line
              x1={xNash}
              y1={yS}
              x2={xNash}
              y2={padT + plotH}
              stroke="#4F46E5"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            <circle cx={xNash} cy={toY(Math.min(privateMCAt(eq.alphaNash), yMax))} r="4.5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="1.5" />
            <text
              x={xNash}
              y={padT + plotH - 22}
              textAnchor={eq.alphaNash > 0.82 ? 'end' : 'start'}
              dx={eq.alphaNash > 0.82 ? -5 : 5}
              paintOrder="stroke"
              stroke="#FFFFFF"
              strokeWidth="4"
              className="fill-[#4F46E5] text-[10.5px] font-semibold"
              fontFamily="IBM Plex Mono, monospace"
            >
              α_Nash={eq.alphaNash.toFixed(2)}
            </text>
          </svg>
        </div>

        {/* Clean Trigger Status Note (text-based, zero pill clutter) */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#555B66]">
          <span>
            Demand loss per displaced worker:{' '}
            <strong className="font-mono text-[#DC2626]">ℓ = {eq.ell.toFixed(3)}</strong> · Trigger
            threshold <strong className="font-mono text-[#1A1D24]">ℓ / s = {eq.triggerThresholdN.toFixed(2)}</strong>
          </span>
          <span className="font-mono text-xs text-[#1A1D24]">
            {eq.wedgeActual < 0.001
              ? 'Wedge Closed (Private = Social Optimum)'
              : `Trap Deadweight Profit Loss: −${eq.profitLossFromTrap.toFixed(2)}`}
          </span>
        </div>
      </DiagramFrame>
    </section>
  );
};
