"use client";

import { useMemo, useState } from "react";
import { IconStarFilled, IconStar, IconX, IconBrandWhatsapp } from "@tabler/icons-react";

export default function FeedbackModal({ open, onClose, whatsappNumber }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const phone = useMemo(() => String(whatsappNumber || "").replace(/\D/g, ""), [whatsappNumber]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Pilih minimal 1 bintang dulu ya.");
      return;
    }

    const lines = [
      "*ROOFTOP45 — Feedback*",
      `⭐ Rating: ${rating}/5`,
      "",
      message.trim() || "Tidak ada pesan tambahan.",
    ];

    const text = encodeURIComponent(lines.join("\n"));
    const url = phone
      ? `https://wa.me/${phone}?text=${text}`
      : `https://wa.me/?text=${text}`;

    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
    setRating(0);
    setMessage("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[340px] rounded-3xl bg-[#1e1e1e] p-7 shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#2a2a2a] text-[#aaaaaa] transition hover:text-white"
        >
          <IconX size={16} />
        </button>

        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-orange-500">
          Rooftop45 Experience
        </p>
        <h2 className="mb-2 text-2xl font-bold leading-tight text-white">
          Share Your Feedback
        </h2>
        <p className="mb-6 text-[13px] leading-relaxed text-gray-400">
          We highly value your opinion. Let us know how we can make your next
          skyline visit even more perfect.
        </p>

        <form onSubmit={handleSubmit}></form>
