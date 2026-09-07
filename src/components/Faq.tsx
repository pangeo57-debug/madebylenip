"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Do I pay when I preorder?",
    a: "No. The preorder form only reserves your spot and size. We reach out to confirm details, and payment options (Stripe, Venmo) are shared once your order is confirmed.",
  },
  {
    q: "How will I actually pay once it's confirmed?",
    a: "We're rolling payments out carefully. First up is a Stripe secure payment link or Venmo, sent directly to you — never a request for your card number over text or DM. Card and Apple Pay checkout on-site are coming next.",
  },
  {
    q: "What sizes are available?",
    a: "Most drops run S–XXL. Let us know your size in the preorder form and we'll confirm availability.",
  },
  {
    q: "How long does printing and shipping take?",
    a: "Each batch is printed after preorders close for that drop, typically 1–2 weeks, then shipped right away. We'll keep you updated by email.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-line bg-ink-soft">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-grape">
          Questions
        </p>
        <h2 className="mt-2 text-center font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Good to know
        </h2>

        <div className="mt-10 divide-y divide-line rounded-2xl border border-line bg-panel/40">
          {faqs.map((item, i) => (
            <div key={item.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={open === i}
              >
                <span className="font-display text-sm font-semibold sm:text-base">
                  {item.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-paper/50 transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-paper/60">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
