"use client";

import { motion } from "framer-motion";
import GarmentMock from "./GarmentMock";
import type { Finish, Garment, Orientation, PrintFont } from "@/lib/catalog";

type Style = {
  title: string;
  note: string;
  name: string;
  garment: Garment;
  garmentColor: string;
  printColor: string;
  finish: Finish;
  font: PrintFont;
  orientation: Orientation;
};

const styles: Style[] = [
  {
    title: "The classic",
    note: "Varsity caps down the front — the one everyone asks for",
    name: "Aria",
    garment: "Sweatshirt",
    garmentColor: "Heather Grey",
    printColor: "Blush",
    finish: "Smooth vinyl",
    font: "Varsity",
    orientation: "Vertical",
  },
  {
    title: "Glitter script",
    note: "Handwritten lettering in sparkly glitter vinyl",
    name: "Mila",
    garment: "Sweatshirt",
    garmentColor: "Black",
    printColor: "Gold",
    finish: "Glitter vinyl",
    font: "Script",
    orientation: "Vertical",
  },
  {
    title: "Across the chest",
    note: "Horizontal print, clean serif — good for longer names",
    name: "Noah",
    garment: "T-shirt",
    garmentColor: "Sand",
    printColor: "Black",
    finish: "Smooth vinyl",
    font: "Classic",
    orientation: "Horizontal",
  },
  {
    title: "Cozy hoodie",
    note: "Print sits above the pocket, soft pastel vinyl",
    name: "Theo",
    garment: "Hoodie",
    garmentColor: "Navy",
    printColor: "Baby Blue",
    finish: "Smooth vinyl",
    font: "Varsity",
    orientation: "Vertical",
  },
];

export default function ShowcaseGallery() {
  return (
    <section id="styles" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-flame">
            The styles
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Any name. Your way.
          </h2>
        </div>
        <p className="max-w-sm text-sm text-paper/60">
          These are starting points, not a fixed catalog — mix any garment,
          color, lettering and finish you like in the designer below.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {styles.map((style, i) => (
          <motion.a
            key={style.title}
            href="#design"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group rounded-2xl border border-line bg-panel/60 p-5 transition-colors hover:border-paper/30"
          >
            <GarmentMock
              garment={style.garment}
              garmentColor={style.garmentColor}
              printColor={style.printColor}
              finish={style.finish}
              font={style.font}
              orientation={style.orientation}
              name={style.name}
              className="w-full transition-transform duration-300 group-hover:-translate-y-1"
            />
            <h3 className="mt-4 font-display text-base font-semibold">{style.title}</h3>
            <p className="mt-1 text-xs text-paper/50">{style.note}</p>
            <span className="mt-3 inline-block text-xs font-semibold text-lemon">
              Make it yours →
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
