import React from "react";

interface GridSectionProps {
  children: React.ReactNode;
  showHashes?: boolean;
  showOuterDots?: boolean;
  showCrosshairs?: boolean;
  showPattern?: boolean;
  Hero?: boolean;
  topBorder?: boolean;
  bottomBorder?: boolean;
  hideOnMobile?: boolean;
  className?: string;
}

export function GridSection({
  children,
  showHashes = false,
  showOuterDots = false,
  showCrosshairs = false,
  showPattern = false,
  topBorder = true,
  Hero = false,
  bottomBorder = true,
  hideOnMobile = false,
  className = "",
}: GridSectionProps) {
  const displayClass = hideOnMobile ? "hidden md:block" : "";

  return (
    <div className={`relative -mt-px ${showPattern ? "bg-grid-pattern" : ""} ${className}`}>
      {/* Left Side: Border always there, hash background toggles */}
      <div
        className={`pointer-events-none absolute top-0 bottom-0 left-0 z-50 border-r border-white/10 ${displayClass} ${showHashes ? "hash-zone-l" : ""}`}
        style={{ width: "max(24px, calc(50% - 512px))" }}
      />

      {/* Right Side: Border always there, hash background toggles */}
      <div
        className={`pointer-events-none absolute top-0 right-0 bottom-0 z-50 border-l border-white/10 ${displayClass} ${showHashes ? "hash-zone-r" : ""}`}
        style={{ width: "max(24px, calc(50% - 512px))" }}
      />
      {/* Dots */}
      {showOuterDots && (
        <>
          <div className={`dot-zone-l ${displayClass}`} />
          <div className={`dot-zone-r ${displayClass}`} />
        </>
      )}

      {/* Horizontal Rules (Usually you want to keep these on mobile to separate sections!) */}
      {topBorder && <div className={`h-rule ${displayClass}`} style={{ top: 0 }} />}
      {bottomBorder && <div className={`h-rule ${displayClass}`} style={{ bottom: 0 }} />}

      {/* Crosshairs */}
      {showCrosshairs && (
        <>
          <span className={`ch ch-tl ${displayClass}`} />
          <span className={`ch ch-tr ${displayClass}`} />
          <span className={`ch ch-bl ${displayClass}`} />
          <span className={`ch ch-br ${displayClass}`} />
        </>
      )}

      {/* Content Container */}
      <div className={`relative z-10 mx-auto max-w-5xl ${Hero?"":"py-8"} px-6 sm:px-8 lg:px-10`}>{children}</div>
    </div>
  );
}
