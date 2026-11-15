import { useMemo, useState } from "react";
import { ArrowUpRight, Clock3, ShoppingBag, Star, X } from "lucide-react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import MainContent from "./components/MainContent.jsx";
import MenuIcon from "./components/MenuIcon.jsx";
import CartProvider from "./context/CartProvider.jsx";
import ToastProvider from "./context/ToastProvider.jsx";
import NotificationProvider from "./context/NotificationProvider.jsx";
import { useCart } from "./hooks/useCart.jsx";
import { useNotification } from "./hooks/useNotification.jsx";
import menuItems from "./data/menu.jsx";
import { useLocalStorage } from "./hooks/useLocalStorage.jsx";
import {
  calculateDiscount,
  calculateServiceFee,
  calculateSubtotal,
  calculateTotal,
  formatPrice,
  isValidPromo,
} from "./utils/price.jsx";

function Modal({ title, children, onClose, wide = false }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-label={title}
        aria-modal="true"
        className={`max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7 ${wide ? "max-w-2xl" : "max-w-lg"}`}
        role="dialog"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-stone-900 sm:text-2xl">
            {title}
          </h2>
          <button
            aria-label="Tutup"
            className="icon-button"
            onClick={onClose}
            type="button"
          >
            <X size={19} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function CartDrawer({ onClose, onCheckout }) {
  const { items, changeQuantity, removeFromCart, clearCart } = useCart();
  const { notify } = useNotification();
  const [promoInput, setPromoInput] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(subtotal, promoCode);
  const serviceFee = calculateServiceFee(subtotal);
  const total = calculateTotal(subtotal, discount, serviceFee);

  function applyPromo(event) {
    event.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (isValidPromo(code)) {
      setPromoCode(code);
      setPromoError("");
      notify(`Kode promo ${code} berhasil digunakan`);
      return;
    }
    const message = "Kode promo tidak valid.";
    setPromoError(message);
    notify(message);
  }

  function checkout() {
    if (!items.length) return;
    onCheckout({ items, subtotal, discount, serviceFee, total });
    setPromoCode("");
    setPromoInput("");
    clearCart();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-stone-950/45 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        aria-label="Keranjang belanja"
        aria-modal="true"
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
              Pesanan kamu
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-stone-900">
              Keranjang
            </h2>
          </div>
          <button
            aria-label="Tutup keranjang"
            className="icon-button"
            onClick={onClose}
            type="button"
          >
            <X size={19} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-7">
          {!items.length ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
              <span className="mb-4 grid size-16 place-items-center rounded-full bg-amber-50 text-amber-800">
                <ShoppingBag size={26} />
              </span>
              <h3 className="font-display text-lg font-bold text-stone-900">
                Keranjang masih kosong
              </h3>
              <p className="mt-1 max-w-xs text-sm leading-6 text-stone-500">
                Yuk, pilih menu favoritmu dan nikmati hari dengan lebih hangat.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <article
                className="flex gap-3 rounded-2xl border border-stone-100 p-3"
                key={item.id}
              >
                <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-amber-50 text-2xl">
                  <img
                    alt=""
                    className="size-full object-cover"
                    onError={(event) => {
                      event.currentTarget.hidden = true;
                    }}
                    src={item.image}
                  />
                  <span className="-mt-16">
                    <MenuIcon category={item.category} size={25} />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-stone-900">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-amber-800">
                    {formatPrice(item.price)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      aria-label={`Kurangi ${item.name}`}
                      className="quantity-button"
                      onClick={() => {
                        changeQuantity(item.id, -1);
                        notify(`${item.name} diperbarui di keranjang`);
                      }}
                      type="button"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      aria-label={`Tambah ${item.name}`}
                      className="quantity-button"
                      disabled={item.quantity >= item.stock}
                      onClick={() => {
                        changeQuantity(item.id, 1);
                        notify(`${item.name} diperbarui di keranjang`);
                      }}
                      type="button"
                    >
                      +
                    </button>
                    <button
                      aria-label={`Hapus ${item.name}`}
                      className="ml-auto p-1 text-xs font-medium text-stone-400 hover:text-red-600"
                      onClick={() => {
                        removeFromCart(item.id);
                        notify(`${item.name} dihapus dari keranjang`);
                      }}
                      type="button"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-stone-100 px-5 py-5 sm:px-7">
            <form className="mb-4" onSubmit={applyPromo}>
              <label
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-500"
                htmlFor="promo-code"
              >
                Kode promo
              </label>
              <div className="flex gap-2">
                <input
                  className="min-w-0 flex-1 rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/10"
                  id="promo-code"
                  onChange={(event) => setPromoInput(event.target.value)}
                  placeholder="DISKON10 / HEMAT50"
                  value={promoInput}
                />
                <button
                  className="rounded-xl bg-stone-900 px-4 text-sm font-semibold text-white transition hover:bg-amber-900"
                  type="submit"
                >
                  Pakai
                </button>
              </div>
              {promoError && (
                <p className="mt-2 text-xs text-red-600">{promoError}</p>
              )}
              {promoCode && (
                <p className="mt-2 text-xs font-medium text-emerald-700">
                  Promo {promoCode} aktif
                </p>
              )}
            </form>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Biaya layanan (10%)</span>
                <span>{formatPrice(serviceFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-medium text-emerald-700">
                  <span>Diskon</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-dashed border-stone-200 pt-3 text-base font-bold text-stone-900">
                <span>Total pembayaran</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <button
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-amber-800 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!items.length}
              onClick={checkout}
              type="button"
            >
              Bayar sekarang <ArrowUpRight size={17} />
            </button>
            <p className="mt-3 text-center text-[11px] text-stone-400">
              HEMAT50 memotong Rp50.000 dari total belanja.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

function ProductModal({ product, reviews, onClose, onAddReview }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { notify } = useNotification();
  const recentReviews = (reviews[product.id] ?? []).slice(0, 3);
  const averageRating = recentReviews.length
    ? recentReviews.reduce((sum, review) => sum + review.rating, 0) /
      recentReviews.length
    : product.rating;

  function submitReview(event) {
    event.preventDefault();
    const text = comment.trim();
    if (text.length < 3) {
      notify("Komentar minimal 3 karakter");
      return;
    }
    onAddReview(product.id, {
      id: `${Date.now()}`,
      rating,
      text,
      date: new Date().toISOString(),
    });
    setComment("");
    setRating(5);
  }

  return (
    <Modal onClose={onClose} title={product.name} wide>
      <div className="grid gap-6 sm:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-52 overflow-hidden rounded-2xl bg-amber-50">
          <span className="absolute inset-0 grid place-items-center text-amber-800/50">
            <MenuIcon category={product.category} size={52} />
          </span>
          <img
            alt={product.name}
            className="relative size-full min-h-52 object-cover"
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
            src={product.image}
          />
        </div>
        <div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
            {product.category}
          </span>
          <p className="mt-4 text-2xl font-bold text-stone-900">
            {formatPrice(product.price)}
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            {product.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-stone-500">
            <span className="flex items-center gap-1 rounded-lg bg-stone-100 px-2.5 py-1.5">
              <Star fill="currentColor" size={12} /> {averageRating.toFixed(1)}{" "}
              rating
            </span>
            <span className="rounded-lg bg-stone-100 px-2.5 py-1.5">
              {product.stock} tersedia
            </span>
          </div>
        </div>
      </div>

      <div className="mt-7 border-t border-stone-100 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-stone-900">
            Ulasan pelanggan
          </h3>
          <span className="text-xs text-stone-400">
            Terbaru · maks. 3 ditampilkan
          </span>
        </div>
        {recentReviews.length ? (
          <div className="mb-5 space-y-3">
            {recentReviews.map((review) => (
              <article className="rounded-xl bg-stone-50 p-3" key={review.id}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-stone-800">
                    Pelanggan Kopi
                  </span>
                  <span
                    aria-label={`${review.rating} dari 5 bintang`}
                    className="flex text-amber-600"
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        className={index < review.rating ? "fill-current" : ""}
                        key={index}
                        size={12}
                      />
                    ))}
                  </span>
                </div>
                <p className="mt-1 text-sm text-stone-600">{review.text}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mb-5 text-sm text-stone-500">
            Belum ada ulasan. Jadilah yang pertama memberi komentar!
          </p>
        )}
        <form className="rounded-2xl bg-[#faf8f4] p-4" onSubmit={submitReview}>
          <label className="mb-2 block text-sm font-semibold text-stone-800">
            Tulis komentar
          </label>
          <div aria-label="Pilih rating" className="mb-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                aria-label={`${value} bintang`}
                aria-pressed={rating === value}
                className={`rounded-md p-1 ${rating >= value ? "text-amber-500" : "text-stone-300"}`}
                key={value}
                onClick={() => setRating(value)}
                type="button"
              >
                <Star
                  fill={rating >= value ? "currentColor" : "none"}
                  size={18}
                />
              </button>
            ))}
          </div>
          <textarea
            className="min-h-20 w-full resize-y rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/10"
            maxLength={240}
            minLength={3}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Bagikan pengalamanmu (min. 3 karakter)..."
            value={comment}
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-stone-400">
              {comment.length}/240 karakter
            </span>
            <button
              className="rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={comment.trim().length < 3}
              type="submit"
            >
              Kirim komentar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function HistoryModal({ orders, onClose, onReset }) {
  return (
    <Modal onClose={onClose} title="Riwayat transaksi" wide>
      {orders.length ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <article
              className="rounded-2xl border border-stone-100 p-4 sm:p-5"
              key={order.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-stone-400">
                    {new Date(order.date).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <h3 className="mt-1 font-semibold text-stone-900">
                    {order.items
                      .map((item) => `${item.quantity}× ${item.name}`)
                      .join(", ")}
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Lunas
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-dashed border-stone-200 pt-3">
                <span className="text-sm text-stone-500">Total belanja</span>
                <span className="font-bold text-stone-900">
                  {formatPrice(order.total)}
                </span>
              </div>
            </article>
          ))}
          <button
            className="mt-3 w-full rounded-full border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            onClick={onReset}
            type="button"
          >
            Hapus riwayat transaksi
          </button>
        </div>
      ) : (
        <div className="py-10 text-center">
          <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-stone-100 text-stone-500">
            <Clock3 size={22} />
          </span>
          <h3 className="font-semibold text-stone-900">Belum ada transaksi</h3>
          <p className="mt-1 text-sm text-stone-500">
            Pesanan yang sudah dibayar akan tersimpan di sini.
          </p>
        </div>
      )}
    </Modal>
  );
}

function ConfirmModal({
  title,
  description,
  onCancel,
  onConfirm,
  confirmLabel = "Ya, lanjutkan",
}) {
  return (
    <Modal onClose={onCancel} title={title}>
      <p className="text-sm leading-6 text-stone-600">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          className="rounded-full border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
          onClick={onCancel}
          type="button"
        >
          Batal
        </button>
        <button
          className="rounded-full bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
          onClick={onConfirm}
          type="button"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

function AppContent() {
  const [favorites, setFavorites] = useLocalStorage("kopi-senja:favorites", []);
  const [favoriteDates, setFavoriteDates] = useLocalStorage(
    "kopi-senja:favorite-dates",
    {},
  );
  const [reviews, setReviews] = useLocalStorage("kopi-senja:reviews", {});
  const [orders, setOrders] = useLocalStorage("kopi-senja:orders", []);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [collection, setCollection] = useState("all");
  const [sortMode, setSortMode] = useState("newest");
  const [cartOpen, setCartOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const { items: cartItems, addToCart } = useCart();
  const { notify } = useNotification();

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("id-ID");
    let result = menuItems.filter((item) => {
      const matchesCategory =
        category === "Semua" || item.category === category;
      const matchesSearch =
        !normalizedSearch ||
        `${item.name} ${item.category} ${item.description}`
          .toLocaleLowerCase("id-ID")
          .includes(normalizedSearch);
      const matchesCollection =
        collection !== "favorites" || favorites.includes(item.id);
      return matchesCategory && matchesSearch && matchesCollection;
    });
    if (collection === "favorites") {
      result = [...result].sort((a, b) =>
        sortMode === "popular"
          ? b.rating - a.rating
          : (favoriteDates[b.id] ?? 0) - (favoriteDates[a.id] ?? 0),
      );
    }
    return result;
  }, [category, collection, favoriteDates, favorites, search, sortMode]);

  function toggleFavorite(product) {
    const isFavorite = favorites.includes(product.id);
    setFavorites((current) =>
      isFavorite
        ? current.filter((id) => id !== product.id)
        : [...current, product.id],
    );
    if (isFavorite) {
      setFavoriteDates((current) => {
        const next = { ...current };
        delete next[product.id];
        return next;
      });
    } else {
      setFavoriteDates((current) => ({ ...current, [product.id]: Date.now() }));
    }
    notify(
      isFavorite
        ? `${product.name} dihapus dari favorit`
        : `${product.name} masuk ke favorit`,
    );
  }

  function placeOrder(summary) {
    const newOrder = {
      ...summary,
      id: `${Date.now()}`,
      date: new Date().toISOString(),
    };
    setOrders((current) => [newOrder, ...current]);
    notify("Pembayaran berhasil! Pesananmu sedang disiapkan.");
    setHistoryOpen(true);
  }

  function addReview(productId, review) {
    setReviews((current) => ({
      ...current,
      [productId]: [review, ...(current[productId] ?? [])],
    }));
    notify("Terima kasih, komentarmu berhasil dikirim!");
  }

  function resetHistory() {
    setOrders([]);
    setConfirmReset(false);
    setHistoryOpen(false);
    notify("Riwayat transaksi berhasil dihapus");
  }

  return (
    <div className="min-h-screen bg-[#faf8f4] text-stone-800">
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        favoriteCount={favorites.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenFavorites={() => {
          setCollection("favorites");
          setCategory("Semua");
          document
            .getElementById("menu")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenHistory={() => setHistoryOpen(true)}
        onSearch={setSearch}
        search={search}
      />
      <main>
        <MainContent
          activeCollection={collection}
          category={category}
          favoriteCount={favorites.length}
          items={filteredItems}
          onAddToCart={(product) => {
            const existing = cartItems.find((item) => item.id === product.id);
            if (existing?.quantity >= product.stock) {
              notify("Stok menu ini sudah habis");
              return;
            }
            addToCart(product);
            notify(`${product.name} ditambahkan ke keranjang`);
          }}
          onCategoryChange={setCategory}
          onCollectionChange={setCollection}
          onFavorite={toggleFavorite}
          favorites={favorites}
          onOpenProduct={setSelectedProduct}
          onSortChange={setSortMode}
          sortMode={sortMode}
        />
      </main>
      <Footer />
      {cartOpen && (
        <CartDrawer
          onCheckout={placeOrder}
          onClose={() => setCartOpen(false)}
        />
      )}
      {historyOpen && (
        <HistoryModal
          onClose={() => setHistoryOpen(false)}
          onReset={() => setConfirmReset(true)}
          orders={orders}
        />
      )}
      {selectedProduct && (
        <ProductModal
          onAddReview={addReview}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          reviews={reviews}
        />
      )}
      {confirmReset && (
        <ConfirmModal
          confirmLabel="Hapus riwayat"
          description="Semua riwayat transaksi akan dihapus dari perangkat ini. Tindakan ini tidak dapat dibatalkan."
          onCancel={() => setConfirmReset(false)}
          onConfirm={resetHistory}
          title="Hapus riwayat transaksi?"
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <NotificationProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </NotificationProvider>
    </ToastProvider>
  );
}

export default App;
