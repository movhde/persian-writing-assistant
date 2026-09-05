export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="دستیار هوشمند نوشتار فارسی"
    >
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#logo-bg)" />
      <path d="M8 16 H24" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M8 22 H19" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M23 5.5 L24.3 7.7 L26.5 9 L24.3 10.3 L23 12.5 L21.7 10.3 L19.5 9 L21.7 7.7 Z"
        fill="#fbbf24"
      />
    </svg>
  );
}
