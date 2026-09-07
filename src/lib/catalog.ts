// The product catalog: everything a customer can pick.
// Kept free of any server-only imports (no zod here) so client components can
// import it cheaply. `validation.ts` builds the request schema on top of this.

export const GARMENTS = ["Sweatshirt", "T-shirt", "Hoodie"] as const;
export type Garment = (typeof GARMENTS)[number];

export const GARMENT_COLORS = [
  { name: "Heather Grey", hex: "#B5B4AF" },
  { name: "Black", hex: "#1E1E22" },
  { name: "White", hex: "#F2F0EA" },
  { name: "Sand", hex: "#D6C9B4" },
  { name: "Navy", hex: "#27334D" },
  { name: "Dusty Pink", hex: "#E2BAC1" },
  { name: "Sage", hex: "#B0C0A9" },
] as const;

export type GarmentColorName = (typeof GARMENT_COLORS)[number]["name"];

export const PRINT_COLORS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Mint", hex: "#C8E1B4" },
  { name: "Blush", hex: "#F3C9C1" },
  { name: "Baby Blue", hex: "#BEDCEF" },
  { name: "Butter", hex: "#F5E3A8" },
  { name: "Lilac", hex: "#D3C4EA" },
  { name: "Black", hex: "#181818" },
  { name: "Gold", hex: "#E3B85C" },
  { name: "Silver", hex: "#CDD3DA" },
] as const;

export type PrintColorName = (typeof PRINT_COLORS)[number]["name"];

export const FINISHES = ["Smooth vinyl", "Glitter vinyl"] as const;
export type Finish = (typeof FINISHES)[number];

export const PRINT_FONTS = ["Varsity", "Classic", "Script"] as const;
export type PrintFont = (typeof PRINT_FONTS)[number];

export const ORIENTATIONS = ["Vertical", "Horizontal"] as const;
export type Orientation = (typeof ORIENTATIONS)[number];

export const SIZES = [
  "2T",
  "3T",
  "4T",
  "Youth XS",
  "Youth S",
  "Youth M",
  "Youth L",
  "Adult S",
  "Adult M",
  "Adult L",
  "Adult XL",
  "Adult XXL",
] as const;
export type Size = (typeof SIZES)[number];

export const SIZE_GROUPS: { label: string; sizes: readonly Size[] }[] = [
  { label: "Toddler", sizes: ["2T", "3T", "4T"] },
  { label: "Youth", sizes: ["Youth XS", "Youth S", "Youth M", "Youth L"] },
  {
    label: "Adult",
    sizes: ["Adult S", "Adult M", "Adult L", "Adult XL", "Adult XXL"],
  },
];

/** Longest name we can comfortably print down a garment. */
export const MAX_NAME_LENGTH = 14;

/** Characters a vinyl cutter can actually handle cleanly. */
export const NAME_PATTERN = /^[A-Za-z0-9 '.-]+$/;

// Zod needs non-empty tuples of the literal names.
export const GARMENT_COLOR_NAMES = GARMENT_COLORS.map((c) => c.name) as [
  GarmentColorName,
  ...GarmentColorName[],
];

export const PRINT_COLOR_NAMES = PRINT_COLORS.map((c) => c.name) as [
  PrintColorName,
  ...PrintColorName[],
];

export function garmentHex(name: string): string {
  return GARMENT_COLORS.find((c) => c.name === name)?.hex ?? GARMENT_COLORS[0].hex;
}

export function printHex(name: string): string {
  return PRINT_COLORS.find((c) => c.name === name)?.hex ?? PRINT_COLORS[0].hex;
}

export const PRINT_FONT_CSS: Record<PrintFont, string> = {
  Varsity: "var(--font-varsity), Impact, sans-serif",
  Classic: "var(--font-classic), Georgia, serif",
  Script: "var(--font-script), cursive",
};

// Rough average glyph width as a fraction of font size, used to shrink long
// names so they always fit inside the print area.
export const PRINT_FONT_WIDTH: Record<PrintFont, number> = {
  Varsity: 0.54,
  Classic: 0.68,
  Script: 0.52,
};

export const PRINT_FONT_CASE: Record<PrintFont, "upper" | "title"> = {
  Varsity: "upper",
  Classic: "upper",
  Script: "title",
};

export const PRINT_FONT_TRACKING: Record<PrintFont, number> = {
  Varsity: 1.5,
  Classic: 1,
  Script: 0,
};
