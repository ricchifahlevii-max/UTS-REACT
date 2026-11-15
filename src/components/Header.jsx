import { Coffee, Heart, History, Search, ShoppingBag } from 'lucide-react'

export default function Header({ cartCount, favoriteCount, onOpenCart, onOpenFavorites, onOpenHistory, onSearch, search }) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#faf8f4]/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-8 lg:px-12">
        <a aria-label="Kopi Senja, beranda" className="flex shrink-0 items-center gap-2.5" href="#">
          <span className="grid size-10 place-items-center rounded-2xl bg-amber-800 text-white"><Coffee size={20} /></span>
          <span className="hidden sm:block"><span className="block font-display text-base font-bold leading-tight text-stone-900">Kopi Senja</span><span className="text-[10px] tracking-wide text-stone-500">BREW YOUR MOMENT</span></span>
        </a>
        <label className="relative mx-auto w-full max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
          <input className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/10" onChange={(event) => onSearch(event.target.value)} placeholder="Cari menu favoritmu..." type="search" value={search} />
        </label>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button aria-label={`Favorit, ${favoriteCount} menu`} className="icon-button relative" onClick={onOpenFavorites} title="Lihat favorit" type="button">
            <Heart size={19} />
            {favoriteCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-rose-600 px-1 text-[9px] font-bold leading-4 text-white">{favoriteCount}</span>}
          </button>
          <button aria-label="Riwayat transaksi" className="icon-button hidden sm:inline-flex" onClick={onOpenHistory} title="Riwayat transaksi" type="button"><History size={19} /></button>
          <button aria-label={`Keranjang, ${cartCount} item`} className="relative inline-flex size-10 items-center justify-center rounded-full bg-stone-900 text-white transition hover:bg-amber-900" onClick={onOpenCart} title="Keranjang" type="button">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-amber-400 text-[10px] font-bold text-stone-900">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
