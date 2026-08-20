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
      `Rating: ${rating}/5 bintang`,
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

        <form onSubmit={handleSubmit}>
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
            Your Overall Rating
          </p>

          <div
            className="mb-6 flex items-center justify-center gap-2"
            onMouseLeave={() => setHover(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hover || rating) >= star;
              const Icon = active ? IconStarFilled : IconStar;
              return (
                <button
                  key={star}
                  type="button"
                  aria-label={`${star} bintang`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                >
                  <Icon
                    size={32}
                    className={
                      active
                        ? "text-orange-500"
                        : "text-[#4b4b4b] transition hover:text-orange-500"
                    }
                  />
                </button>
              );
            })}
          </div>

          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
              Feedback Message
            </p>
            <p className="text-xs text-gray-400">Optional</p>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={4}
            className="mb-5 h-[100px] w-full resize-none rounded-xl bg-[#2a2a2a] p-4 text-sm text-gray-300 placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-orange-500/50"
          />

          {error && <p className="mb-3 text-center text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-4 text-base font-semibold text-white transition hover:bg-orange-600 active:scale-[0.99]"
          >
            <IconBrandWhatsapp size={20} />
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}