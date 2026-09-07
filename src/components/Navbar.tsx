"use client";

import { useEffect, useState } from "react";
import { Shirt } from "lucide-react";

const links = [
  { href: "#drops", label: "Drops" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#preorder", label: "Preorder" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled ? "bg-ink/80 backdrop-blur-lg border-b border-line" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-flame via-lemon to-grape text-ink">
            <Shirt size={18} strokeWidth={2.5} />
          </span>
          Made by Lenip
        </a>

        <div className="hidden items-center gap-8 text-sm text-paper/70 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-paper">
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#preorder"
          className="rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink transition-transform hover:scale-105"
        >
          Preorder now
        </a>
      </nav>
    </header>
  );
}
