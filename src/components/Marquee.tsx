const words = [
  "PERSONALIZED NAMES",
  "PRESSED BY HAND",
  "TODDLER TO ADULT",
  "MADE BY LENIP",
  "GLITTER OR SMOOTH",
];

export default function Marquee() {
  const line = [...words, ...words];

  return (
    <div className="overflow-hidden border-y border-line bg-panel py-3">
      <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
        {[...line, ...line].map((word, i) => (
          <span
            key={i}
            className="font-display text-sm font-semibold tracking-widest text-paper/50"
          >
            {word} <span className="text-flame">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
