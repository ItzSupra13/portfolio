import React, { useMemo } from 'react';
import katex from 'katex';

interface MathTexProps {
  tex: string;
  block?: boolean;
  className?: string;
}

/**
 * Crisp KaTeX equation renderer with consistent color-coded math symbols.
 * Uses KaTeX HTML output (trusted static LaTeX strings authored in code).
 */
export const MathTex: React.FC<MathTexProps> = ({ tex, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: block,
        throwOnError: false,
        strict: false,
        trust: false,
      });
    } catch {
      return tex;
    }
  }, [tex, block]);

  if (block) {
    return (
      <div
        className={`my-5 overflow-x-auto py-1 text-center text-[#1A1D24] ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block align-baseline text-[#1A1D24] ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
