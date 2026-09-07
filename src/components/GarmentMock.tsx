"use client";

import { useId } from "react";
import {
  PRINT_FONT_CASE,
  PRINT_FONT_CSS,
  PRINT_FONT_TRACKING,
  PRINT_FONT_WIDTH,
  garmentHex,
  printHex,
  type Finish,
  type Garment,
  type Orientation,
  type PrintFont,
  type PrintLayout,
} from "@/lib/catalog";

type GarmentMockProps = {
  garment: Garment;
  garmentColor: string;
  printColor: string;
  finish: Finish;
  font: PrintFont;
  orientation: Orientation;
  name: string;
  layout?: PrintLayout;
  subtitle?: string;
  artworkUrl?: string;
  className?: string;
};

function titleCase(value: string) {
  return value.replace(
    /\w\S*/g,
    (word) => word[0].toUpperCase() + word.slice(1).toLowerCase()
  );
}

// Flat-lay geometry, drawn in a 240 x 270 box with the garment centred on x=120.
const BODY_PATH =
  "M80 56 C80 50 83 46 88 45 L102 42 C108 68 132 68 138 42 L152 45 C157 46 160 50 160 56 L164 234 C164 242 158 246 150 246 L90 246 C82 246 76 242 76 234 Z";

const HEM_RIB_PATH =
  "M76 222 L164 222 L164 234 C164 242 158 246 150 246 L90 246 C82 246 76 242 76 234 Z";

const NECK_PATH = "M102 42 C108 68 132 68 138 42";

// The neck opening as a closed shape, so it reads as the inside of the
// garment rather than a hole punched through to the page background.
const NECK_FILL_PATH = "M102 42 C108 68 132 68 138 42 Z";

const HOOD_PATH = "M96 50 C88 8 152 8 144 50 C136 30 104 30 96 50 Z";

const POCKET_PATH =
  "M88 168 L152 168 C156 168 158 171 158 174 L160 210 C160 214 157 216 153 216 L87 216 C83 216 80 214 80 210 L82 174 C82 171 84 168 88 168 Z";

const LONG_SLEEVES = {
  left: "M80 52 L26 112 L40 148 L80 112 Z",
  right: "M160 52 L214 112 L200 148 L160 112 Z",
};

const SHORT_SLEEVES = {
  left: "M80 52 L40 92 L54 122 L80 104 Z",
  right: "M160 52 L200 92 L186 122 L160 104 Z",
};

const CUFFS = {
  left: "M35 102 L26 112 L40 148 L49 138 Z",
  right: "M205 102 L214 112 L200 148 L191 138 Z",
};

export default function GarmentMock({
  garment,
  garmentColor,
  printColor,
  finish,
  font,
  orientation,
  name,
  layout = "Name only",
  subtitle = "",
  artworkUrl,
  className = "",
}: GarmentMockProps) {
  const rawId = useId().replace(/:/g, "");
  const glitterId = `glitter-${rawId}`;
  const shadeId = `shade-${rawId}`;

  const fabric = garmentHex(garmentColor);
  const ink = printHex(printColor);
  const inkFill = finish === "Glitter vinyl" ? `url(#${glitterId})` : ink;

  const hasLongSleeves = garment !== "T-shirt";
  const sleeves = hasLongSleeves ? LONG_SLEEVES : SHORT_SLEEVES;
  const isHoodie = garment === "Hoodie";

  const cased = (value: string) =>
    PRINT_FONT_CASE[font] === "upper" ? value.toUpperCase() : titleCase(value);

  const trimmed = name.trim();
  const text = cased(trimmed);
  const subText = cased(subtitle.trim());

  const showArtwork = layout !== "Name only" && Boolean(artworkUrl);
  const showText = layout !== "Artwork only" && Boolean(trimmed);

  // A hoodie's pocket eats into the print area, so its name sits higher and
  // shorter than on a plain body.
  const verticalSpan = isHoodie ? 88 : 150;
  const verticalCenter = isHoodie ? 117 : 150;
  const horizontalY = isHoodie ? 108 : 120;

  const widthFactor = PRINT_FONT_WIDTH[font];
  const fit = (value: string, max: number, width: number) =>
    Math.min(max, width / (Math.max(value.length, 1) * widthFactor));

  // Artwork forces a stacked composition — a name running sideways next to a
  // graphic isn't something you'd actually press onto a shirt.
  const stacked = showArtwork;

  const artBox = stacked
    ? showText
      ? isHoodie
        ? { x: 86, y: 62, w: 68, h: 62 }
        : { x: 82, y: 68, w: 76, h: 92 }
      : isHoodie
        ? { x: 84, y: 66, w: 72, h: 88 }
        : { x: 82, y: 74, w: 76, h: 118 }
    : null;

  const stackedNameY = isHoodie ? 138 : 178;
  const stackedSubY = isHoodie ? 152 : 197;

  const fontSize = stacked
    ? fit(text, 20, 74)
    : orientation === "Vertical"
      ? fit(text, isHoodie ? 34 : 40, verticalSpan)
      : fit(text, 26, 80);

  const subFontSize = fit(subText, 10, 72);

  return (
    <svg
      viewBox="0 0 240 270"
      className={className}
      role="img"
      aria-label={
        trimmed
          ? `${garmentColor} ${garment.toLowerCase()} with "${trimmed}" printed in ${printColor}`
          : `Blank ${garmentColor} ${garment.toLowerCase()}`
      }
    >
      <defs>
        {/* Fine tile so the sparkle still reads on thin script strokes. */}
        <pattern id={glitterId} width="3.5" height="3.5" patternUnits="userSpaceOnUse">
          <rect width="3.5" height="3.5" fill={ink} />
          <circle cx="0.8" cy="0.9" r="0.42" fill="#ffffff" opacity="0.95" />
          <circle cx="2.5" cy="1.8" r="0.3" fill="#ffffff" opacity="0.65" />
          <circle cx="1.5" cy="2.9" r="0.26" fill="#ffffff" opacity="0.8" />
          <circle cx="3.1" cy="3.2" r="0.22" fill="#000000" opacity="0.2" />
        </pattern>

        <linearGradient id={shadeId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.14" />
          <stop offset="24%" stopColor="#000" stopOpacity="0" />
          <stop offset="76%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.14" />
        </linearGradient>
      </defs>

      <g stroke="rgba(0,0,0,0.18)" strokeWidth="1.6" strokeLinejoin="round">
        {isHoodie && <path d={HOOD_PATH} fill={fabric} />}

        <path d={sleeves.left} fill={fabric} />
        <path d={sleeves.right} fill={fabric} />

        {hasLongSleeves && (
          <>
            <path d={CUFFS.left} fill={fabric} />
            <path d={CUFFS.right} fill={fabric} />
          </>
        )}

        <path d={BODY_PATH} fill={fabric} />

        {hasLongSleeves && <path d={HEM_RIB_PATH} fill={fabric} />}
      </g>

      <g>
        <path d={NECK_FILL_PATH} fill={fabric} />
        <path d={NECK_FILL_PATH} fill="#000" opacity="0.35" />
      </g>

      <path
        d={NECK_PATH}
        fill="none"
        stroke="rgba(0,0,0,0.24)"
        strokeWidth={hasLongSleeves ? 6 : 4}
      />

      {isHoodie && (
        <g stroke="rgba(255,255,255,0.8)" strokeWidth="2.6" strokeLinecap="round" fill="none">
          <path d="M110 62 L108 96" />
          <path d="M130 62 L132 96" />
        </g>
      )}

      {showArtwork && artBox && (
        <image
          href={artworkUrl}
          x={artBox.x}
          y={artBox.y}
          width={artBox.w}
          height={artBox.h}
          preserveAspectRatio="xMidYMid meet"
        />
      )}

      {showText && (
        <text
          x="120"
          y={
            stacked
              ? stackedNameY
              : orientation === "Vertical"
                ? verticalCenter
                : horizontalY
          }
          fill={inkFill}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: PRINT_FONT_CSS[font],
            fontSize,
            fontWeight: 700,
            letterSpacing: PRINT_FONT_TRACKING[font],
          }}
          transform={
            !stacked && orientation === "Vertical"
              ? `rotate(-90 120 ${verticalCenter})`
              : undefined
          }
        >
          {text}
        </text>
      )}

      {/* A second line only reads properly when the main text runs across the
          garment, so it's offered (and drawn) in exactly those layouts. */}
      {showText && subText && (stacked || orientation === "Horizontal") && (
        <text
          x="120"
          y={stacked ? stackedSubY : isHoodie ? 128 : 145}
          fill={inkFill}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: PRINT_FONT_CSS[font],
            fontSize: subFontSize,
            fontWeight: 700,
            letterSpacing: PRINT_FONT_TRACKING[font] + 0.5,
          }}
        >
          {subText}
        </text>
      )}

      {isHoodie && (
        <path d={POCKET_PATH} fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.6" />
      )}

      <path d={BODY_PATH} fill={`url(#${shadeId})`} />
    </svg>
  );
}
