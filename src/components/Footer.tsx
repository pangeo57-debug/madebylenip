import { Shirt, AtSign, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <a href="#top" className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-flame via-lemon to-grape text-ink">
                <Shirt size={18} strokeWidth={2.5} />
              </span>
              Made by Lenip
            </a>
            <p className="mt-3 max-w-xs text-sm text-paper/50">
              Custom printed tees, designed and made to order. New drop every month.
            </p>
          </div>

          <div className="flex gap-10 text-sm">
            <div>
              <p className="font-semibold text-paper/80">Explore</p>
              <ul className="mt-3 space-y-2 text-paper/50">
                <li><a href="#drops" className="hover:text-paper">Drops</a></li>
                <li><a href="#how-it-works" className="hover:text-paper">How it works</a></li>
                <li><a href="#preorder" className="hover:text-paper">Preorder</a></li>
                <li><a href="#faq" className="hover:text-paper">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-paper/80">Get in touch</p>
              <ul className="mt-3 space-y-2 text-paper/50">
                <li className="flex items-center gap-2">
                  <Mail size={14} />
                  <a href="mailto:hello@madebylenip.com" className="hover:text-paper">
                    hello@madebylenip.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <AtSign size={14} />
                  <a href="#" className="hover:text-paper">
                    @madebylenip
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Made by Lenip. All rights reserved.</p>
          <p>Preorders only — no payment is collected on this site yet.</p>
        </div>
      </div>
    </footer>
  );
}
