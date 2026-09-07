import type { Metadata } from "next";
import {
  Geist,
  Space_Grotesk,
  Oswald,
  Playfair_Display,
  Dancing_Script,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// The three lettering styles a customer can pick for their print.
const varsity = Oswald({
  variable: "--font-varsity",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const classic = Playfair_Display({
  variable: "--font-classic",
  subsets: ["latin"],
  weight: ["700"],
});

const script = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Made by Lenip — Custom Name Sweatshirts & Tees",
  description:
    "Personalized name sweatshirts, t-shirts and hoodies, cut and pressed by hand. Toddler to adult sizes. Design yours and order online.",
  openGraph: {
    title: "Made by Lenip — Custom Name Sweatshirts & Tees",
    description:
      "Personalized name sweatshirts, t-shirts and hoodies, cut and pressed by hand. Toddler to adult sizes.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${spaceGrotesk.variable} ${varsity.variable} ${classic.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-paper selection:bg-flame selection:text-ink">
        {children}
      </body>
    </html>
  );
}
