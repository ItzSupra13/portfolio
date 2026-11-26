import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { DiagramFrame, EditorialSlider } from './DiagramFrame';
import { MathTex } from './MathTex';
import {
  CONTEST_THRESHOLDS,
  evaluateEffortContest,
  evaluateSignalingGame,
} from '@/lib/gt/economics';
import { VAR_COLORS } from '@/lib/gt/variables';

interface Module5Props {
  currentEta: number;
  onApplyEtaToModel: (eta: number) => void;
}

export const Module5HiringGames: React.FC<Module5Props> = ({
  currentEta,
  onApplyEtaToModel,
}) => {
  // Part A: Pal & Park Bayesian Signaling state
  const [resumeOutputY, setResumeOutputY] = useState<1 | 2>(1);
  const [recruiterValueA, setRecruiterValueA] = useState<number>(0.65);
  const signaling = evaluateSignalingGame({
    A: recruiterValueA,
    B: 1.0,
    r: 1.0,
    resumeOutputY,
  });

  // Part B: Qiu, Yu & Xu Effort Contest state
  const [gamma, setGamma] = useState<number>(0.55);
  const contest = evaluateEffortContest(gamma);

  // Horizontal phase-transition SVG coordinates
  const W = 680;
  const H = 205;
  const padL = 48;
  const padR = 48;
  const barY = 74;
  const barW = W - padL - padR;

  const toX = (g: number) => padL + g * barW;
  const xLow = toX(CONTEST_THRESHOLDS.gammaLow);
  const xHigh = toX(CONTEST_THRESHOLDS.gammaHigh);
  const xCur = toX(contest.gamma);

  return (
    <section id="module-5" className="scroll-mt-24 border-t border-[#ECEEF2] pt-14 mt-16">
      <h2 className="font-serif text-[26px] sm:text-[29px] font-medium tracking-[-0.015em] text-[#1A1D24] mb-5">
        5. Why Displaced Workers Don’t Bounce Back: The Hiring &amp; Effort Games
      </h2>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-6">
        Look back at the Over-Automation Wedge from Module 3:{' '}
        <MathTex tex="\Delta \textcolor{#4F46E5}{\alpha} = \frac{\lambda(1 - \textcolor{#059669}{\eta})w(1 - 1/\textcolor{#0F766E}{N})}{\textcolor{#B45309}{k}}" />.
        Notice the critical hinge parameter <MathTex tex="\textcolor{#059669}{\eta}" />: the fraction
        of lost wages displaced workers quickly recover in new roles. Historically, technological
        transitions avoided deep demand traps because laid-off workers were reabsorbed into growing
        firms (<MathTex tex="\textcolor{#059669}{\eta} \approx 1" />). Why is the AI wave coinciding
        with stubborn hiring freezes that pin <MathTex tex="\textcolor{#059669}{\eta}" /> dangerously
        low? Two companion 2026 game-theory papers expose the exact micro-mechanisms.
      </p>

      {/* Part A: Pal & Park */}
      <h3 className="font-serif text-[20px] font-medium text-[#1A1D24] mt-9 mb-4">
        Part A — The Signaling Collapse (Pal &amp; Park, arXiv:2610.35802)
      </h3>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-4">
        Consider a Bayesian hiring game between candidates of High (<MathTex tex="H" />) and Medium (
        <MathTex tex="M" />) underlying potential and a recruiter. Each candidate chooses between
        investing in genuine <code className="font-mono text-[14px] text-[#1A1D24]">deep</code>{' '}
        mastery (<MathTex tex="u = 1" />, incurring private effort cost{' '}
        <MathTex tex="\delta_\theta" />) or taking the{' '}
        <code className="font-mono text-[14px] text-[#1A1D24]">shallow + AI</code> shortcut (
        <MathTex tex="u = 0" />, cost <MathTex tex="0" />). The recruiter cannot observe{' '}
        <MathTex tex="u" /> directly but only the polished application output <MathTex tex="y" /> and a
        noisy screening test <MathTex tex="t \in \{Pass, Fail\}" /> and earns payoff{' '}
        <MathTex tex="Ay + Bu" /> from hiring versus a reservation payoff <MathTex tex="r" /> from
        leaving the seat unfilled.
      </p>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-5">
        When generative AI lets shallow applicants effortlessly match polished portfolios, resumes
        lose their diagnostic signal. If <MathTex tex="A y < r" />, recruiters cannot profitably
        hire from a pooled stack of unverified applicants triggering{' '}
        <strong className="font-semibold text-[#1A1D24]">Equilibrium <MathTex tex="E_1" /></strong>:
        everyone chooses shallow preparation, recruiters cannot tell talent apart, and{' '}
        <strong className="font-semibold text-[#1A1D24]">nobody gets hired</strong>. Even worse,
        when AI generates “super-output” (<MathTex tex="y = 2" />), the collapse threshold halves
        from <MathTex tex="A = r" /> to <MathTex tex="A = r / 2" />: recruiters become willing to
        accept shallow volume at half the baseline value, destroying the incentive for High types to
        invest in deep mastery at all.
      </p>

      {/* Compact Interactive Signaling Threshold Switcher */}
      <div className="my-6 border border-[#E6E8EC] bg-[#FAFAFC] rounded-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#ECEEF2]">
          <div>
            <div className="text-xs font-semibold text-[#1A1D24]">
              Bayesian Signaling Threshold Check (r = 1.0, B = 1.0)
            </div>
            <div className="text-xs text-[#7C8492]">
              Toggle AI resume volume y and recruiter value A to test Equilibrium E₁
            </div>
          </div>
          <div className="inline-flex border border-[#D1D5DB] rounded-sm bg-white p-0.5 self-start">
            <button
              type="button"
              onClick={() => setResumeOutputY(1)}
              aria-pressed={resumeOutputY === 1}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                resumeOutputY === 1
                  ? 'bg-[#1A1D24] text-white'
                  : 'text-[#555B66] hover:text-[#1A1D24]'
              }`}
            >
              Standard Output (y = 1)
            </button>
            <button
              type="button"
              onClick={() => setResumeOutputY(2)}
              aria-pressed={resumeOutputY === 2}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                resumeOutputY === 2
                  ? 'bg-[#7C3AED] text-white'
                  : 'text-[#555B66] hover:text-[#1A1D24]'
              }`}
            >
              Super-Output AI (y = 2)
            </button>
          </div>
        </div>

        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
          <EditorialSlider
            id="slider-sig-a"
            symbol="A"
            label="Value per unit visible output"
            value={recruiterValueA}
            min={0.2}
            max={1.2}
            step={0.05}
            color={VAR_COLORS.gamma}
            formatValue={(v) => v.toFixed(2)}
            onChange={setRecruiterValueA}
          />
          <div className="text-xs space-y-1.5 sm:border-l sm:border-[#E6E8EC] sm:pl-5">
            <div className="flex justify-between">
              <span className="text-[#555B66]">Collapse threshold (r / y):</span>
              <span className="font-mono tabular-nums font-semibold text-[#1A1D24]">
                A = {signaling.collapseThresholdA.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#555B66]">Shallow expected payoff (A · y):</span>
              <span className="font-mono tabular-nums font-semibold text-[#1A1D24]">
                {signaling.shallowPayoff.toFixed(2)} vs r = 1.00
              </span>
            </div>
            <div
              className={`pt-1 font-semibold ${
                signaling.isE1Collapse ? 'text-[#DC2626]' : 'text-[#059669]'
              }`}
            >
              {signaling.regimeLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Part B: Qiu, Yu & Xu */}
      <h3 className="font-serif text-[20px] font-medium text-[#1A1D24] mt-10 mb-4">
        Part B — The Internal Effort Contest (Qiu, Yu &amp; Xu, arXiv:2604.22230v2)
      </h3>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-4">
        What happens <em>inside</em> firms once workers are already hired? Qiu, Yu, and Xu model an{' '}
        <MathTex tex="\textcolor{#0F766E}{N}" />-player workplace contest where each worker of private
        ability <MathTex tex="\theta_i" /> splits effort between original{' '}
        <strong className="font-semibold text-[#1A1D24]">creative effort</strong>{' '}
        <MathTex tex="a_i" /> and AI-assisted{' '}
        <strong className="font-semibold text-[#1A1D24]">mechanistic effort</strong>{' '}
        <MathTex tex="b_i" />, producing observable output:
      </p>

      <MathTex
        block
        tex="\mu_i = \nu(a_i, \theta_i) + \xi(b_i, \textcolor{#7C3AED}{\gamma})"
      />

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-6">
        As AI capability <MathTex tex="\textcolor{#7C3AED}{\gamma}" /> increases, the contest goes
        through a sharp phase transition. Below <MathTex tex="\underline{\gamma}" />, strict
        separation holds and high-ability workers lean into creative work and stand out cleanly. Above{' '}
        <MathTex tex="\overline{\gamma}" />, rational workers across all ability tiers substitute
        into AI-assisted mechanistic production, triggering{' '}
        <strong className="font-semibold text-[#1A1D24]">complete pooling</strong>. Observable
        output gaps flatten to literally zero making mid-tier roles look indistinguishable from the AI tool
        itself, depressing external hiring, and pushing reabsorption{' '}
        <MathTex tex="\textcolor{#059669}{\eta}" /> downward in Module 3.
      </p>

      <DiagramFrame
        figureNumber={5}
        title="Contest Phase-Transition Line & Feedback into Reabsorption η"
        subtitle="Drag AI capability γ across the two critical thresholds γ̲ and γ̄"
        footer={
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-end">
              <EditorialSlider
                id="slider-gamma"
                symbol="γ"
                label="Workplace AI capability"
                value={gamma}
                min={0.05}
                max={0.98}
                step={0.01}
                color={VAR_COLORS.gamma}
                formatValue={(v) => v.toFixed(2)}
                onChange={setGamma}
              />
              <button
                type="button"
                onClick={() => onApplyEtaToModel(contest.inducedEta)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-sm border border-[#4F46E5] text-[#4F46E5] bg-white hover:bg-[#4F46E5] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Apply η = {contest.inducedEta.toFixed(2)} to Modules 3 &amp; 6
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="pt-3 border-t border-[#E6E8EC] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="text-[11px] text-[#7C8492]">Current Regime</div>
                <div
                  className={`font-semibold ${
                    contest.regime === 'pooling'
                      ? 'text-[#DC2626]'
                      : contest.regime === 'partial'
                      ? 'text-[#B45309]'
                      : 'text-[#059669]'
                  }`}
                >
                  {contest.regime === 'separation'
                    ? 'Strict Separation'
                    : contest.regime === 'partial'
                    ? 'Partial Compression'
                    : 'Complete Pooling'}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#7C8492]">Observable Gap (μ_H − μ_M)</div>
                <div className="font-mono tabular-nums font-semibold text-[#1A1D24]">
                  {contest.separationGap.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#7C8492]">Induced Reabsorption η(γ)</div>
                <div className="font-mono tabular-nums font-semibold text-[#059669]">
                  {Math.round(contest.inducedEta * 100)}%
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#7C8492]">Active Module 3/6 η</div>
                <div className="font-mono tabular-nums font-semibold text-[#555B66]">
                  {Math.round(currentEta * 100)}%
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
            aria-label="Horizontal phase transition line showing strict separation below gamma low, partial compression between thresholds, and complete pooling above gamma high"
          >
            {/* Three Regime Segments */}
            <rect
              x={padL}
              y={barY - 10}
              width={xLow - padL}
              height={20}
              fill="#ECFDF5"
              stroke="#059669"
              strokeWidth="1"
            />
            <rect
              x={xLow}
              y={barY - 10}
              width={xHigh - xLow}
              height={20}
              fill="#FFFBEB"
              stroke="#B45309"
              strokeWidth="1"
            />
            <rect
              x={xHigh}
              y={barY - 10}
              width={padL + barW - xHigh}
              height={20}
              fill="#FEF2F2"
              stroke="#DC2626"
              strokeWidth="1"
            />

            {/* Regime Labels Above Bar */}
            <text
              x={(padL + xLow) / 2}
              y={barY - 24}
              textAnchor="middle"
              className="fill-[#059669] text-[11px] font-semibold"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Strict Separation
            </text>
            <text
              x={(xLow + xHigh) / 2}
              y={barY - 24}
              textAnchor="middle"
              className="fill-[#B45309] text-[11px] font-semibold"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Substitution Zone
            </text>
            <text
              x={(xHigh + padL + barW) / 2}
              y={barY - 24}
              textAnchor="middle"
              className="fill-[#DC2626] text-[11px] font-semibold"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Complete Pooling
            </text>

            {/* Threshold Vertical Ticks */}
            <line x1={xLow} y1={barY - 16} x2={xLow} y2={barY + 26} stroke="#1A1D24" strokeWidth="1.4" strokeDasharray="3 2" />
            <text x={xLow} y={barY + 40} textAnchor="middle" className="fill-[#1A1D24] text-[11px] font-semibold" fontFamily="IBM Plex Mono, monospace">
              γ̲ = {CONTEST_THRESHOLDS.gammaLow}
            </text>

            <line x1={xHigh} y1={barY - 16} x2={xHigh} y2={barY + 26} stroke="#1A1D24" strokeWidth="1.4" strokeDasharray="3 2" />
            <text x={xHigh} y={barY + 40} textAnchor="middle" className="fill-[#1A1D24] text-[11px] font-semibold" fontFamily="IBM Plex Mono, monospace">
              γ̄ = {CONTEST_THRESHOLDS.gammaHigh}
            </text>

            {/* Current Gamma Pointer */}
            <line x1={xCur} y1={24} x2={xCur} y2={barY + 14} stroke="#7C3AED" strokeWidth="2" />
            <circle cx={xCur} cy={barY} r="6" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
            <text
              x={xCur}
              y={18}
              textAnchor="middle"
              className="fill-[#7C3AED] text-[11.5px] font-semibold"
              fontFamily="IBM Plex Mono, monospace"
            >
              γ = {contest.gamma.toFixed(2)}
            </text>

            {/* Mini Effort Split Comparison Bars Below */}
            <g transform="translate(48, 134)">
              <text x="0" y="12" className="fill-[#1A1D24] text-[11px] font-medium" fontFamily="Plus Jakarta Sans, sans-serif">
                High-Ability Worker (θ_H):
              </text>
              <rect x="168" y="2" width={contest.creativeEffortHigh * 220} height="13" fill="#0F766E" />
              <rect
                x={168 + contest.creativeEffortHigh * 220}
                y="2"
                width={contest.mechanisticEffortHigh * 220}
                height="13"
                fill="#7C3AED"
                fillOpacity="0.35"
              />
              <text x="398" y="12" className="fill-[#555B66] text-[10.5px]" fontFamily="IBM Plex Mono, monospace">
                a={Math.round(contest.creativeEffortHigh * 100)}% · b={Math.round(contest.mechanisticEffortHigh * 100)}% → μ={contest.outputHigh.toFixed(2)}
              </text>

              <text x="0" y="38" className="fill-[#1A1D24] text-[11px] font-medium" fontFamily="Plus Jakarta Sans, sans-serif">
                Mid-Ability Worker (θ_M):
              </text>
              <rect x="168" y="28" width={contest.creativeEffortMid * 220} height="13" fill="#0F766E" />
              <rect
                x={168 + contest.creativeEffortMid * 220}
                y="28"
                width={contest.mechanisticEffortMid * 220}
                height="13"
                fill="#7C3AED"
                fillOpacity="0.35"
              />
              <text x="398" y="38" className="fill-[#555B66] text-[10.5px]" fontFamily="IBM Plex Mono, monospace">
                a={Math.round(contest.creativeEffortMid * 100)}% · b={Math.round(contest.mechanisticEffortMid * 100)}% → μ={contest.outputMid.toFixed(2)}
              </text>

              {/* Inline color legend */}
              <rect x="168" y="52" width="10" height="8" fill="#0F766E" />
              <text x="183" y="59" className="fill-[#555B66] text-[10px]" fontFamily="Plus Jakarta Sans, sans-serif">
                Creative effort (a)
              </text>
              <rect x="292" y="52" width="10" height="8" fill="#7C3AED" fillOpacity="0.35" />
              <text x="307" y="59" className="fill-[#555B66] text-[10px]" fontFamily="Plus Jakarta Sans, sans-serif">
                AI-assisted mechanistic effort (b)
              </text>
            </g>
          </svg>
        </div>
      </DiagramFrame>
    </section>
  );
};
