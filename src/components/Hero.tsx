"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import TshirtMock from "./TshirtMock";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="animate-blob pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-flame/30 blur-3xl" />
      <div className="animate-blob-slow pointer-events-none absolute -right-24 top-40 h-96 w-96 rounded-full bg-grape/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-16 md:grid-cols-2 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-3 py-1 text-xs font-medium text-paper/70">
            <Sparkles size={14} className="text-lemon" />
            New drop every month — preorders open now
          </span>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Wear a shirt
            <br />
            nobody else has.
            <br />
            <span className="text-gradient">Made by Lenip.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-paper/70">
            Original designs, printed to order in small batches. Reserve your size
            now with a no-payment preorder — we&apos;ll reach out personally before
            anything is charged.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#preorder"
              className="rounded-full bg-flame px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-105"
            >
              Reserve your shirt
            </a>
            <a
              href="#drops"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-paper/80 transition-colors hover:border-paper/40 hover:text-paper"
            >
              See the drop
              <ArrowDown size={16} />
            </a>
          </div>

          <p className="mt-6 text-xs uppercase tracking-widest text-paper/40">
            No card required to preorder · Secure checkout coming soon via Stripe
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto grid w-full max-w-sm grid-cols-2 gap-6"
        >
          <TshirtMock
            from="#ff4d3d"
            to="#ffd23f"
            pattern="burst"
            label="Sunset burst tee"
            className="animate-sway w-full drop-shadow-2xl"
          />
          <TshirtMock
            from="#8b5cf6"
            to="#ff4d3d"
            pattern="stripe"
            label="Grape stripe tee"
            className="animate-sway mt-10 w-full drop-shadow-2xl [animation-delay:-2s]"
          />
          <TshirtMock
            from="#ffd23f"
            to="#8b5cf6"
            pattern="grid"
            label="Lemon grid tee"
            className="animate-sway w-full drop-shadow-2xl [animation-delay:-4s]"
          />
          <TshirtMock
            from="#ff4d3d"
            to="#8b5cf6"
            pattern="solid"
            label="Flame fade tee"
            className="animate-sway mt-10 w-full drop-shadow-2xl [animation-delay:-1s]"
          />
        </motion.div>
      </div>
    </section>
  );
}
