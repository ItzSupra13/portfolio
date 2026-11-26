import React from 'react';

interface DiagramFrameProps {
  figureNumber: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Minimalist hairline-bordered editorial figure container matching the reference white-canvas aesthetic.
 */
export const DiagramFrame: React.FC<DiagramFrameProps> = ({
  figureNumber,
  title,
  subtitle,
  children,
  footer,
}) => {
  return (
    <figure className="my-10 -mx-2 sm:-mx-6 md:-mx-12 border border-[#E6E8EC] bg-[#FAFAFC] rounded-sm">
      <div className="px-5 sm:px-7 pt-5 pb-4 border-b border-[#ECEEF2] flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
        <figcaption className="text-sm font-medium text-[#1A1D24]">
          <span className="font-serif italic text-[#7C8492] mr-2">Fig. {figureNumber}.</span>
          {title}
        </figcaption>
        {subtitle && (
          <span className="text-xs text-[#7C8492]">{subtitle}</span>
        )}
      </div>

      <div className="px-4 sm:px-7 py-6 bg-white">{children}</div>

      {footer && (
        <div className="px-5 sm:px-7 py-4 border-t border-[#ECEEF2] bg-[#FAFAFC]">
          {footer}
        </div>
      )}
    </figure>
  );
};

interface EditorialSliderProps {
  id: string;
  symbol: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  formatValue?: (val: number) => string;
  onChange: (val: number) => void;
}

export const EditorialSlider: React.FC<EditorialSliderProps> = ({
  id,
  symbol,
  label,
  value,
  min,
  max,
  step,
  color,
  formatValue,
  onChange,
}) => {
  const display = formatValue ? formatValue(value) : String(value);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-xs text-[#374151] font-medium flex items-baseline gap-1.5">
          <span className="font-serif italic font-semibold text-sm" style={{ color }}>
            {symbol}
          </span>
          <span>{label}</span>
        </label>
        <span className="font-mono tabular-nums text-xs font-medium text-[#1A1D24]">
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="editorial-slider"
        style={{ '--slider-color': color } as React.CSSProperties}
      />
    </div>
  );
};
