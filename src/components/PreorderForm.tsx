"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { DESIGNS, SIZES } from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";

export default function PreorderForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      design: data.get("design"),
      size: data.get("size"),
      quantity: Number(data.get("quantity") || 1),
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

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-line bg-panel/60 p-10 text-center"
      >
        <CheckCircle2 className="mx-auto text-lemon" size={40} />
        <h3 className="mt-4 font-display text-xl font-semibold">You&apos;re on the list!</h3>
        <p className="mt-2 text-sm text-paper/60">
          We got your preorder — no payment was taken. We&apos;ll email you directly to confirm
          the details before anything is charged.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-flame hover:underline"
        >
          Reserve another shirt
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-2xl border border-line bg-panel/60 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name">
          <input
            id="name"
            name="name"
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

      <div className="grid gap-5 sm:grid-cols-2">
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

        <Field label="Design" htmlFor="design">
          <select id="design" name="design" required defaultValue="" className="input">
            <option value="" disabled>
              Choose a design
            </option>
            {DESIGNS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Size" htmlFor="size">
          <select id="size" name="size" required defaultValue="" className="input">
            <option value="" disabled>
              Select size
            </option>
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Quantity" htmlFor="quantity">
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            max={10}
            defaultValue={1}
            required
            className="input"
          />
        </Field>
      </div>

      <Field label="Anything else? (optional)" htmlFor="notes">
        <textarea
          id="notes"
          name="notes"
          maxLength={500}
          rows={3}
          className="input resize-none"
          placeholder="Custom design idea, sizing questions, etc."
        />
      </Field>

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
        I&apos;m okay with Made by Lenip contacting me about this preorder. I understand no
        payment is being taken right now.
      </label>

      {status === "error" && (
        <p role="alert" className="text-sm text-flame">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-flame px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 className="animate-spin" size={16} />}
        {status === "submitting" ? "Sending…" : "Reserve my shirt"}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-paper/40">
        <ShieldCheck size={13} />
        No card details are collected on this form.
      </p>
    </form>
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
