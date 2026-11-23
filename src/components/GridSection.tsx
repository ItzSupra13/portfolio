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
  // Rails and corner crosshairs share this offset so they always meet
  const rail = "max(24px, calc(50% - 450px))";
  // The left rail's border sits 1px inside its box, so the crosshair arm starts there
  const leftCrosshair = "max(23px, calc(50% - 451px))";

  return (
    <div className={`relative -mt-px ${showPattern ? "bg-grid-pattern" : ""} ${className}`}>
      {/* Left Side: Border always there, hash background toggles */}
      <div
        className={`pointer-events-none absolute top-0 bottom-0 left-0 z-50 border-r border-white/10 ${displayClass} ${showHashes ? "hash-zone-l" : ""}`}
        style={{ width: rail }}
      />

      {/* Right Side: Border always there, hash background toggles */}
      <div
        className={`pointer-events-none absolute top-0 right-0 bottom-0 z-50 border-l border-white/10 ${displayClass} ${showHashes ? "hash-zone-r" : ""}`}
        style={{ width: rail }}
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
          <span className={`ch ch-tl ${displayClass}`} style={{ left: leftCrosshair }} />
          <span className={`ch ch-tr ${displayClass}`} style={{ right: rail }} />
          <span className={`ch ch-bl ${displayClass}`} style={{ left: leftCrosshair }} />
          <span className={`ch ch-br ${displayClass}`} style={{ right: rail }} />
        </>
      )}

      {/* Content Container */}
      <div className={`relative z-10 mx-auto max-w-[900px] ${Hero?"":"py-8"} px-6 sm:px-8 lg:px-10`}>{children}</div>
    </div>
  );
}
