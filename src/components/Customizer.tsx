"use client";

import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  ShieldCheck,
  Sparkles as SparklesIcon,
  X,
} from "lucide-react";
import GarmentMock from "./GarmentMock";
import {
  ARTWORK_MAX_EDGE,
  ARTWORK_TYPES,
  FINISHES,
  GARMENTS,
  GARMENT_COLORS,
  MAX_ARTWORK_BYTES,
  MAX_NAME_LENGTH,
  MAX_SUBTITLE_LENGTH,
  ORIENTATIONS,
  PRINT_COLORS,
  PRINT_FONTS,
  PRINT_LAYOUTS,
  SIZE_GROUPS,
  type Finish,
  type Garment,
  type Orientation,
  type PrintFont,
  type PrintLayout,
} from "@/lib/catalog";

type Status = "idle" | "submitting" | "success" | "error";
type Artwork = { fileName: string; dataUrl: string };

/**
 * Shrink an image in the browser before it ever leaves the device: keeps the
 * request small enough for a serverless function and means a customer's 12 MP
 * phone photo doesn't fail on upload.
 */
async function prepareArtwork(file: File): Promise<Artwork> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, ARTWORK_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser couldn't process that image.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  // PNG first so transparent backgrounds survive; fall back to JPEG only if
  // the PNG is too heavy to send.
  let dataUrl = canvas.toDataURL("image/png");
  if (dataUrl.length * 0.75 > MAX_ARTWORK_BYTES) {
    dataUrl = canvas.toDataURL("image/jpeg", 0.85);
  }
  if (dataUrl.length * 0.75 > MAX_ARTWORK_BYTES) {
    throw new Error("That image is too large even after resizing. Try a smaller one.");
  }

  return { fileName: file.name.slice(0, 120), dataUrl };
}

export default function Customizer() {
  const [layout, setLayout] = useState<PrintLayout>("Name only");
  const [printName, setPrintName] = useState("Aria");
  const [subtitle, setSubtitle] = useState("");
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [artworkError, setArtworkError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const [garment, setGarment] = useState<Garment>("Sweatshirt");
  const [garmentColor, setGarmentColor] = useState<string>("Heather Grey");
  const [printColor, setPrintColor] = useState<string>("Blush");
  const [finish, setFinish] = useState<Finish>("Smooth vinyl");
  const [font, setFont] = useState<PrintFont>("Varsity");
  const [orientation, setOrientation] = useState<Orientation>("Vertical");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmed, setConfirmed] = useState<string>("");

  async function handleArtworkChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setArtworkError("");

    if (!ARTWORK_TYPES.includes(file.type as (typeof ARTWORK_TYPES)[number])) {
      setArtworkError("Use a PNG, JPEG or WebP image.");
      e.target.value = "";
      return;
    }

    try {
      setArtwork(await prepareArtwork(file));
      if (layout === "Name only") setLayout("Artwork + name");
    } catch (err) {
      setArtworkError(
        err instanceof Error ? err.message : "That image couldn't be read."
      );
    } finally {
      e.target.value = "";
    }
  }

  function removeArtwork() {
    setArtwork(null);
    setArtworkError("");
    if (layout !== "Name only") setLayout("Name only");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      layout,
      printName,
      subtitle,
      artwork: artwork ?? undefined,
      artworkBrief: data.get("artworkBrief"),
      garment,
      garmentColor,
      printColor,
      finish,
      font,
      orientation,
      size: data.get("size"),
      quantity,
      customerName: data.get("customerName"),
      email: data.get("email"),
      phone: data.get("phone"),
      address1: data.get("address1"),
      address2: data.get("address2"),
      city: data.get("city"),
      region: data.get("region"),
      postalCode: data.get("postalCode"),
      country: data.get("country"),
      notes: data.get("notes"),
      consent: data.get("consent") === "on",
      company: data.get("company"), // honeypot
    };

    try {
      const res = await fetch("/api/preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      const design =
        layout === "Artwork only"
          ? "your artwork"
          : layout === "Artwork + name"
            ? `your artwork + "${printName}"`
            : `"${printName}"`;
      setConfirmed(`${quantity} × ${garmentColor} ${garment.toLowerCase()} — ${design}`);
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="design" className="relative overflow-hidden border-y border-line bg-ink-soft">
      <div className="animate-blob-slow pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-grape/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-flame">
            Design yours
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Type a name. Watch it appear.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-paper/60">
            Pick the garment, the color and the lettering — the preview updates as you
            go. Sending this reserves your order; <strong className="text-paper/80">no
            payment is taken here</strong>, and we&apos;ll message you to confirm
            everything (including shipping) before anything is charged.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-line bg-panel/60 p-6">
              <GarmentMock
                garment={garment}
                garmentColor={garmentColor}
                printColor={printColor}
                finish={finish}
                font={font}
                orientation={orientation}
                name={printName}
                layout={layout}
                subtitle={subtitle}
                artworkUrl={artwork?.dataUrl}
                className="mx-auto w-full max-w-[280px] drop-shadow-2xl"
              />
              <p className="mt-4 text-center text-xs text-paper/40">
                Live preview — the real print is cut from vinyl, so expect tiny
                differences.
              </p>
            </div>
          </div>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-line bg-panel/60 p-10 text-center"
            >
              <CheckCircle2 className="mx-auto text-lemon" size={40} />
              <h3 className="mt-4 font-display text-xl font-semibold">Order reserved!</h3>
              <p className="mt-2 text-sm text-paper/60">{confirmed}</p>
              <p className="mt-4 text-sm text-paper/60">
                No payment was taken. We&apos;ll email you to confirm the details, the
                total and shipping before anything is charged.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-sm font-semibold text-flame hover:underline"
              >
                Design another one
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-8">
              <Panel title="1. The design">
                <OptionRow label="What goes on it">
                  {PRINT_LAYOUTS.map((option) => (
                    <Chip
                      key={option}
                      active={layout === option}
                      onClick={() => setLayout(option)}
                    >
                      {option}
                    </Chip>
                  ))}
                </OptionRow>

                {layout !== "Artwork only" && (
                  <div className="grid gap-1.5">
                    <label htmlFor="printName" className="text-xs font-medium text-paper/60">
                      Name or text to print
                    </label>
                    <input
                      id="printName"
                      value={printName}
                      onChange={(e) => setPrintName(e.target.value)}
                      maxLength={MAX_NAME_LENGTH}
                      className="input text-lg"
                      placeholder="e.g. Aria"
                    />
                    <p className="text-xs text-paper/40">
                      Up to {MAX_NAME_LENGTH} characters — letters, numbers, spaces
                      and &apos; - . &amp; ! #
                    </p>
                  </div>
                )}

                {layout !== "Artwork only" &&
                  (layout === "Artwork + name" || orientation === "Horizontal") && (
                    <div className="grid gap-1.5">
                      <label htmlFor="subtitle" className="text-xs font-medium text-paper/60">
                        Second line (optional)
                      </label>
                      <input
                        id="subtitle"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        maxLength={MAX_SUBTITLE_LENGTH}
                        className="input"
                        placeholder="e.g. Est. 2026"
                      />
                    </div>
                  )}

                {layout !== "Name only" && (
                  <div className="grid gap-3 rounded-2xl border border-dashed border-line p-4">
                    <span className="text-xs font-medium text-paper/60">Your design</span>

                    {artwork ? (
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={artwork.dataUrl}
                          alt="Your uploaded design"
                          className="h-16 w-16 rounded-lg border border-line bg-ink object-contain"
                        />
                        <span className="min-w-0 flex-1 truncate text-xs text-paper/60">
                          {artwork.fileName}
                        </span>
                        <button
                          type="button"
                          onClick={removeArtwork}
                          className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-paper/70 transition-colors hover:border-paper/40 hover:text-paper"
                        >
                          <X size={12} /> Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInput.current?.click()}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-xs font-semibold text-paper/70 transition-colors hover:border-paper/40 hover:text-paper"
                      >
                        <ImagePlus size={14} />
                        Upload an image
                      </button>
                    )}

                    <input
                      ref={fileInput}
                      type="file"
                      accept={ARTWORK_TYPES.join(",")}
                      onChange={handleArtworkChange}
                      className="hidden"
                    />

                    {artworkError && (
                      <p role="alert" className="text-xs text-flame">
                        {artworkError}
                      </p>
                    )}

                    <p className="text-xs text-paper/40">
                      PNG with a transparent background works best. Up to{" "}
                      {Math.round(MAX_ARTWORK_BYTES / (1024 * 1024))} MB — we&apos;ll
                      ask for a print-quality file when we confirm your order.
                    </p>

                    <div className="grid gap-1.5">
                      <label
                        htmlFor="artworkBrief"
                        className="text-xs font-medium text-paper/60"
                      >
                        …or describe what you&apos;d like made
                      </label>
                      <textarea
                        id="artworkBrief"
                        name="artworkBrief"
                        maxLength={500}
                        rows={2}
                        className="input resize-none"
                        placeholder="e.g. a dragon breathing roses, in pastel colors"
                      />
                    </div>
                  </div>
                )}

                <OptionRow label="Lettering">
                  {PRINT_FONTS.map((option) => (
                    <Chip
                      key={option}
                      active={font === option}
                      onClick={() => setFont(option)}
                    >
                      {option}
                    </Chip>
                  ))}
                </OptionRow>

                {/* With artwork the text always sits under the graphic, so a
                    direction choice would be a control that does nothing. */}
                {layout === "Name only" && (
                  <OptionRow label="Direction">
                    {ORIENTATIONS.map((option) => (
                      <Chip
                        key={option}
                        active={orientation === option}
                        onClick={() => setOrientation(option)}
                      >
                        {option}
                      </Chip>
                    ))}
                  </OptionRow>
                )}
              </Panel>

              <Panel title="2. The garment">
                <OptionRow label="Style">
                  {GARMENTS.map((option) => (
                    <Chip
                      key={option}
                      active={garment === option}
                      onClick={() => setGarment(option)}
                    >
                      {option}
                    </Chip>
                  ))}
                </OptionRow>

                <OptionRow label={`Garment color — ${garmentColor}`}>
                  {GARMENT_COLORS.map((color) => (
                    <Swatch
                      key={color.name}
                      hex={color.hex}
                      name={color.name}
                      active={garmentColor === color.name}
                      onClick={() => setGarmentColor(color.name)}
                    />
                  ))}
                </OptionRow>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <label htmlFor="size" className="text-xs font-medium text-paper/60">
                      Size
                    </label>
                    <select
                      id="size"
                      name="size"
                      required
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="input"
                    >
                      <option value="" disabled>
                        Select size
                      </option>
                      {SIZE_GROUPS.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.sizes.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-1.5">
                    <label htmlFor="quantity" className="text-xs font-medium text-paper/60">
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min={1}
                      max={20}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      required
                      className="input"
                    />
                  </div>
                </div>
              </Panel>

              <Panel title="3. The print">
                <OptionRow label={`Print color — ${printColor}`}>
                  {PRINT_COLORS.map((color) => (
                    <Swatch
                      key={color.name}
                      hex={color.hex}
                      name={color.name}
                      active={printColor === color.name}
                      onClick={() => setPrintColor(color.name)}
                    />
                  ))}
                </OptionRow>

                <OptionRow label="Finish">
                  {FINISHES.map((option) => (
                    <Chip
                      key={option}
                      active={finish === option}
                      onClick={() => setFinish(option)}
                    >
                      {option === "Glitter vinyl" ? (
                        <span className="inline-flex items-center gap-1.5">
                          <SparklesIcon size={13} /> Glitter
                        </span>
                      ) : (
                        "Smooth"
                      )}
                    </Chip>
                  ))}
                </OptionRow>
              </Panel>

              <Panel title="4. Where it goes">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your full name" htmlFor="customerName">
                    <input
                      id="customerName"
                      name="customerName"
                      required
                      minLength={2}
                      maxLength={80}
                      autoComplete="name"
                      className="input"
                      placeholder="Jamie Rivera"
                    />
                  </Field>

                  <Field label="Email" htmlFor="email">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      maxLength={120}
                      autoComplete="email"
                      className="input"
                      placeholder="you@email.com"
                    />
                  </Field>
                </div>

                <Field label="Phone (optional)" htmlFor="phone">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    maxLength={30}
                    autoComplete="tel"
                    className="input"
                    placeholder="(555) 555-5555"
                  />
                </Field>

                <Field label="Street address" htmlFor="address1">
                  <input
                    id="address1"
                    name="address1"
                    required
                    maxLength={120}
                    autoComplete="address-line1"
                    className="input"
                    placeholder="123 Main St"
                  />
                </Field>

                <Field label="Apartment, suite, etc. (optional)" htmlFor="address2">
                  <input
                    id="address2"
                    name="address2"
                    maxLength={120}
                    autoComplete="address-line2"
                    className="input"
                    placeholder="Apt 4B"
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-3">
                  <Field label="City" htmlFor="city">
                    <input
                      id="city"
                      name="city"
                      required
                      maxLength={80}
                      autoComplete="address-level2"
                      className="input"
                    />
                  </Field>

                  <Field label="State / region" htmlFor="region">
                    <input
                      id="region"
                      name="region"
                      required
                      maxLength={80}
                      autoComplete="address-level1"
                      className="input"
                    />
                  </Field>

                  <Field label="ZIP / postal code" htmlFor="postalCode">
                    <input
                      id="postalCode"
                      name="postalCode"
                      required
                      maxLength={16}
                      autoComplete="postal-code"
                      className="input"
                    />
                  </Field>
                </div>

                <Field label="Country" htmlFor="country">
                  <input
                    id="country"
                    name="country"
                    required
                    maxLength={60}
                    defaultValue="United States"
                    autoComplete="country-name"
                    className="input"
                  />
                </Field>

                <Field label="Anything else? (optional)" htmlFor="notes">
                  <textarea
                    id="notes"
                    name="notes"
                    maxLength={500}
                    rows={3}
                    className="input resize-none"
                    placeholder="A second name, a gift note, a deadline…"
                  />
                </Field>
              </Panel>

              {/* Honeypot field — hidden from real users, catches simple bots */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" tabIndex={-1} autoComplete="off" />
              </div>

              <label className="flex items-start gap-3 text-sm text-paper/60">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="mt-1 h-4 w-4 rounded border-line bg-ink accent-flame"
                />
                I&apos;m okay with Made by Lenip contacting me about this order. I
                understand no payment is being taken right now.
              </label>

              {status === "error" && (
                <p role="alert" className="text-sm text-flame">
                  {errorMsg}
                </p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-flame px-6 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" && <Loader2 className="animate-spin" size={16} />}
                  {status === "submitting" ? "Sending…" : "Reserve this order"}
                </button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-paper/40">
                  <ShieldCheck size={13} />
                  No card details are collected here. Total and shipping are confirmed by
                  message first.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-5 rounded-3xl border border-line bg-panel/50 p-6">
      <legend className="px-2 font-display text-sm font-semibold text-lemon">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function OptionRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <span className="text-xs font-medium text-paper/60">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "border-flame bg-flame text-ink"
          : "border-line text-paper/70 hover:border-paper/40 hover:text-paper"
      }`}
    >
      {children}
    </button>
  );
}

function Swatch({
  hex,
  name,
  active,
  onClick,
}: {
  hex: string;
  name: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={name}
      title={name}
      style={{ backgroundColor: hex }}
      className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${
        active ? "border-flame ring-2 ring-flame/40" : "border-line"
      }`}
    />
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-paper/60">
        {label}
      </label>
      {children}
    </div>
  );
}
