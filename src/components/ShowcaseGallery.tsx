"use client";

import { motion } from "framer-motion";
import TshirtMock from "./TshirtMock";

const drops = [
  {
    name: "Sunset Burst",
    from: "#ff4d3d",
    to: "#ffd23f",
    pattern: "burst" as const,
    note: "Hand-drawn burst print, ink-fade dye",
  },
  {
    name: "Grape Stripe",
    from: "#8b5cf6",
    to: "#ff4d3d",
    pattern: "stripe" as const,
    note: "Bold horizontal stripe, boxy fit",
  },
  {
    name: "Lemon Grid",
    from: "#ffd23f",
    to: "#8b5cf6",
    pattern: "grid" as const,
    note: "Pixel-grid print, heavyweight cotton",
  },
  {
    name: "Flame Fade",
    from: "#ff4d3d",
    to: "#8b5cf6",
    pattern: "solid" as const,
    note: "Oversized fade wash, cropped hem",
  },
];

export default function ShowcaseGallery() {
  return (
    <section id="drops" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-flame">
            This month&apos;s drop
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Four designs. Limited run.
          </h2>
        </div>
        <p className="max-w-sm text-sm text-paper/60">
          Every design is printed only after preorders close, so nothing sits in a
          warehouse and nothing you get is mass-produced.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {drops.map((drop, i) => (
          <motion.a
            key={drop.name}
            href="#preorder"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group rounded-2xl border border-line bg-panel/60 p-5 transition-colors hover:border-paper/30"
          >
            <TshirtMock
              from={drop.from}
              to={drop.to}
              pattern={drop.pattern}
              label={drop.name}
              className="w-full transition-transform duration-300 group-hover:-translate-y-1"
            />
            <h3 className="mt-4 font-display text-base font-semibold">{drop.name}</h3>
            <p className="mt-1 text-xs text-paper/50">{drop.note}</p>
            <span className="mt-3 inline-block text-xs font-semibold text-lemon">
              Reserve this design →
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
