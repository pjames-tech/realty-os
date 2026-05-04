/**
 * RealtyOS brand logo — inline SVG so it works everywhere without an image request.
 * Orange rounded-square with white geometric "R" cutout.
 */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" fill="var(--primary, #ff7300)" />
      <path
        d="M8 7h8a7 7 0 0 1 0 14h-1l7 4H8V7zm4 4v6h4a3 3 0 1 0 0-6h-4z"
        fill="#fff"
      />
    </svg>
  );
}
