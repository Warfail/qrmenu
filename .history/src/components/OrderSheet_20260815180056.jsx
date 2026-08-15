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
          className="absolute bottom-0 left-1/2 w-full max-w-[480px] -translate-x-1/2 animate-slide-up rounded-t-3xl border border-b-0 border-[#2a2a35] bg-[#121216] p-6 pb-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#2a2a35]" />

          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-orange-500">
                Rooftop Fourtyfive.
              </p>
              <h2 className="text-lg font-bold text-white">Your Order</h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Tutup"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2a2a2a] text-[#aaaaaa] transition hover:text-white"
            >
              <IconX size={16} />
            </button>
          </div>

          {/* Items */}
          <div className="max-h-[45vh] space-y-3 overflow-y-auto pr-1">
            {cartItems.map(({ product, qty }) => (
              <div
                key={product.id}
                className="rounded-2xl border border-[#2a2a35] bg-[#18181e] p-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 flex-1 text-sm font-semibold text-white">
                    {product.name}
                  </p>
                  <p className="shrink-0 text-sm font-bold text-orange-500">
                    {formatIDR(product.price * qty)}
                  </p>
                </div>
                {product.code && (
                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    {product.code}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-lg border border-orange-500 bg-[#22222b] px-2.5 py-1.5">
                    <button
                      type="button"
                      aria-label="Kurangi"
                      onClick={() => onRemove(product.id)}
                      className="text-white transition hover:text-orange-500"
                    >
                      <IconMinus size={14} />
                    </button>
                    <span className="min-w-[16px] text-center text-[13px] font-bold text-white">
                      {qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Tambah"
                      onClick={() => onAdd(product)}
                      className="text-orange-500 transition hover:text-orange-400"
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
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 border-t border-dashed border-[#2a2a35] pt-4">
            <div className="flex items-center justify-between text-sm text-zinc-400">
              <span>Subtotal</span>
              <span>{formatIDR(subtotal)}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-lg font-extrabold text-white">
              <span>Total</span>
              <span className="text-orange-500">{formatIDR(subtotal)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="mt-4 w-full rounded-2xl bg-orange-500 px-4 py-4 text-base font-semibold text-white transition hover:bg-orange-600 active:scale-[0.99]"
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
          <h2 className="mt-3 text-xl font-bold text-white">Order Confirmed</h2>
          <p className="mt-1 text-xs text-zinc-400">
            {orderMeta.id} • {orderMeta.date}
          </p>
        </div>

        {/* Receipt */}
        <div className="rounded-2xl border border-[#2a2a35] bg-[#18181e] p-4">
          <div className="mb-3 text-center">
            <p className="text-[13px] font-extrabold text-white">
              ROOFTOP<span className="font-medium">FORTYFIVE</span>.
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-orange-500">
              Payment Receipt
            </p>
          </div>

          <div className="space-y-2">
            {cartItems.map(({ product, qty }) => (
              <div
                key={product.id}
                className="flex items-start justify-between gap-2 text-[13px]"
              >
                <p className="min-w-0 flex-1 text-zinc-300">
                  {product.name}{" "}
                  <span className="text-zinc-500">×{qty}</span>
                </p>
                <p className="shrink-0 text-zinc-300">
                  {formatIDR(product.price * qty)}
                </p>
              </div>
            ))}
          </div>

          <div className="my-3 border-t border-dashed border-[#2a2a35]" />

          <div className="flex items-center justify-between text-sm text-zinc-400">
            <span>Subtotal</span>
            <span>{formatIDR(subtotal)}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-base font-extrabold text-white">
            <span>Total</span>
            <span className="text-orange-500">{formatIDR(subtotal)}</span>
          </div>
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-zinc-400">
          Please show this receipt to the cashier to confirm your order &
          payment.
        </p>

        <button
          type="button"
          onClick={handleDone}
          className="mt-4 w-full rounded-2xl bg-orange-500 px-4 py-3.5 text-base font-semibold text-white transition hover:bg-orange-600 active:scale-[0.99]"
        >
          Done
        </button>
      </div>
    </div>
  );
}