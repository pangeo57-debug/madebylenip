import PreorderForm from "./PreorderForm";

export default function PreorderSection() {
  return (
    <section id="preorder" className="relative overflow-hidden">
      <div className="animate-blob-slow pointer-events-none absolute -right-40 -top-20 h-96 w-96 rounded-full bg-lemon/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_1.2fr] md:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-flame">
            Reserve yours
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Preorder now, pay later.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/60">
            This form just reserves your spot — it never asks for card details. Once your
            order is confirmed, we&apos;ll send a secure Stripe link or Venmo request
            directly, so you always know exactly who and what you&apos;re paying.
          </p>
        </div>

        <PreorderForm />
      </div>
    </section>
  );
}
