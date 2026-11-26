import React from 'react';
import { MathTex } from './MathTex';

export const Module7Synthesis: React.FC = () => {
  return (
    <section id="module-7" className="scroll-mt-24 border-t border-[#ECEEF2] pt-14 mt-16">
      <h2 className="font-serif text-[26px] sm:text-[29px] font-medium tracking-[-0.015em] text-[#1A1D24] mb-6">
        7. Practical Synthesis &amp; First-Principles Takeaways
      </h2>

      <p className="text-[16px] leading-[1.82] text-[#374151] mb-8">
        Zooming back out from the algebra, every equation we derived answers the two plain-language
        questions that sparked this investigation.
      </p>

      <div className="space-y-8">
        <div>
          <h3 className="font-serif text-[20px] font-medium text-[#1A1D24] mb-3">
            Why do companies use the name of AI to fire people and pour money back into AI?
          </h3>
          <p className="text-[16px] leading-[1.82] text-[#374151] mb-4">
            Because inside an <MathTex tex="\textcolor{#0F766E}{N}" />-firm competitive game,
            automating first is a <strong className="font-semibold text-[#1A1D24]">strictly dominant strategy</strong>.
            A firm keeps 100% of its immediate payroll savings (<MathTex tex="s = w - c" />) and
            captures market-share upside (<MathTex tex="+\beta" />) while exporting{' '}
            <MathTex tex="(1 - 1/\textcolor{#0F766E}{N})" /> of the lost consumer spending onto its
            competitors. Pouring capital into AI compute and framing restructurings around AI
            readiness is how boards and CEOs defend their own margins under fiduciary duty. Even
            when real AI deployment lags behind press releases (“AI-washing”), the strategic
            incentive to look lean and compute-heavy remains relentless.
          </p>
        </div>

        <div>
          <h3 className="font-serif text-[20px] font-medium text-[#1A1D24] mb-3">
            Where do the customers come from if everyone gets fired?
          </h3>
          <p className="text-[16px] leading-[1.82] text-[#374151]">
            In the baseline trap, <strong className="font-semibold text-[#1A1D24]">they don’t</strong>. That
            is the exact meaning of a Pareto-dominated Nash Equilibrium. Unless displaced workers
            rapidly find comparable income elsewhere (keeping{' '}
            <MathTex tex="\textcolor{#059669}{\eta}" /> near 1) or outside demand{' '}
            <MathTex tex="A" /> expands independently, collective automation cannibalizes the very
            pool of consumer spending <MathTex tex="D(\textcolor{#4F46E5}{\alpha})" /> that funds
            corporate revenue. Worse, as Module 5 showed, AI simultaneously degrades resume
            signaling and compresses observable workplace performance making external hiring freeze
            up right when fast reabsorption is needed most.
          </p>
        </div>
      </div>

      {/* Assumptions & Caveats Box — clean hairline border, zero thick left accent stripe */}
      <div className="mt-12 p-6 sm:p-7 border border-[#E6E8EC] bg-[#FAFAFC] rounded-sm">
        <h3 className="font-serif text-[18px] font-medium text-[#1A1D24] mb-3">
          Assumptions &amp; Modeling Caveats
        </h3>
        <p className="text-[14.5px] leading-[1.78] text-[#555B66] mb-3">
          Good mathematical economics states clearly where its boundaries lie. The models explored
          here are intentionally stylized theoretical equilibria designed to isolate strategic
          externalities:
        </p>
        <ul className="space-y-2 pl-5 list-disc text-[14.5px] leading-[1.75] text-[#555B66] marker:text-[#9CA3AF]">
          <li>
            <strong className="font-medium text-[#1A1D24]">Single-sector symmetry:</strong>{' '}
            Baseline equations assume <MathTex tex="\textcolor{#0F766E}{N}" /> symmetric firms
            sharing a common demand pool and fixed baseline wage <MathTex tex="w" />. Real economies
            feature heterogeneous sectors, flexible prices, and cross-border trade (higher{' '}
            <MathTex tex="A" />).
          </li>
          <li>
            <strong className="font-medium text-[#1A1D24]">New task creation &amp; price deflation:</strong>{' '}
            If AI dramatically lowers consumer prices or unlocks entirely new product categories
            faster than it displaces existing wages, effective reabsorption{' '}
            <MathTex tex="\textcolor{#059669}{\eta}" /> rises and real purchasing power can grow
            even as legacy roles shrink.
          </li>
          <li>
            <strong className="font-medium text-[#1A1D24]">Empirical pacing:</strong>{' '}
            2025–2026 empirical evidence suggests economy-wide AI displacement is still uneven and
            heavily mixed with conventional cost-cutting. The value of these proofs is showing{' '}
            <em>when</em> competitive incentives can overshoot social optimality, definitely not claiming
            inevitable collapse (or atleast that's the hope).
          </li>
        </ul>
      </div>
    </section>
  );
};
