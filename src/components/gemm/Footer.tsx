import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const references = [
  {
    label: 'Yen-Chen Lin: GPU Matrix Multiplication Optimization',
    href: 'https://yencal.github.io/gpu-gemm-optimization/',
  },
  {
    label: 'Abhik Ray: CUDA Matrix Multiplication Optimization',
    href: 'https://www.abhik.ai/articles/cuda-matrix-multiplication-optimization',
  },
  {
    label: 'NVIDIA CUTLASS',
    href: 'https://github.com/NVIDIA/cutlass',
  },
  {
    label: 'Goto & van de Geijn: Anatomy of High-Performance Matrix Multiplication',
    href: 'https://www.cs.utexas.edu/users/flame/pubs/GotoTOMS_revision.pdf',
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-border bg-card text-sm text-muted-foreground transition-colors duration-300">
      <div className="blog-content-bar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-border">
          {/* About */}
          <div className="space-y-3">
            <div className="text-foreground font-semibold">
              Written by Supratim Chakraborty
            </div>
            <p className="leading-relaxed max-w-sm">
              These notes follow my
              attempts to make matrix multiplication (GEMM) faster, in an attempt to understand the internals of a GPU and how CUDA pairs with it.
            </p>
            <div className="flex items-center gap-4 pt-1">
              <a
                href="https://github.com/ItzSupra13/sgemm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/supratim-13"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:schakraborty.lmb20@gmail.com"
                aria-label="Email"
                className="hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* References */}
          <div className="space-y-3">
            <div className="text-foreground font-semibold">References</div>
            <ul className="space-y-1.5">
              {references.map((ref) => (
                <li key={ref.href}>
                  <a
                    href={ref.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {ref.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 text-xs">
          © 2026 Supratim Chakraborty
        </div>
      </div>
    </footer>
  );
};