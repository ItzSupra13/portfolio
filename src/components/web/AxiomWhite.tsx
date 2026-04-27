type AxiomMarkProps = {
  width?: number | string;
  height?: number | string;
};

export default function AxiomMark({ width = 80, height = 80 }: AxiomMarkProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 44 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* White structure */}
      <path
        d="M18.0737 8H31.5892
           M18.0737 8L2 18.5195
           M31.5892 8L42 24.9481
           M31.5892 8L28.6742 28.8636
           M42 24.9481L27.6034 39.5
           M42 24.9481L28.6742 28.8636
           M27.6034 39.5L6.6289 35.7597
           M27.6034 39.5L28.6742 28.8636
           M27.6034 39.5L17.5382 33.6558
           M6.6289 35.7597L2 18.5195
           M6.6289 35.7597L9.5 27
           M2 18.5195L9.5 27
           M28.6742 28.8636L17.5382 33.6558
           M9.5 27L17.5382 33.6558"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Highlighted green lines */}
      <path
        d="M18.0737 8L28.6742 28.8636"
        stroke="#2dd4bf"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M18.0737 8L9.5 27" stroke="#2dd4bf" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
