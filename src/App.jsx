import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Clock3,
  Coffee,
  MapPin,
  Phone,
  Receipt,
  ShoppingBag,
  Star,
  Store,
  Tag,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
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

function getLocalDateTimeValue() {
  const now = new Date();
  now.setSeconds(0, 0);
  now.setMinutes(now.getMinutes() + 1);
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

function Modal({ title, children, onClose, wide = false, motion = "default" }) {
  const closeStarted = useRef(false);
  const motionClasses = {
    default: {
      enter: "animate-modal-enter",
      exit: "animate-modal-exit",
      exitDuration: 180,
    },
    info: {
      enter: "animate-info-enter",
      exit: "animate-info-exit",
      exitDuration: 200,
    },
    history: {
      enter: "animate-history-enter",
      exit: "animate-history-exit",
      exitDuration: 220,
    },
  };
  const selectedMotion = motionClasses[motion] ?? motionClasses.default;
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  function requestClose() {
    if (closeStarted.current) return;
    closeStarted.current = true;
    setClosing(true);
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : selectedMotion.exitDuration + 30;
    closeTimer.current = window.setTimeout(onClose, delay);
  }

  return (
    <div
      className={`${closing ? "animate-overlay-exit pointer-events-none" : "animate-overlay-enter"} fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 p-3 backdrop-blur-sm sm:p-4`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <section
        aria-label={title}
        aria-modal="true"
        className={`relative max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto rounded-[2rem] border border-white/60 bg-[#fffdfa] p-4 shadow-[0_24px_80px_rgba(27,18,11,0.28)] sm:max-h-[90vh] sm:p-7 ${wide ? "max-w-2xl" : "max-w-lg"} ${closing ? selectedMotion.exit : selectedMotion.enter}`}
        role="dialog"
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-7 top-0 h-0.5 bg-linear-to-r from-transparent via-amber-600 to-transparent"
        />
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-amber-950/10 pb-4">
          <h2 className="font-display text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
            {title}
          </h2>
          <button
            aria-label="Tutup"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-amber-100 hover:text-amber-900"
            onClick={requestClose}
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
  const { items, changeQuantity, removeFromCart, completePurchase } = useCart();
  const { notify } = useNotification();
  const closeStarted = useRef(false);
  const afterClose = useRef(null);
  const closeTimer = useRef(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);
  const [promoInput, setPromoInput] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [checkoutSummary, setCheckoutSummary] = useState(null);
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

  function requestClose(afterCloseCallback) {
    if (closeStarted.current) return;
    closeStarted.current = true;
    afterClose.current = afterCloseCallback;
    setClosing(true);
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 470;
    closeTimer.current = window.setTimeout(() => {
      onClose();
      afterClose.current?.();
      afterClose.current = null;
    }, delay);
  }

  function checkout() {
    if (!items.length || closeStarted.current) return;
    setCheckoutSummary({ items, subtotal, discount, serviceFee, total });
  }

  function confirmCheckout(fulfillment) {
    const summary = checkoutSummary;
    setCheckoutSummary(null);
    requestClose(() => {
      onCheckout({ ...summary, fulfillment });
      setPromoCode("");
      setPromoInput("");
      completePurchase();
    });
  }

  return (
    <div
      className={`${closing ? "animate-drawer-backdrop-exit pointer-events-none" : "animate-drawer-backdrop-enter"} fixed inset-0 z-40 flex justify-end bg-stone-950/50 backdrop-blur-sm`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <aside
        aria-label="Keranjang belanja"
        aria-modal="true"
        className={`${closing ? "animate-cart-exit" : "animate-cart-enter"} flex h-[100dvh] w-full max-w-md flex-col border-l border-white/30 bg-[#fffdfa] shadow-2xl`}
        role="dialog"
      >
        <div className="relative overflow-hidden border-b border-amber-900/10 bg-linear-to-br from-[#fff9ed] via-[#f7ecdc] to-[#f1e2cf] px-5 py-5 sm:px-7">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-20 size-48 rounded-full bg-amber-300/25 blur-3xl"
          />
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-800">
                <Coffee size={13} /> Pesanan kamu
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-stone-900">
                Keranjang
              </h2>
              <p className="mt-1 text-xs text-stone-500">
                {items.reduce((count, item) => count + item.quantity, 0)} item siap menemani harimu
              </p>
            </div>
            <button
              aria-label="Tutup keranjang"
              className="relative grid size-10 shrink-0 place-items-center rounded-full border border-white/70 bg-white/70 text-stone-600 transition hover:bg-white hover:text-stone-950"
              onClick={() => requestClose()}
              type="button"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5 sm:px-7">
          {!items.length ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-amber-900/15 bg-linear-to-br from-white to-amber-50/70 px-5 text-center">
              <span className="mb-4 grid size-16 place-items-center rounded-2xl bg-amber-100 text-amber-900 shadow-sm">
                <ShoppingBag size={26} />
              </span>
              <h3 className="font-display text-xl font-bold text-stone-900">
                Keranjang masih kosong
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-stone-500">
                Yuk, pilih menu favoritmu dan nikmati hari dengan lebih hangat.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <article
                className="flex gap-3 rounded-3xl border border-stone-200/70 bg-white p-3 shadow-[0_4px_16px_rgba(54,37,20,0.04)] transition hover:border-amber-200 hover:shadow-[0_8px_24px_rgba(54,37,20,0.08)]"
                key={item.id}
              >
                <div className="relative grid size-[4.5rem] shrink-0 place-items-center overflow-hidden rounded-2xl bg-amber-50 text-2xl">
                  <img
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                    onError={(event) => {
                      event.currentTarget.hidden = true;
                    }}
                    src={item.image}
                  />
                  <span className="pointer-events-none relative">
                    <MenuIcon category={item.category} size={25} />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-amber-800">
                        {item.category}
                      </p>
                      <h3 className="mt-0.5 truncate text-sm font-bold text-stone-900">
                        {item.name}
                      </h3>
                    </div>
                    <button
                      aria-label={`Hapus ${item.name}`}
                      className="grid size-8 shrink-0 place-items-center rounded-full text-stone-400 transition hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => {
                        removeFromCart(item.id);
                        notify(`${item.name} dihapus dari keranjang`);
                      }}
                      type="button"
                    >
                      <X size={15} />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 p-0.5">
                    <button
                      aria-label={`Kurangi ${item.name}`}
                      className="grid size-7 place-items-center rounded-full text-stone-600 transition hover:bg-white hover:text-amber-900"
                      onClick={() => {
                        changeQuantity(item.id, -1);
                        notify(`${item.name} diperbarui di keranjang`);
                      }}
                      type="button"
                    >
                      <span aria-hidden="true">−</span>
                    </button>
                    <span className="w-7 text-center text-xs font-bold tabular-nums text-stone-800">
                      {item.quantity}
                    </span>
                    <button
                      aria-label={`Tambah ${item.name}`}
                      className="grid size-7 place-items-center rounded-full text-stone-600 transition hover:bg-white hover:text-amber-900 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={item.quantity >= item.stock}
                      onClick={() => {
                        changeQuantity(item.id, 1);
                        notify(`${item.name} diperbarui di keranjang`);
                      }}
                      type="button"
                    >
                      <span aria-hidden="true">+</span>
                    </button>
                    </div>
                    <p className="text-right text-xs font-bold text-stone-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="max-h-[55dvh] overflow-y-auto overscroll-contain border-t border-amber-900/10 bg-white px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(54,37,20,0.04)] sm:max-h-none sm:overflow-visible sm:px-7 sm:py-5">
            <form
              className="mb-4 rounded-2xl border border-stone-100 bg-[#faf8f4] p-3.5"
              onSubmit={applyPromo}
            >
              <label
                className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500"
                htmlFor="promo-code"
              >
                <Tag size={13} className="text-amber-800" /> Kode promo
              </label>
              <div className="flex gap-2">
                <input
                  className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/10"
                  id="promo-code"
                  name="promo-code"
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
            <div className="space-y-2.5 rounded-2xl border border-stone-100 bg-[#faf8f4] p-4 text-sm">
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
              <div className="flex justify-between border-t border-dashed border-stone-300 pt-3 text-base font-bold text-stone-900">
                <span>Total pembayaran</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <button
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-amber-800 to-amber-900 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-900/15 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-900/20 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!items.length}
              onClick={checkout}
              type="button"
            >
              Lanjutkan pemesanan <ArrowUpRight size={17} />
            </button>
            <p className="mt-3 text-center text-[11px] text-stone-400">
              HEMAT50 memotong Rp50.000 dari total belanja.
            </p>
          </div>
        )}
      </aside>
      {checkoutSummary && (
        <CheckoutModal
          onClose={() => setCheckoutSummary(null)}
          onSubmit={confirmCheckout}
          summary={checkoutSummary}
        />
      )}
    </div>
  );
}

function CheckoutModal({ onClose, onSubmit, summary }) {
  const [method, setMethod] = useState("pickup");
  const [schedule, setSchedule] = useState("asap");
  const [scheduledAt, setScheduledAt] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [validationError, setValidationError] = useState("");
  const [minimumDateTime, setMinimumDateTime] = useState(
    getLocalDateTimeValue,
  );

  function submit(event) {
    event.preventDefault();
    if (
      !customerName.trim() ||
      !phone.trim() ||
      (method === "delivery" && !address.trim())
    ) {
      setValidationError("Lengkapi detail pemesanan dengan informasi yang valid.");
      return;
    }
    if (
      schedule === "scheduled" &&
      new Date(scheduledAt).getTime() < Date.now()
    ) {
      setValidationError("Pilih waktu pemesanan yang belum terlewati.");
      return;
    }
    setValidationError("");
    onSubmit({
      method,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: method === "delivery" ? address.trim() : "",
      scheduledAt: schedule === "scheduled" ? scheduledAt : "",
    });
  }

  return (
    <Modal onClose={onClose} title="Detail pemesanan" wide>
      <form className="space-y-5" onSubmit={submit}>
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-stone-800">
            Cara menerima pesanan
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "pickup", label: "Pickup", Icon: Store },
              { value: "delivery", label: "Delivery", Icon: MapPin },
            ].map(({ value, label, Icon }) => (
              <label
                className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border p-3 transition ${method === value ? "border-amber-700 bg-amber-50 text-amber-900" : "border-stone-200 bg-white text-stone-600 hover:border-amber-300"}`}
                key={value}
              >
                <input
                  checked={method === value}
                  className="sr-only"
                  name="fulfillment-method"
                  onChange={() => setMethod(value)}
                  type="radio"
                  value={value}
                />
                <Icon aria-hidden="true" className="pointer-events-none" size={18} />
                <span className="text-sm font-semibold">{label}</span>
              </label>
            ))}
          </div>
          {method === "delivery" && (
            <p className="mt-2 text-xs leading-5 text-stone-500">
              Biaya antar belum diterapkan pada versi ini.
            </p>
          )}
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-stone-700">
            Nama pemesan
            <span className="relative mt-1.5 block">
              <UserRound
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                size={16}
              />
              <input
                autoComplete="name"
                className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-3 text-sm font-normal outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10"
                maxLength={80}
                onChange={(event) => {
                  setCustomerName(event.target.value);
                  setValidationError("");
                }}
                required
                value={customerName}
              />
            </span>
          </label>
          <label className="block text-sm font-semibold text-stone-700">
            Nomor WhatsApp
            <span className="relative mt-1.5 block">
              <Phone
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                size={16}
              />
              <input
                autoComplete="tel"
                className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-3 text-sm font-normal outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10"
                maxLength={20}
                minLength={8}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setValidationError("");
                }}
                placeholder="08xxxxxxxxxx"
                required
                type="tel"
                value={phone}
              />
            </span>
          </label>
        </div>

        {method === "delivery" && (
          <label className="block text-sm font-semibold text-stone-700">
            Alamat pengantaran
            <textarea
              autoComplete="street-address"
              className="mt-1.5 min-h-24 w-full resize-y rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-normal outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10"
              maxLength={300}
              minLength={10}
              onChange={(event) => {
                setAddress(event.target.value);
                setValidationError("");
              }}
              placeholder="Nama jalan, nomor, kecamatan, dan patokan"
              required
              value={address}
            />
          </label>
        )}

        <fieldset>
          <legend className="mb-2 text-sm font-bold text-stone-800">
            Waktu pesanan
          </legend>
          <div className="flex flex-wrap gap-2">
            <label
              className={`cursor-pointer rounded-full border px-3 py-2 text-xs font-semibold transition ${schedule === "asap" ? "border-amber-700 bg-amber-50 text-amber-900" : "border-stone-200 text-stone-600 hover:border-amber-300"}`}
            >
              <input
                checked={schedule === "asap"}
                className="sr-only"
                name="order-schedule"
                onChange={() => setSchedule("asap")}
                type="radio"
              />
              Secepatnya
            </label>
            <label
              className={`cursor-pointer rounded-full border px-3 py-2 text-xs font-semibold transition ${schedule === "scheduled" ? "border-amber-700 bg-amber-50 text-amber-900" : "border-stone-200 text-stone-600 hover:border-amber-300"}`}
            >
              <input
                checked={schedule === "scheduled"}
                className="sr-only"
                name="order-schedule"
                onChange={() => {
                  setMinimumDateTime(getLocalDateTimeValue());
                  setSchedule("scheduled");
                }}
                type="radio"
              />
              Jadwalkan
            </label>
          </div>
          {schedule === "scheduled" && (
            <input
              aria-label="Tanggal dan waktu pesanan"
              className="mt-3 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10"
              min={minimumDateTime}
              onChange={(event) => setScheduledAt(event.target.value)}
              required
              type="datetime-local"
              value={scheduledAt}
            />
          )}
        </fieldset>

        {validationError && (
          <p aria-live="polite" className="text-sm text-red-700" role="alert">
            {validationError}
          </p>
        )}
        <div className="flex items-center justify-between rounded-2xl bg-[#faf8f4] px-4 py-3">
          <span className="text-sm font-semibold text-stone-600">
            Total pesanan
          </span>
          <span className="font-bold text-stone-900">
            {formatPrice(summary.total)}
          </span>
        </div>
        <button
          className="flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-amber-800 to-amber-900 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-900/15 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-900/20"
          type="submit"
        >
          Konfirmasi pesanan <ArrowUpRight aria-hidden="true" size={17} />
        </button>
      </form>
    </Modal>
  );
}

function ProductModal({ availableStock, product, reviews, onClose, onAddReview }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { notify } = useNotification();
  const productReviews = reviews[product.id] ?? [];
  const recentReviews = productReviews.slice(0, 3);
  const averageRating = productReviews.length
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) /
      productReviews.length
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
    <Modal motion="info" onClose={onClose} title={product.name} wide>
      <div className="grid gap-5 sm:grid-cols-[0.95fr_1.05fr] sm:gap-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-amber-900/10 bg-linear-to-br from-amber-100 to-stone-100 sm:aspect-auto sm:min-h-64">
          <span className="pointer-events-none absolute inset-0 z-10 grid place-items-center text-amber-800/50">
            <MenuIcon category={product.category} size={52} />
          </span>
          <img
            alt={product.name}
            className="absolute inset-0 size-full object-cover"
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
            src={product.image}
          />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-linear-to-t from-stone-950/45 to-transparent" />
          <span className="absolute left-3 top-3 z-20 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-700 shadow-sm backdrop-blur">
            {product.category}
          </span>
          <span className={`absolute bottom-3 left-3 z-20 rounded-full px-3 py-1.5 text-[10px] font-bold shadow-sm ${availableStock > 5 ? "bg-emerald-500 text-white" : availableStock > 0 ? "bg-amber-400 text-stone-950" : "bg-rose-600 text-white"}`}>
            {availableStock > 0 ? `${availableStock} stok tersedia` : "Stok habis"}
          </span>
        </div>
        <div className="flex flex-col justify-center">
          <div className="rounded-2xl border border-amber-900/10 bg-linear-to-br from-amber-50 to-[#fffaf2] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800">
              Harga menu
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-stone-900">
              {formatPrice(product.price)}
            </p>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            {product.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-stone-500">
            <span className="flex items-center gap-1.5 rounded-full border border-amber-900/5 bg-amber-50 px-3 py-2 font-semibold text-amber-900">
              <Star fill="currentColor" size={12} /> {averageRating.toFixed(1)}{" "}
              <span className="font-medium text-amber-800/70">rating</span>
            </span>
            <span
              aria-live="polite"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 font-semibold ${availableStock > 5 ? "bg-emerald-50 text-emerald-700" : availableStock > 0 ? "bg-amber-50 text-amber-800" : "bg-rose-50 text-rose-700"}`}
            >
              <ShoppingBag size={12} />
              Stok tersedia: {availableStock}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-7 border-t border-amber-950/10 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800">
              Cerita pelanggan
            </p>
            <h3 className="mt-1 font-display text-lg font-bold text-stone-900">
              Ulasan pelanggan
            </h3>
          </div>
          <span className="rounded-full bg-stone-100 px-3 py-1.5 text-[10px] font-semibold text-stone-500">
            {productReviews.length} ulasan
          </span>
        </div>
        {recentReviews.length ? (
          <div className="mb-5 space-y-3">
            {recentReviews.map((review) => (
              <article
                className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-[0_4px_16px_rgba(54,37,20,0.035)]"
                key={review.id}
              >
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
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-dashed border-amber-900/15 bg-amber-50/60 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-amber-700 shadow-sm">
              <Star size={17} />
            </span>
            <p className="text-sm leading-5 text-stone-600">
              Belum ada ulasan. Jadilah yang pertama memberi komentar!
            </p>
          </div>
        )}
        <form
          className="rounded-3xl border border-stone-200/70 bg-[#faf8f4] p-4 sm:p-5"
          onSubmit={submitReview}
        >
          <label
            className="mb-3 block text-sm font-bold text-stone-800"
            htmlFor="review-comment"
          >
            Bagikan pengalamanmu
          </label>
          <div aria-label="Pilih rating" className="mb-3 flex gap-1.5">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                aria-label={`${value} bintang`}
                aria-pressed={rating === value}
                className={`grid size-9 place-items-center rounded-xl transition ${rating >= value ? "bg-amber-100 text-amber-600" : "bg-white text-stone-300 hover:bg-amber-50 hover:text-amber-500"}`}
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
            id="review-comment"
            name="review-comment"
            className="min-h-24 w-full resize-y rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10"
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
              className="rounded-full bg-amber-800 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-40"
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
    <Modal motion="history" onClose={onClose} title="Riwayat transaksi" wide>
      {orders.length ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              className="overflow-hidden rounded-3xl border border-stone-200/70 bg-white shadow-[0_6px_24px_rgba(54,37,20,0.05)]"
              key={order.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-linear-to-r from-[#fffaf0] to-white px-4 py-4 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-900">
                    <Receipt size={19} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-800">
                      Pesanan #{order.id.slice(-6)}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      {new Date(order.date).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  <Check size={13} strokeWidth={2.5} />
                  Diterima
                </span>
              </div>
              <div className="space-y-2 px-4 py-4 sm:px-5">
                {order.fulfillment && (
                  <div className="mb-4 rounded-2xl border border-amber-900/10 bg-amber-50/60 p-3.5">
                    <p className="flex items-center gap-2 text-sm font-bold text-stone-800">
                      {order.fulfillment.method === "delivery" ? (
                        <MapPin aria-hidden="true" size={16} />
                      ) : (
                        <Store aria-hidden="true" size={16} />
                      )}
                      {order.fulfillment.method === "delivery"
                        ? "Delivery"
                        : "Pickup"}
                    </p>
                    <p className="mt-1 text-xs text-stone-600">
                      {order.fulfillment.customerName} · {order.fulfillment.phone}
                    </p>
                    {order.fulfillment.address && (
                      <p className="mt-1 text-xs leading-5 text-stone-600">
                        {order.fulfillment.address}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-stone-500">
                      Waktu:{" "}
                      {order.fulfillment.scheduledAt
                        ? new Date(order.fulfillment.scheduledAt).toLocaleString(
                            "id-ID",
                            { dateStyle: "medium", timeStyle: "short" },
                          )
                        : "Secepatnya"}
                    </p>
                  </div>
                )}
                {order.items.map((item) => (
                  <div
                    className="flex items-center justify-between gap-3 text-sm"
                    key={item.id}
                  >
                    <span className="min-w-0 truncate text-stone-600">
                      <strong className="mr-2 text-stone-900">
                        {item.quantity}×
                      </strong>
                      {item.name}
                    </span>
                    <span className="shrink-0 font-medium text-stone-700">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-[#faf8f4] px-4 py-3">
                  <span className="text-xs font-semibold text-stone-500">
                    Total belanja
                  </span>
                  <span className="font-bold text-stone-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </article>
          ))}
          <button
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50"
            onClick={onReset}
            type="button"
          >
            <Trash2 size={16} />
            Hapus riwayat transaksi
          </button>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-amber-900/15 bg-linear-to-br from-white to-amber-50/60 px-5 py-12 text-center">
          <span className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-amber-100 text-amber-900 shadow-sm">
            <Clock3 size={24} />
          </span>
          <h3 className="font-display text-xl font-bold text-stone-900">
            Belum ada transaksi
          </h3>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-stone-500">
            Pesanan yang sudah dikonfirmasi akan tersimpan di sini.
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
  const { items: cartItems, availableStocks, addToCart } = useCart();
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
    notify("Pesanan berhasil dibuat! Pesananmu sedang disiapkan.");
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
          availableStocks={availableStocks}
          favoriteCount={favorites.length}
          items={filteredItems}
          onAddToCart={(product, quantity) => {
            if (!addToCart(product, quantity)) {
              const availableStock = availableStocks[product.id] ?? 0;
              notify(
                availableStock > 0
                  ? `Stok ${product.name} tersisa ${availableStock}`
                  : `Stok ${product.name} sudah habis`,
              );
              return false;
            }
            notify(`${quantity} ${product.name} ditambahkan ke keranjang`);
            return true;
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
          availableStock={availableStocks[selectedProduct.id] ?? selectedProduct.stock}
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
