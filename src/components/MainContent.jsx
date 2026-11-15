import {
  ArrowDownWideNarrow,
  Heart,
  Info,
  Plus,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import MenuIcon from "./MenuIcon.jsx";
import menuItems from "../data/menu.jsx";
import { formatPrice } from "../utils/price.jsx";

const categories = [
  "Semua",
  ...new Set(menuItems.map((item) => item.category)),
];

function MenuCard({ item, favorite, onAddToCart, onFavorite, onOpenProduct }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-stone-200/70 bg-white shadow-[0_6px_24px_rgba(54,37,20,0.045)] transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_18px_40px_rgba(54,37,20,0.12)]">
      <div className="relative aspect-[1.4] overflow-hidden bg-amber-50">
        <span className="absolute inset-0 grid place-items-center text-amber-800/50">
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
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-stone-950/25 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-stone-700 shadow-sm backdrop-blur">
          {item.category}
        </span>
        <button
          aria-label={
            favorite
              ? `Hapus ${item.name} dari favorit`
              : `Tambahkan ${item.name} ke favorit`
          }
          aria-pressed={favorite}
          className={`absolute right-3 top-3 grid size-10 place-items-center rounded-full border border-white/60 shadow-sm backdrop-blur transition ${favorite ? "bg-rose-600 text-white" : "bg-white/90 text-stone-600 hover:bg-white hover:text-rose-600"}`}
          onClick={() => onFavorite(item)}
          type="button"
        >
          <Heart fill={favorite ? "currentColor" : "none"} size={17} />
        </button>
        {item.stock <= 5 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-stone-950/75 px-2.5 py-1 text-[10px] font-semibold text-white">
            Sisa {item.stock}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[15px] font-bold leading-5 text-stone-900">
            {item.name}
          </h3>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-800">
            <Star fill="currentColor" size={13} />
            {item.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-5 text-stone-500">
          {item.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-base font-bold tracking-tight text-stone-900">
            {formatPrice(item.price)}
          </span>
          <div className="flex shrink-0 gap-1.5">
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
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-amber-800 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={item.stock <= 0}
              onClick={() => onAddToCart(item)}
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
      className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12"
      id="menu"
    >
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-100/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-900">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-700" />
            Dari dapur kami
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Menu pilihan
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
            Temukan teman terbaik untuk momen santaimu.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${activeCollection === "all" ? "bg-stone-900 text-white" : "border border-stone-200 bg-white text-stone-600 hover:border-stone-400"}`}
            onClick={() => onCollectionChange("all")}
            type="button"
          >
            Semua menu
          </button>
          <button
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${activeCollection === "favorites" ? "bg-rose-600 text-white" : "border border-stone-200 bg-white text-stone-600 hover:border-stone-400"}`}
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
            />{" "}
            Favorit {favoriteCount > 0 && `(${favoriteCount})`}
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-stone-200/70 bg-white/90 p-3 shadow-[0_4px_18px_rgba(54,37,20,0.035)] sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <SlidersHorizontal
            className="mr-1 shrink-0 text-stone-400"
            size={16}
          />
          {categories.map((option) => (
            <button
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
              className="rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-xs font-medium text-stone-700 outline-none focus:border-amber-700"
              onChange={(event) => onSortChange(event.target.value)}
              value={sortMode}
            >
              <option value="newest">Terbaru ditambahkan</option>
              <option value="popular">Rating tertinggi</option>
            </select>
          </label>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between text-xs text-stone-500">
        <span>
          Menampilkan{" "}
          <strong className="text-sm font-bold text-stone-900">
            {items.length}
          </strong>{" "}
          menu
        </span>
        {activeCollection === "favorites" && (
          <span>Favorit tersimpan lokal</span>
        )}
      </div>
      {items.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <MenuCard
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
        <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-5 py-16 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-amber-50 text-amber-800">
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
