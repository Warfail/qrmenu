"use client";

import { useState } from "react";
import {
  IconX,
  IconPlus,
  IconMinus,
  IconTrash,
  IconCheck,
} from "@tabler/icons-react";

function formatIDR(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function OrderSheet({
  open,
  onClose,
  cartItems,
  onAdd,
  onRemove,
  onClear,
  setVariant,
  subtotal,
}) {
  const [step, setStep] = useState("cart"); // "cart" | "receipt"
  const [orderMeta, setOrderMeta] = useState({ id: "", date: "" });

  if (!open) return null;

  function handleConfirm() {
    const now = new Date();
    const day = `${String(now.getFullYear()).slice(2)}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const rand = String(Math.floor(1000 + Math.random() * 9000));
    setOrderMeta({
      id: `RF-${day}-${rand}`,
      date: now.toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    });
    setStep("receipt");
  }

  function handleDone() {
    onClear();
    onClose();
    setTimeout(() => setStep("cart"), 250);
  }

  function handleClose() {
    onClose();
    setTimeout(() => setStep("cart"), 250);
  }

  // ---------- CART STEP ----------
  if (step === "cart") {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <div
          className="absolute bottom-0 left-1/2 w-full max-w-[480px] -translate-x-1/2 animate-slide-up rounded-t-3xl border border-b-0 border-[#f48149]/40 bg-[#121216] p-6 pb-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#2a2a35]" />

          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#f48149]">
                Rooftop Fourtyfive.
              </p>
              <h2 className="text-[17px] font-extrabold leading-tight text-[#f3e3c7] [letter-spacing:-0.85px]">
                Your Order
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Tutup"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2a2a2a] text-[#aaaaaa] transition hover:text-[#f3e3c7]"
            >
              <IconX size={16} />
            </button>
          </div>

          {/* Items */}
          <div className="max-h-[45vh] space-y-3 overflow-y-auto pr-1">
            {cartItems.map(({ product, variant, qty }) => {
              const displayName = variant
                ? product.name.replace(/ (Hot|Ice)$/, "")
                : product.name;
              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-[#f48048]/40 bg-[#18181e] p-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[17px] font-extrabold leading-tight text-[#f3e3c7] [letter-spacing:-0.85px]">
                        {displayName}
                      </p>
                      {product.variants &&
                        Object.keys(product.variants).length > 0 && (
                        <div className="mt-1.5 inline-flex items-center gap-1 rounded-lg border border-[#2a2a35] bg-[#22222b] p-0.5">
                          {["HOT", "ICE"].map((v) => {
                            const available = !!product.variants[v];
                            if (!available) return null;
                            const active = variant === v;
                            return (
                              <button
                                key={v}
                                type="button"
                                onClick={() =>
                                  setVariant && setVariant(product.id, v)
                                }
                                className={`rounded-md px-3 py-1 text-[11px] font-bold uppercase tracking-wide transition ${
                                  active
                                    ? "bg-[#f48149] text-[#f3e3c7]"
                                    : "text-zinc-400 hover:text-[#f3e3c7]"
                                }`}
                              >
                                {v === "HOT" ? "Hot" : "Ice"}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <p className="shrink-0 text-[17px] font-extrabold text-[#f48149] [letter-spacing:-0.85px]">
                      {formatIDR(product.price * qty)}
                    </p>
                  </div>
                  {product.code && (
                    <p className="mt-0.5 text-[11px] text-zinc-500">
                      {product.code}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-lg border border-[#f48149] bg-[#22222b] px-2.5 py-1.5">
                      <button
                        type="button"
                        aria-label="Kurangi"
                        onClick={() => onRemove(product.id)}
                        className="text-[#f3e3c7] transition hover:text-[#f48149]"
                      >
                        <IconMinus size={14} />
                      </button>
                      <span className="min-w-[16px] text-center text-[13px] font-bold text-[#f3e3c7]">
                        {qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Tambah"
                        onClick={() => onAdd(product)}
                        className="text-[#f48149] transition hover:text-[#f48149]"
                      >
                        <IconPlus size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(product.id)}
                      className="flex items-center gap-1 text-[11px] text-zinc-500 transition hover:text-red-400"
                    >
                      <IconTrash size={13} />
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="mt-4 border-t border-dashed border-[#f48149]/40 pt-4">
            <div className="flex items-center justify-between text-[12px] font-medium text-zinc-400 [letter-spacing:-0.5px]">
              <span>Subtotal</span>
              <span>{formatIDR(subtotal)}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[17px] font-extrabold text-[#f3e3c7] [letter-spacing:-0.85px]">
              <span>Total</span>
              <span className="text-[#f48149]">{formatIDR(subtotal)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="mt-4 w-full rounded-2xl bg-[#f48149] px-4 py-4 text-[17px] font-extrabold text-[#f3e3c7] [letter-spacing:-0.85px] transition hover:brightness-110 active:scale-[0.99]"
          >
            Confirm Order
          </button>
        </div>
      </div>
    );
  }

  // ---------- RECEIPT STEP ----------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[340px] animate-fade-in rounded-3xl bg-[#1e1e1e] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
        <div className="mb-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15">
            <IconCheck size={28} className="text-green-500" />
          </div>
          <h2 className="mt-3 text-[17px] font-extrabold text-[#f3e3c7] [letter-spacing:-0.85px]">
            Order Confirmed
          </h2>
          <p className="mt-1 text-xs font-medium text-[#f48149] [letter-spacing:-0.5px]">
            {orderMeta.id} • {orderMeta.date}
          </p>
        </div>

        {/* Receipt */}
        <div className="rounded-2xl border border-[#f48149]/40 bg-[#18181e] p-4">
          <div className="mb-3 text-center">
            <p className="text-[13px] font-bold text-[#f3e3c7]">
              ROOFTOP<span className="font-medium">FORTYFIVE</span>.
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-[#f48149]">
              Payment Receipt
            </p>
          </div>

          <div className="space-y-2">
            {cartItems.map(({ product, variant, qty }) => {
              const displayName = variant
                ? product.name.replace(/ (Hot|Ice)$/, "")
                : product.name;
              return (
                <div
                  key={product.id}
                  className="flex items-start justify-between gap-2 text-[13px]"
                >
                  <p className="min-w-0 flex-1 text-[#f3e3c7]">
                    {displayName}
                    {variant && (
                      <span className="text-[10px] font-semibold uppercase text-zinc-400">
                        {" "}· {variant === "HOT" ? "Hot" : "Ice"}
                      </span>
                    )}{" "}
                    <span className="text-zinc-500">×{qty}</span>
                  </p>
                  <p className="shrink-0 text-[#f3e3c7]">
                    {formatIDR(product.price * qty)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="my-3 border-t border-dashed border-[#f48149]/40" />

          <div className="flex items-center justify-between text-[12px] font-medium text-zinc-400 [letter-spacing:-0.5px]">
            <span>Subtotal</span>
            <span>{formatIDR(subtotal)}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[17px] font-extrabold text-[#f3e3c7] [letter-spacing:-0.85px]">
            <span>Total</span>
            <span className="text-[#f48149]">{formatIDR(subtotal)}</span>
          </div>
        </div>

        <p className="mt-4 text-center text-[12px] font-medium leading-relaxed text-zinc-400 [letter-spacing:-0.5px]">
          Tunjukkan pesanan ini ke mas/mba kasir biar langsung diproses.
        </p>

        <button
          type="button"
          onClick={handleDone}
          className="mt-4 w-full rounded-2xl bg-[#f48149] px-4 py-3.5 text-[17px] font-extrabold text-[#f3e3c7] [letter-spacing:-0.85px] transition hover:brightness-110 active:scale-[0.99]"
        >
          Done
        </button>
      </div>
    </div>
  );
}