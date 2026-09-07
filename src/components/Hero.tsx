"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles as SparklesIcon } from "lucide-react";
import GarmentMock from "./GarmentMock";
import Sparkles from "./Sparkles";
import { siteConfig } from "@/lib/site-config";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="animate-blob pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-flame/25 blur-3xl" />
      <div className="animate-blob-slow pointer-events-none absolute -right-24 top-40 h-96 w-96 rounded-full bg-grape/25 blur-3xl" />
      <Sparkles />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-16 md:grid-cols-2 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-3 py-1 text-xs font-medium text-paper/70">
            <SparklesIcon size={14} className="text-lemon" />
            Handmade to order · Toddler to adult sizes
          </span>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Their name.
            <br />
            Their shirt.
            <br />
            <span className="shimmer-text">Made by Lenip.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-paper/70">
            Custom name sweatshirts, tees and hoodies — cut and pressed by hand,
            one at a time. Pick the garment, the color and the lettering, and
            watch it come together on screen.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#design"
              className="rounded-full bg-flame px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-105"
            >
              Design yours
            </a>
            <a
              href="#styles"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-paper/80 transition-colors hover:border-paper/40 hover:text-paper"
            >
              See the styles
              <ArrowDown size={16} />
            </a>
            {siteConfig.etsyEnabled && (
              <a
                href={siteConfig.etsyShopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-lemon hover:underline"
              >
                Or buy on Etsy →
              </a>
            )}
          </div>

          <p className="mt-6 text-xs uppercase tracking-widest text-paper/40">
            No card required to order · We confirm every order by message first
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-6"
        >
          <GarmentMock
            garment="Sweatshirt"
            garmentColor="Heather Grey"
            printColor="Mint"
            finish="Smooth vinyl"
            font="Varsity"
            orientation="Vertical"
            name="Wesson"
            className="animate-sway w-full drop-shadow-2xl"
          />
          <GarmentMock
            garment="Sweatshirt"
            garmentColor="Heather Grey"
            printColor="Blush"
            finish="Smooth vinyl"
            font="Varsity"
            orientation="Vertical"
            name="Aria"
            className="animate-sway mt-10 w-full drop-shadow-2xl [animation-delay:-2s]"
          />
          <GarmentMock
            garment="T-shirt"
            garmentColor="Black"
            printColor="Gold"
            finish="Glitter vinyl"
            font="Script"
            orientation="Vertical"
            name="Mila"
            className="animate-sway w-full drop-shadow-2xl [animation-delay:-4s]"
          />
          <GarmentMock
            garment="Hoodie"
            garmentColor="Sand"
            printColor="Baby Blue"
            finish="Smooth vinyl"
            font="Varsity"
            orientation="Vertical"
            name="Jaxon"
            className="animate-sway mt-10 w-full drop-shadow-2xl [animation-delay:-1s]"
          />
        </motion.div>
      </div>
    </section>
  );
}
