const positions = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0 -scale-x-100",
  "bottom-left": "bottom-0 left-0 -scale-y-100",
  "bottom-right": "bottom-0 right-0 -scale-x-100 -scale-y-100",
} as const;

export function DiamondCorner({
  position = "top-left",
}: {
  position?: keyof typeof positions;
}) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      className={`pointer-events-none absolute z-10 ${positions[position]}`}
      aria-hidden="true"
    >
      <path d="M0 10 V0 H10" fill="none" stroke="#eabe3a" strokeWidth="1" />
      <path d="M0 -3 L3 0 L0 3 L-3 0 Z" fill="#eabe3a" />
    </svg>
  );
}
