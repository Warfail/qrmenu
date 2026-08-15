"use client";

import { useEffect, useState } from "react";
import {
  IconX,
  IconStarFilled,
  IconStarHalfFilled,
  IconStar,
  IconExternalLink,
  IconMapPin,
} from "@tabler/icons-react";

function Stars({ rating }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i - 0.25;
        const half = !filled && rating >= i - 0.75;
        const Icon = filled ? IconStarFilled : half ? IconStarHalfFilled : IconStar;
        return <Icon key={i} size={20} className="text-orange-500" />;
      })}
    </div>
  );
}

const FALLBACK_REVIEWS = [
  {
    author: "Andini P.",
    rating: 5,
    text: "View-nya luar biasa! Sunset dari lantai 45 bikin malam jadi spesial. Cocktail signature-nya wajib dicoba.",
  },
  {
    author: "Rizky H.",
    rating: 5,
    text: "Suasana rooftop paling nyaman di kota. Live DJ session pas weekend nggak pernah mengecewakan.",
  },
  {
    author: "Sarah W.",
    rating: 4.9,
    text: "Grill wagyu-nya juara, pelayanannya ramah. Recommended buat date night atau gathering.",
  },
];

export default function GuestRatingsModal({ open, onClose, googlePlaceId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    let active = true;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const placeId = String(googlePlaceId || "").trim();

    if (!apiKey || !placeId) {
      setReviews(FALLBACK_REVIEWS);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
        placeId
      )}&fields=rating,user_ratings_total,reviews&key=${encodeURIComponent(apiKey)}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (json.status === "OK" && json.result) {
          const r = json.result.reviews || [];
          setReviews(r.map((rv) => ({
            author: rv.author_name,
            rating: rv.rating,
            text: rv.text,
            time: rv.relative_time_description,
          })));
        } else {
          setReviews(FALLBACK_REVIEWS);
        }
      })
      .catch(() => {
        if (active) {
          setReviews(FALLBACK_REVIEWS);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, googlePlaceId]);

  if (!open) return null;

  const reviewHref = googlePlaceId
    ? `https://search.google.com/local/reviews?placeid=${encodeURIComponent(googlePlaceId)}`
    : "https://www.google.com/maps";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-[340px] flex-col rounded-3xl bg-[#1e1e1e] shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-7 pb-0">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-orange-500">
              Guest Ratings
            </p>
            <h2 className="text-2xl font-bold leading-tight text-white">
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
          <div className="mb-6 flex flex-col items-center rounded-2xl bg-[#2a2a2a] p-6">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-extrabold leading-none text-white">4.9</span>
              <span className="mb-1 text-sm text-gray-400">/ 5</span>
            </div>
            <div className="mt-3">
              <Stars rating={4.9} />
            </div>
            <p className="mt-3 text-center text-xs text-gray-400">
              Join 12,000+ happy patrons
            </p>
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            </div>
          )}

          {!loading && error && (
            <p className="py-4 text-center text-xs text-red-400">{error}</p>
          )}

          {!loading && reviews.length === 0 && !error && (
            <p className="py-4 text-center text-xs text-gray-400">
              Belum ada review.
            </p>
          )}

          {!loading &&
            reviews.slice(0, 5).map((rv, idx) => (
              <div
                key={`${rv.author}-${idx}`}
                className="mb-4 rounded-2xl bg-[#2a2a2a] p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{rv.author}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">{rv.rating}</span>
                    <Stars rating={rv.rating} />
                  </div>
                </div>
                <p className="text-[13px] leading-relaxed text-gray-400">{rv.text}</p>
                {rv.time && (
                  <p className="mt-2 text-[11px] text-gray-500">{rv.time}</p>
                )}
              </div>
            ))}

          <a
            href={reviewHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-500 transition hover:bg-orange-500/20"
          >
            <IconMapPin size={18} />
            See All Reviews on Google
            <IconExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}