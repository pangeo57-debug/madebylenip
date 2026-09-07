"use client";

import { motion } from "framer-motion";
import { PenTool, ClipboardList, Package } from "lucide-react";

const steps = [
  {
    icon: PenTool,
    title: "Pick or request a design",
    body: "Choose from the current drop, or message us your own idea and we'll mock it up together.",
  },
  {
    icon: ClipboardList,
    title: "Reserve with a preorder",
    body: "Fill out the form below with your size and details. No payment is taken yet — we confirm with you directly first.",
  },
  {
    icon: Package,
    title: "We print & ship",
    body: "Once the batch is confirmed, your shirt is printed to order and shipped straight to you.",
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
