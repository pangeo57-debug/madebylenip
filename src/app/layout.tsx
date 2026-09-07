import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Made by Lenip — Custom Printed Tees",
  description:
    "One-of-one custom t-shirt designs, printed to order. Preorder now — new drops every month.",
  openGraph: {
    title: "Made by Lenip — Custom Printed Tees",
    description:
      "One-of-one custom t-shirt designs, printed to order. Preorder now — new drops every month.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-paper selection:bg-flame selection:text-ink">
        {children}
      </body>
    </html>
  );
}
