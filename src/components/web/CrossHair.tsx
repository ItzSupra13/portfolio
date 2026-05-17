export default function Crosshair({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={`pointer-events-none absolute z-0 ${className}`}
      style={{ width: 14, height: 14, transform: "translate(-50%, -50%)", ...style }}
    >
      <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-white/25" />
      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-white/25" />
    </span>
  );
}