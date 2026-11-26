import React, { useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';

interface ReferencesDrawerProps {
  open: boolean;
  onClose: () => void;
}

const PRIMARY_PAPERS = [
  {
    id: 'falk-2026',
    authors: 'Brett Hemenway Falk & Gerry Tsoukalas (2026)',
    title: 'The AI Layoff Trap',
    venue: 'arXiv:2603.20617',
    url: 'https://arxiv.org/abs/2603.20617',
    summary:
      'Formalizes the N-firm continuous automation game, deriving the Over-Automation Wedge Δα = ℓ(1 − 1/N)/k, the Red Queen market-share amplification effect, and comparative statics across UBI, profit taxes, upskilling, and Pigouvian automation taxes.',
  },
  {
    id: 'pal-2026',
    authors: 'Pal & Park (2026)',
    title: 'Generative AI and the Collapse of Labor Market Signaling',
    venue: 'arXiv:2610.35802',
    url: 'https://arxiv.org/abs/2610.35802',
    summary:
      'Models the Bayesian hiring game between High/Medium potential applicants and recruiters with noisy tests, proving how cheap AI resumes trigger Equilibrium E₁ (hiring freeze collapse) and how super-output (y = 2) halves the collapse threshold.',
  },
  {
    id: 'qiu-2026',
    authors: 'Qiu, Yu & Xu (2026)',
    title: 'Effort Allocation and Phase Transitions in AI-Assisted Workplace Contests',
    venue: 'arXiv:2604.22230v2',
    url: 'https://arxiv.org/abs/2604.22230',
    summary:
      'Analyzes N-player internal contests where workers split effort between creative and AI-assisted mechanistic production, establishing the phase transition from strict separation (below γ̲) to complete pooling (above γ̄).',
  },
];

const CONTEXT_SOURCES = [
  {
    label: 'alphaXiv Breakdown: The AI Layoff Trap (Baseline Parameter Walkthrough)',
    url: 'https://www.alphaxiv.org/abs/2603.20617',
  },
  {
    label: 'Harvard Business School Working Knowledge: AI Hasn’t Spurred Widespread Layoffs Yet. Why Not?',
    url: 'https://www.library.hbs.edu/working-knowledge/ai-hasnt-spurred-widespread-layoffs-yet-why-not',
  },
  {
    label: 'RankID (2026 Data): AI Washing: Are Companies Really Laying People Off Because of AI?',
    url: 'https://rankid.dev/blog/ai-washing-layoffs',
  },
  {
    label: 'Nicky Case: The Evolution of Trust (Interactive Game Theory Pedagogy)',
    url: 'https://ncase.me/trust/',
  },
];

export const ReferencesDrawer: React.FC<ReferencesDrawerProps> = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/25 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="references-drawer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white h-full overflow-y-auto border-l border-[#E6E8EC] px-6 sm:px-8 py-7 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#ECEEF2]">
          <div>
            <h2
              id="references-drawer-title"
              className="font-serif text-[22px] font-medium text-[#1A1D24]"
            >
              References &amp; Primary Papers
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close references drawer"
            className="p-2 text-[#555B66] hover:text-[#1A1D24] rounded-sm hover:bg-[#F3F4F6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-[#7C8492] mb-4">
              Core Game-Theory Papers (2026)
            </h3>
            <ol className="space-y-5">
              {PRIMARY_PAPERS.map((paper, index) => (
                <li
                  key={paper.id}
                  className="pb-5 border-b border-[#F1F3F6] last:border-b-0 last:pb-0"
                >
                  <div className="text-xs text-[#7C8492] mb-1">
                    [{index + 1}] {paper.authors} ·{' '}
                    <span className="font-mono text-[#4F46E5]">{paper.venue}</span>
                  </div>
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-baseline gap-1.5 font-serif text-[16px] font-medium text-[#1A1D24] hover:text-[#4F46E5] transition-colors"
                  >
                    <span>{paper.title}</span>
                    <ExternalLink
                      className="w-3.5 h-3.5 shrink-0 text-[#9CA3AF] group-hover:text-[#4F46E5]"
                      aria-hidden="true"
                    />
                  </a>
                  <p className="text-xs leading-relaxed text-[#555B66] mt-1.5">{paper.summary}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="pt-4 border-t border-[#ECEEF2]">
            <h3 className="text-xs font-semibold text-[#7C8492] mb-3">
              Some other sources I cited from
            </h3>
            <ul className="space-y-2.5">
              {CONTEXT_SOURCES.map((src) => (
                <li key={src.url}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-start gap-1.5 text-xs leading-relaxed text-[#374151] hover:text-[#4F46E5] transition-colors"
                  >
                    <ExternalLink
                      className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#9CA3AF] group-hover:text-[#4F46E5]"
                      aria-hidden="true"
                    />
                    <span>{src.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
