"use client";

import { useMemo, useState } from "react";
import { IconStarFilled, IconStar, IconX, IconBrandWhatsapp } from "@tabler/icons-react";

const MODAL_BG = "https://api.builder.io/api/v1/image/assets/TEMP/af998c13d41fe62b4a888656fdbb3a15d2ef4a9c?placeholderIfAbsent=true";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-5">
      {/* Background hero banner (underlay) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${MODAL_BG})` }}
      />
      {/* Overlay #0a0a0c opacity 0.69 */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(10,10,12,0.69)" }} />

      {/* Modal card */}
      <div
        className="relative w-full max-w-[342px] rounded-none border border-white/[0.082] bg-[#161618] shadow-[0px_16px_32px_rgba(0,0,0,0.502)]"
        style={{ padding: "28px 24px 24px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute -right-1 -top-3 flex h-8 w-8 items-center justify-center border border-white/[0.082] bg-[#1f1f23] text-[#aaaaaa] transition hover:text-[#f3e3c7]"
          style={{ width: 32, height: 32 }}
        >
          <IconX size={16} />
        </button>

        {/* Header */}
        <div>
          <p className="text-[10px] font-extrabold uppercase text-[#f48149] [letter-spacing:-0.5px]">
            <span className="lowercase">RoofTop</span>
            <span className="font-medium lowercase">fortyfive</span>
            <span className="font-medium">.</span> Experience
          </p>
          <h2 className="mt-2 text-[22px] font-extrabold leading-tight text-[#f3e3c7] [letter-spacing:-1.1px]">
            Share Your Feedback
          </h2>
          <p className="mt-2 text-[12px] font-medium leading-[17px] text-[#f3e3c7] [letter-spacing:-0.6px]">
            We highly value your opinion. Let us know how we can make your next
            skyline visit even more perfect.
          </p>
        </div>

        {/* Rating */}
        <form onSubmit={handleSubmit}>
          <div className="mt-6 flex w-full flex-col items-center">
            <p className="text-[12px] font-extrabold uppercase text-[#f3e3c7] [letter-spacing:-0.6px]">
              Your Overall Rating
            </p>
            <div
              className="mt-2.5 flex items-start justify-center gap-3"
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
                      size={28}
                      className={
                        active
                          ? "text-[#f48149]"
                          : "text-[#4b4b4b] transition hover:text-[#f48149]"
                      }
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback message */}
          <div className="mt-6 w-full">
            <div className="flex w-full items-start justify-between">
              <p className="text-[12px] font-extrabold uppercase text-[#f3e3c7] [letter-spacing:-0.6px]">
                Feedback Message
              </p>
              <p className="text-[10px] font-medium text-[#f3e3c7] [letter-spacing:-0.5px]">
                Optional
              </p>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
              style={{ minHeight: 120, padding: 16 }}
              className="mt-2 w-full resize-none border border-white/[0.082] bg-[#1f1f23] text-[12px] font-medium text-[#f3e3c7] placeholder-[#f3e3c7] outline-none transition focus:border-[#f48149]/60 [letter-spacing:-0.6px]"
            />
          </div>

          {error && <p className="mt-3 text-center text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 bg-[#f48149] px-4 text-[17px] font-extrabold text-[#f3e3c7] transition hover:brightness-110 active:scale-[0.99] [letter-spacing:-0.85px]"
            style={{ minHeight: 52 }}
          >
            <IconBrandWhatsapp size={20} />
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}