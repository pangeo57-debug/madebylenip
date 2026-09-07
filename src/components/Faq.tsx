"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const faqs = [
  {
    q: "Do I pay when I place the order?",
    a: "No. The form here only reserves your order and tells Lenip exactly what you want. She replies with the total including shipping, and payment happens after you've confirmed everything.",
  },
  {
    q: "How do I actually pay, then?",
    a: siteConfig.etsyEnabled
      ? "Through the Etsy shop, which handles payment securely and gives you buyer protection. Card and Apple Pay checkout directly on this site are being added carefully after that."
      : "Payment options (a secure Stripe link, or Venmo) are sent to you directly once your order is confirmed. You'll never be asked for card numbers over text or DM — if anyone does that claiming to be us, it isn't us.",
  },
  {
    q: "How much is shipping?",
    a: "It depends on where you are and how many items you order, so it's quoted with your total before you pay. Nothing is charged until you say yes.",
  },
  {
    q: "What sizes do you make?",
    a: "Toddler 2T through adult XXL, including youth sizes in between. Matching sets for siblings (or a whole family) are very doable — just say so in the notes.",
  },
  {
    q: "How long does it take?",
    a: `Usually ${siteConfig.turnaround} from the moment your order is confirmed, then shipping time on top. If you need it for a specific date, mention it in the notes and Lenip will tell you honestly whether it's possible.`,
  },
  {
    q: "Can I get a long name, or two names?",
    a: "Names up to 14 characters print cleanly. Longer than that, or more than one name on a garment, is often still possible — put it in the notes and ask.",
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
