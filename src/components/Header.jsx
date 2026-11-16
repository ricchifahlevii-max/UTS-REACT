import { Coffee, Heart, History, Search, ShoppingBag } from 'lucide-react'

export default function Header({ cartCount, favoriteCount, onOpenCart, onOpenFavorites, onOpenHistory, onSearch, search }) {
  return (
    <header className="sticky top-0 z-30 border-b border-amber-950/10 bg-[#fffdfa]/90 shadow-[0_8px_24px_rgba(70,43,20,0.06)] backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-amber-200 via-amber-700 to-amber-200" />
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-4 py-2.5 sm:flex sm:gap-4 sm:px-8 sm:py-3 lg:px-12">
        <a aria-label="Kopi Senja, beranda" className="group flex min-w-0 items-center gap-2.5" href="#">
          <span className="grid size-10 place-items-center rounded-2xl bg-linear-to-br from-amber-700 via-amber-800 to-stone-950 text-white shadow-md shadow-amber-950/20 ring-1 ring-amber-950/10 transition duration-300 group-hover:-rotate-3 group-hover:scale-105 sm:size-11">
            <Coffee size={21} strokeWidth={1.8} />
          </span>
          <span>
            <span className="block font-display text-[17px] font-bold leading-tight tracking-tight text-stone-900">Kopi Senja</span>
            <span className="text-[9px] font-semibold tracking-[0.16em] text-amber-800/75">BREW YOUR MOMENT</span>
          </span>
        </a>
        <label className="relative col-span-2 row-start-2 mx-0 min-w-0 w-full sm:mx-auto sm:row-auto sm:max-w-xl sm:flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-800/60 transition-colors" size={17} />
          <input
            aria-label="Cari menu"
            className="w-full rounded-full border border-stone-200/80 bg-stone-100/70 py-2.5 pl-10 pr-4 text-base text-stone-800 outline-none transition placeholder:text-stone-400 hover:border-amber-900/20 focus:border-amber-700/60 focus:bg-white focus:ring-4 focus:ring-amber-700/10 sm:text-sm"
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Cari menu favoritmu..."
            type="search"
            value={search}
          />
        </label>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            aria-label={`Favorit, ${favoriteCount} menu`}
            className="relative inline-flex size-10 items-center justify-center rounded-full border border-transparent text-stone-600 transition hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600"
            onClick={onOpenFavorites}
            title="Lihat favorit"
            type="button"
          >
            <Heart size={19} strokeWidth={1.8} />
            {favoriteCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-rose-600 px-1 text-[9px] font-bold leading-4 text-white ring-2 ring-[#fffdfa]">{favoriteCount}</span>}
          </button>
          <button
            aria-label="Riwayat transaksi"
            className="icon-button border border-transparent hover:border-stone-200"
            onClick={onOpenHistory}
            title="Riwayat transaksi"
            type="button"
          >
            <History size={19} strokeWidth={1.8} />
          </button>
          <button
            aria-label={`Keranjang, ${cartCount} item`}
            className="relative inline-flex size-10 items-center justify-center rounded-full bg-linear-to-br from-stone-900 to-stone-700 text-white shadow-md shadow-stone-900/15 transition hover:-translate-y-0.5 hover:from-amber-900 hover:to-amber-800 sm:size-11"
            onClick={onOpenCart}
            title="Keranjang"
            type="button"
          >
            <ShoppingBag size={18} strokeWidth={1.9} />
            {cartCount > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-amber-400 text-[10px] font-bold text-stone-900 ring-2 ring-[#fffdfa]">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
