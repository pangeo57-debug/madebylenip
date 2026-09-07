"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Palette, Truck, MessageCircle } from "lucide-react";

const points = [
  {
    icon: Palette,
    title: "Original art, every drop",
    body: "Every design is drawn and printed specifically for Made by Lenip — never stock clipart.",
  },
  {
    icon: ShieldCheck,
    title: "No surprise charges",
    body: "Preordering never charges your card. We confirm details with you personally before any payment happens.",
  },
  {
    icon: Truck,
    title: "Printed after the batch closes",
    body: "Small, made-to-order runs mean less waste and a shirt that actually fits the size you asked for.",
  },
  {
    icon: MessageCircle,
    title: "A real person replies",
    body: "Every preorder gets a reply from Lenip directly — not an autoresponder.",
  },
];

export default function WhyUs() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="text-xs font-semibold uppercase tracking-widest text-lemon">
        Why preorder here
      </p>
      <h2 className="mt-2 max-w-lg font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Small shop. No games.
      </h2>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {points.map((point, i) => (
          <motion.div
            key={point.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="flex gap-4 rounded-2xl border border-line bg-panel/40 p-6"
          >
            <point.icon className="mt-1 shrink-0 text-flame" size={22} strokeWidth={1.75} />
            <div>
              <h3 className="font-display text-base font-semibold">{point.title}</h3>
              <p className="mt-1 text-sm text-paper/60">{point.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
