import React, { useState, useEffect } from 'react';
import { ProcessingUnit, UNIT_CONFIGS } from '@/types/unit';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  activeUnit: ProcessingUnit;
  onSelectUnit: (unit: ProcessingUnit) => void;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeUnit,
  onSelectUnit,
  onNavigate,
}) => {
  const units: ProcessingUnit[] = ['gpu'];
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileNav = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors duration-300">
      {/* Blog Reading Progress Indicator (Thin emerald line along top) */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-border/40">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-14">
          {/* Left Side: Making MatMul with hardware buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3.5 min-w-0">
            <div className="hidden sm:flex items-baseline shrink-0">
              <span className="font-mono text-xs sm:text-sm font-bold tracking-tight text-foreground whitespace-nowrap">
                <span className="hidden md:inline">Making MatMul go BRRR on</span>
                <span className="md:hidden">MatMul on</span>
              </span>
            </div>

            {/* Target Hardware Selector (Responsive & touch-friendly on mobile) */}
            <div className="flex items-center p-0.5 sm:p-0.5 rounded-lg bg-card/90 border border-border shadow-xs shrink-0">
              {units.map((unit) => {
                const config = UNIT_CONFIGS[unit];
                const isActive = activeUnit === unit;

                return (
                  <button
                    key={unit}
                    onClick={() => {
                      onSelectUnit(unit);
                      setMobileMenuOpen(false);
                    }}
                    className={`relative px-1.5 sm:px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-mono font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1 sm:gap-1.5 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <span>{config.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Right Side: Editorial Navigation Links */}
          <nav className="hidden md:flex items-center gap-2.5 sm:gap-4 md:gap-5 text-xs font-mono font-medium text-muted-foreground ml-auto">
            <button
              onClick={() => onNavigate('overview')}
              className="hover:text-foreground transition-colors cursor-pointer hidden sm:inline"
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('gemm-intro')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Math
            </button>
            <button
              onClick={() => onNavigate('architecture')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Architecture
            </button>
            {activeUnit === 'future' ? (
              <button
                onClick={() => onNavigate('future-monograph')}
                className="hover:text-foreground transition-colors cursor-pointer text-primary font-semibold"
              >
                In-Memory
              </button>
            ) : (
              <button
                onClick={() => onNavigate('kernels')}
                className="hover:text-foreground transition-colors cursor-pointer"
              >
                Kernels
              </button>
            )}
            <button
              onClick={() => onNavigate('unit-benchmarks')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Benchmarks
            </button>
          </nav>

          {/* Mobile Right Side: Navigation Menu Toggle Button */}
          <div className="flex items-center ml-auto md:hidden">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer flex items-center justify-center border border-border/60 bg-card/60"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-foreground" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/80 bg-background/95 backdrop-blur-md px-3 sm:px-4 py-2.5 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1 text-xs font-mono">
            <button
              onClick={() => handleMobileNav('overview')}
              className="w-full text-left py-2 px-3 rounded-md hover:bg-muted/60 text-foreground transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>1. Overview</span>
              <span className="text-muted-foreground text-[10px]">#overview</span>
            </button>
            <button
              onClick={() => handleMobileNav('gemm-intro')}
              className="w-full text-left py-2 px-3 rounded-md hover:bg-muted/60 text-foreground transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>2. Math (GEMM &amp; SGEMM)</span>
              <span className="text-muted-foreground text-[10px]">#gemm-intro</span>
            </button>
            <button
              onClick={() => handleMobileNav('architecture')}
              className="w-full text-left py-2 px-3 rounded-md hover:bg-muted/60 text-foreground transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>3. Hardware Architecture</span>
              <span className="text-muted-foreground text-[10px]">#architecture</span>
            </button>
            {activeUnit === 'future' ? (
              <button
                onClick={() => handleMobileNav('future-monograph')}
                className="w-full text-left py-2 px-3 rounded-md hover:bg-muted/60 text-primary font-semibold transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>4. In-Memory Monograph</span>
                <span className="text-primary/70 text-[10px]">#future</span>
              </button>
            ) : (
              <button
                onClick={() => handleMobileNav('kernels')}
                className="w-full text-left py-2 px-3 rounded-md hover:bg-muted/60 text-foreground transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>4. Progressive {activeUnit.toUpperCase()} Kernels</span>
                <span className="text-muted-foreground text-[10px]">#kernels</span>
              </button>
            )}
            <button
              onClick={() => handleMobileNav('unit-benchmarks')}
              className="w-full text-left py-2 px-3 rounded-md hover:bg-muted/60 text-foreground transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>5. Empirical Benchmarks</span>
              <span className="text-muted-foreground text-[10px]">#benchmarks</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
