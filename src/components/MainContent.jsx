import { useState } from "react";
import {
  ArrowDownWideNarrow,
  Coffee,
  Heart,
  Info,
  Minus,
  Plus,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import MenuIcon from "./MenuIcon.jsx";
import cafeInterior from "../assets/images/cafe-interior.jpg";
import menuItems from "../data/menu.jsx";
import { formatPrice } from "../utils/price.jsx";

const categories = [
  "Semua",
  ...new Set(menuItems.map((item) => item.category)),
];

function MenuCard({
  availableStock,
  item,
  favorite,
  onAddToCart,
  onFavorite,
  onOpenProduct,
}) {
  const [quantity, setQuantity] = useState(1);
  const selectedQuantity = Math.min(quantity, availableStock);

  return (
    <article className="group overflow-hidden rounded-3xl border border-stone-200/70 bg-white shadow-[0_6px_24px_rgba(54,37,20,0.045)] transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_18px_40px_rgba(54,37,20,0.12)]">
      <div className="relative aspect-[1.4] overflow-hidden bg-linear-to-br from-amber-100 to-stone-100">
        <span className="absolute inset-0 grid place-items-center text-amber-800/40">
          <MenuIcon category={item.category} size={46} />
        </span>
        <img
          alt={item.name}
          className="relative size-full object-cover transition duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
          src={item.image}
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-stone-950/35 via-stone-950/5 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-stone-700 shadow-sm backdrop-blur-md">
          {item.category}
        </span>
        <button
          aria-label={
            favorite
              ? `Hapus ${item.name} dari favorit`
              : `Tambahkan ${item.name} ke favorit`
          }
          aria-pressed={favorite}
          className={`absolute right-3 top-3 grid size-10 place-items-center rounded-full border border-white/70 shadow-sm backdrop-blur-md transition duration-200 ${favorite ? "bg-rose-600 text-white" : "bg-white/90 text-stone-600 hover:scale-105 hover:bg-white hover:text-rose-600"}`}
          onClick={() => onFavorite(item)}
          type="button"
        >
          <Heart fill={favorite ? "currentColor" : "none"} size={17} />
        </button>
        {availableStock <= 5 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-stone-950/75 px-2.5 py-1 text-[10px] font-semibold text-white">
            {availableStock > 0 ? `Sisa ${availableStock}` : "Habis"}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[15px] font-bold leading-5 text-stone-900">
            {item.name}
          </h3>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 ring-1 ring-amber-900/5">
            <Star fill="currentColor" size={13} />
            {item.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-5 text-stone-500">
          {item.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-base font-bold tracking-tight text-stone-900 sm:text-[17px]">
            {formatPrice(item.price)}
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            <div
              aria-label={`Jumlah ${item.name}`}
              className="inline-flex h-9 items-center rounded-full border border-stone-200 bg-stone-50 p-0.5"
              role="group"
            >
              <button
                aria-label={`Kurangi jumlah ${item.name}`}
                className="grid size-7 place-items-center rounded-full text-stone-600 transition hover:bg-white hover:text-amber-900 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={selectedQuantity <= 1}
                onClick={() => setQuantity(selectedQuantity - 1)}
                type="button"
              >
                <Minus size={13} />
              </button>
              <span
                aria-live="polite"
                className="w-5 text-center text-xs font-bold tabular-nums text-stone-800"
              >
                {selectedQuantity}
              </span>
              <button
                aria-label={`Tambah jumlah ${item.name}`}
                className="grid size-7 place-items-center rounded-full text-stone-600 transition hover:bg-white hover:text-amber-900 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={selectedQuantity >= availableStock}
                onClick={() => setQuantity(selectedQuantity + 1)}
                type="button"
              >
                <Plus size={13} />
              </button>
            </div>
            <button
              aria-label={`Info ${item.name}`}
              className="grid size-9 place-items-center rounded-full border border-stone-200 text-stone-600 transition hover:border-amber-700 hover:bg-amber-50 hover:text-amber-900"
              onClick={() => onOpenProduct(item)}
              title="Info dan komentar"
              type="button"
            >
              <Info size={16} />
            </button>
            <button
              aria-label={`Tambah ${item.name} ke keranjang`}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-amber-800 px-3 text-xs font-bold text-white shadow-sm shadow-amber-900/10 transition hover:-translate-y-0.5 hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={selectedQuantity <= 0}
              onClick={() => {
                onAddToCart(item, selectedQuantity);
                setQuantity(1);
              }}
              title="Tambah ke keranjang"
              type="button"
            >
              <Plus size={16} />
              <span>Tambah</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MainContent({
  activeCollection,
  availableStocks,
  category,
  favoriteCount,
  favorites,
  items,
  onAddToCart,
  onCategoryChange,
  onCollectionChange,
  onFavorite,
  onOpenProduct,
  onSortChange,
  sortMode,
}) {
  return (
    <section
      className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12"
      id="menu"
    >
      <div className="relative isolate mb-8 overflow-hidden rounded-[2rem] border border-white/15 bg-stone-950 p-5 shadow-[0_16px_40px_rgba(38,25,14,0.18)] sm:p-8 lg:p-9">
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover object-[center_55%]"
          decoding="async"
          src={cafeInterior}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-stone-950/85 via-stone-950/65 to-stone-950/35"
        />
        <div className="relative z-10 grid items-end gap-7 md:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-100 shadow-sm backdrop-blur-md">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-300" />
              Dari dapur kami
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              Menu pilihan,
              <br className="hidden sm:block" /> teman untuk{" "}
              <span className="text-amber-300">jedamu.</span>
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-stone-100/90 sm:text-[15px]">
              Temukan teman terbaik untuk momen santaimu.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/75 px-4 py-3 shadow-sm backdrop-blur">
              <span className="grid size-10 place-items-center rounded-xl bg-amber-100 text-amber-900">
                <Coffee aria-hidden="true" size={20} />
              </span>
              <span>
                <span className="block text-lg font-bold leading-tight text-stone-900">
                  {items.length}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                  Menu ditampilkan
                </span>
              </span>
            </div>
            <div className="flex gap-2">
              <button
                aria-pressed={activeCollection === "all"}
                className={`rounded-full px-4 py-2.5 text-xs font-semibold transition ${activeCollection === "all" ? "bg-amber-300 text-stone-950 shadow-md shadow-black/20 hover:bg-amber-200" : "border border-white/60 bg-white/85 text-stone-700 hover:bg-white"}`}
                onClick={() => onCollectionChange("all")}
                type="button"
              >
                Semua menu
              </button>
              <button
                aria-pressed={activeCollection === "favorites"}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold transition ${activeCollection === "favorites" ? "bg-rose-600 text-white shadow-md shadow-rose-900/15" : "border border-white/60 bg-white/85 text-stone-700 hover:border-rose-200 hover:bg-white hover:text-rose-700"}`}
                id="favorites"
                onClick={() =>
                  onCollectionChange(
                    activeCollection === "favorites" ? "all" : "favorites",
                  )
                }
                type="button"
              >
                <Heart
                  fill={activeCollection === "favorites" ? "currentColor" : "none"}
                  size={13}
                />
                Favorit {favoriteCount > 0 && `(${favoriteCount})`}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-stone-200/70 bg-white/90 p-3 shadow-[0_6px_24px_rgba(54,37,20,0.05)] sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <SlidersHorizontal
            className="mr-1 shrink-0 text-amber-800/70"
            size={16}
          />
          {categories.map((option) => (
            <button
              aria-pressed={category === option}
              className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold transition ${category === option ? "bg-amber-800 text-white shadow-sm shadow-amber-900/15" : "bg-stone-50 text-stone-600 hover:bg-amber-50 hover:text-amber-900"}`}
              key={option}
              onClick={() => onCategoryChange(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
        {activeCollection === "favorites" && (
          <label className="flex shrink-0 items-center gap-2 self-end text-xs text-stone-500 sm:self-auto">
            <ArrowDownWideNarrow size={15} />
            <span>Urutkan</span>
            <select
              className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-medium text-stone-700 outline-none transition hover:border-amber-300 focus:border-amber-700"
              onChange={(event) => onSortChange(event.target.value)}
              value={sortMode}
            >
              <option value="newest">Terbaru ditambahkan</option>
              <option value="popular">Rating tertinggi</option>
            </select>
          </label>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 text-xs text-stone-500">
        <span className="inline-flex items-center gap-1.5">
          Menampilkan
          <strong className="rounded-full bg-amber-100/80 px-2 py-1 text-xs font-bold text-amber-900">
            {items.length}
          </strong>
          menu
        </span>
        {activeCollection === "favorites" && (
          <span className="rounded-full bg-rose-50 px-3 py-1.5 font-medium text-rose-700">
            Favorit tersimpan lokal
          </span>
        )}
      </div>
      {items.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <MenuCard
              availableStock={availableStocks[item.id] ?? 0}
              favorite={favorites.includes(item.id)}
              item={item}
              key={item.id}
              onAddToCart={onAddToCart}
              onFavorite={onFavorite}
              onOpenProduct={onOpenProduct}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-amber-900/20 bg-linear-to-br from-white to-amber-50/60 px-5 py-16 text-center shadow-sm">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-100/80 text-amber-800">
            <Heart size={22} />
          </span>
          <h3 className="mt-4 font-display text-lg font-bold text-stone-900">
            {activeCollection === "favorites"
              ? "Belum ada menu favorit"
              : "Menu tidak ditemukan"}
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-stone-500">
            {activeCollection === "favorites"
              ? "Tekan ikon hati pada menu yang kamu suka untuk menyimpannya di sini."
              : "Coba kata kunci atau kategori lain."}
          </p>
        </div>
      )}
    </section>
  );
}
