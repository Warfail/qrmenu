"use client";

import { IconX } from "@tabler/icons-react";
import GoogleReviews from "@/components/GoogleReviews";

export default function GuestRatingsModal({ open, onClose, googlePlaceId }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-[340px] flex-col rounded-3xl bg-[#1e1e1e]/90 shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-7 pb-0">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#f48149]">
              Guest Ratings
            </p>
            <h2 className="text-[17px] font-extrabold leading-tight text-[#f3e3c7] [letter-spacing:-0.85px]">
              What Our Guests Say
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2a2a2a] text-[#aaaaaa] transition hover:text-white"
          >
            <IconX size={16} />
          </button>
        </div>

        <div className="overflow-y-auto p-7 pt-5">
          <GoogleReviews limit={3} />
        </div>
      </div>
    </div>
  );
}