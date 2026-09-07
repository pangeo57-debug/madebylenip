// Fixed (not random) positions so server and client markup always match.
const SPARKLES = [
  { left: "6%", top: "18%", size: 10, delay: "0s" },
  { left: "14%", top: "62%", size: 6, delay: "1.4s" },
  { left: "22%", top: "34%", size: 8, delay: "2.6s" },
  { left: "31%", top: "78%", size: 5, delay: "0.7s" },
  { left: "39%", top: "12%", size: 9, delay: "3.1s" },
  { left: "47%", top: "52%", size: 6, delay: "1.9s" },
  { left: "56%", top: "24%", size: 11, delay: "0.4s" },
  { left: "63%", top: "70%", size: 7, delay: "2.2s" },
  { left: "71%", top: "38%", size: 5, delay: "3.6s" },
  { left: "78%", top: "16%", size: 9, delay: "1.1s" },
  { left: "85%", top: "58%", size: 6, delay: "2.9s" },
  { left: "92%", top: "30%", size: 8, delay: "0.2s" },
  { left: "96%", top: "74%", size: 5, delay: "1.6s" },
];

export default function Sparkles({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {SPARKLES.map((sparkle, i) => (
        <svg
          key={i}
          className="sparkle absolute"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: sparkle.delay,
          }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 0 C12.6 7 17 11.4 24 12 C17 12.6 12.6 17 12 24 C11.4 17 7 12.6 0 12 C7 11.4 11.4 7 12 0 Z"
            fill="currentColor"
            className="text-lemon"
          />
        </svg>
      ))}
    </div>
  );
}
