import { ArrowUpRight, Coffee } from "lucide-react";
import menuItems from "../data/menu.jsx";

const categories = [...new Set(menuItems.map((item) => item.category))];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-amber-400/40 bg-linear-to-br from-[#1a100b] via-[#302016] to-[#1d140f] text-stone-100">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-300/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-amber-400/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 py-10 sm:grid-cols-2 sm:gap-8 sm:py-12 lg:grid-cols-[1.4fr_0.7fr_1fr] lg:gap-12">
          <div>
            <a
              aria-label="Kopi Senja, kembali ke awal"
              className="inline-flex items-center gap-3"
              href="#"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-amber-400 text-stone-950 shadow-lg shadow-amber-950/30">
                <Coffee aria-hidden="true" size={22} />
              </span>
              <span>
                <span className="block font-display text-lg font-bold text-white">
                  Kopi Senja
                </span>
                <span className="mt-0.5 block text-[10px] font-medium tracking-[0.2em] text-amber-300">
                  BREW YOUR MOMENT
                </span>
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-7 text-stone-300">
              Pilihan kopi, minuman non-kopi, makanan, dan camilan untuk
              menemani momen santaimu.
            </p>
          </div>

          <nav aria-label="Navigasi footer">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              Jelajahi
            </h2>
            <div className="mt-4 flex flex-col items-start gap-3">
              <a
                className="inline-flex items-center gap-1.5 text-sm text-stone-300 transition-colors hover:text-amber-200"
                href="#menu"
              >
                Menu pilihan <ArrowUpRight aria-hidden="true" size={15} />
              </a>
              <a
                className="inline-flex items-center gap-1.5 text-sm text-stone-300 transition-colors hover:text-amber-200"
                href="#"
              >
                Kembali ke atas <ArrowUpRight aria-hidden="true" size={15} />
              </a>
            </div>
          </nav>

          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              Kategori menu
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <li
                  className="rounded-full border border-amber-200/20 bg-amber-100/10 px-3 py-1.5 text-xs text-amber-100"
                  key={category}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/15 py-5 text-center text-xs text-stone-300 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} Kopi Senja. Temani jeda, nikmati cerita.
          </p>
        </div>
      </div>
    </footer>
  );
}
