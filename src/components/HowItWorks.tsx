"use client";

import { motion } from "framer-motion";
import { Wand2, ClipboardList, Package } from "lucide-react";

const steps = [
  {
    icon: Wand2,
    title: "Design it here",
    body: "Type the name, pick the garment, color, lettering and size. The preview shows you roughly what you'll get.",
  },
  {
    icon: ClipboardList,
    title: "Send the order",
    body: "No payment is taken on the site. Lenip messages you to confirm the design, the total and shipping first.",
  },
  {
    icon: Package,
    title: "Pressed & shipped",
    body: "Once you're happy and paid, it's cut, pressed by hand and shipped to your door.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-line bg-ink-soft">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-grape">
          How it works
        </p>
        <h2 className="mt-2 max-w-lg font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple, honest, made-to-order.
        </h2>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl border border-line bg-panel/50 p-6"
            >
              <span className="absolute -top-4 left-6 grid h-8 w-8 place-items-center rounded-full bg-lemon text-sm font-bold text-ink">
                {i + 1}
              </span>
              <step.icon className="mt-2 text-flame" size={28} strokeWidth={1.75} />
              <h3 className="mt-4 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-paper/60">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
