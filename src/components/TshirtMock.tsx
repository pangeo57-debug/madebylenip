type TshirtMockProps = {
  from: string;
  to: string;
  label?: string;
  pattern?: "solid" | "stripe" | "burst" | "grid";
  className?: string;
};

export default function TshirtMock({
  from,
  to,
  label,
  pattern = "solid",
  className = "",
}: TshirtMockProps) {
  const gradientId = `grad-${from.replace("#", "")}-${to.replace("#", "")}`;

  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      role="img"
      aria-label={label ? `T-shirt mockup: ${label}` : "T-shirt mockup"}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <clipPath id={`${gradientId}-clip`}>
          <path d="M60 10 L80 2 C90 14 110 14 120 2 L140 10 L172 34 L152 62 L136 52 L136 200 C136 208 130 214 122 214 L78 214 C70 214 64 208 64 200 L64 52 L48 62 L28 34 Z" />
        </clipPath>
      </defs>

      <path
        d="M60 10 L80 2 C90 14 110 14 120 2 L140 10 L172 34 L152 62 L136 52 L136 200 C136 208 130 214 122 214 L78 214 C70 214 64 208 64 200 L64 52 L48 62 L28 34 Z"
        fill="var(--panel)"
        stroke="var(--line)"
        strokeWidth="2"
      />

      <g clipPath={`url(#${gradientId}-clip)`}>
        {pattern === "solid" && (
          <rect x="0" y="90" width="200" height="90" fill={`url(#${gradientId})`} />
        )}
        {pattern === "stripe" && (
          <g fill={`url(#${gradientId})`}>
            <rect x="0" y="80" width="200" height="14" />
            <rect x="0" y="104" width="200" height="14" />
            <rect x="0" y="128" width="200" height="14" />
            <rect x="0" y="152" width="200" height="14" />
          </g>
        )}
        {pattern === "burst" && (
          <g>
            <circle cx="100" cy="130" r="55" fill={`url(#${gradientId})`} />
            <circle cx="100" cy="130" r="30" fill="var(--ink)" opacity="0.15" />
          </g>
        )}
        {pattern === "grid" && (
          <g fill={`url(#${gradientId})`}>
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={20 + col * 45}
                  y={70 + row * 35}
                  width="30"
                  height="22"
                  rx="4"
                  opacity={0.5 + ((row + col) % 3) * 0.18}
                />
              ))
            )}
          </g>
        )}
      </g>

      <path
        d="M60 10 L80 2 C90 14 110 14 120 2 L140 10 L172 34 L152 62 L136 52 L136 200 C136 208 130 214 122 214 L78 214 C70 214 64 208 64 200 L64 52 L48 62 L28 34 Z"
        fill="none"
        stroke="var(--line)"
        strokeWidth="2"
      />
    </svg>
  );
}
