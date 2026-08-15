"use client";

import { IconStar, IconStarFilled, IconExternalLink } from "@tabler/icons-react";

export const GOOGLE_REVIEWS_DATA = {
  placeId: "ChIJg1IUnzN5ei4R0ujSDNmX-iY",
  mapsUrl:
    "https://www.google.com/maps/place/Rooftop+Fortyfive/@-7.3370042,110.4879377,15z/data=!4m6!3m5!1s0x2e7a79339f145283:0x26fa97d90cd2e8d2!8m2!3d-7.3371324!4d110.4982667!16s%2Fg%2F11njpl__k4?entry=ttu",
  reviews: [
    {
      id: "1",
      author: "BanGben YO'LO",
      rating: 5,
      text: "Rekomended banget untuk nongkrong2 bareng temen atau pacar..suasana nya enak banget..kebersihan nya pun terjaga.pelayanan nya okee.untuk soal rasa jangan di tanya lagi.udah pasti enak 🤤🤤",
      time: "3 months ago",
    },
    {
      id: "2",
      author: "Carisa Cahya",
      rating: 5,
      text: "Tempatnya nyaman banget buat nongkrong, suasananya adem, estetik, dan bikin betah lama-lama😍. Makanan sama minumannya juga enak, harganya masih ramah di kantong. Pelayanannya baik dan cepat. Recommended banget buat yang cari tempat santai bareng temen ataupun sendiri🫰🏼",
      time: "3 months ago",
    },
    {
      id: "3",
      author: "Butsuma Senju",
      rating: 5,
      text: "Makanan : porsi banyak, tasty & banyak pilihan. Pelayanan : 👍🏽. Suasana : khas rooftop dengan udara segar dan nyaman. Experience : wajib balik lagi 🫶🏼",
      time: "2 months ago",
    },
  ],
};

export function Stars({ rating = 5, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) =>
        i <= rating ? (
          <IconStarFilled key={i} size={size} className="text-orange-500" />
        ) : (
          <IconStar key={i} size={size} className="text-[#4b4b4b]" />
        )
      )}
    </div>
  );
}

function Avatar({ author }) {
  const initials = String(author || "?")
    .split(" ")
    .map((p) => p.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-sm font-bold text-orange-500">
      {initials}
    </div>
  );
}

export default function GoogleReviews({ limit = 3 }) {
  const { reviews, mapsUrl } = GOOGLE_REVIEWS_DATA;
  const total = reviews.length;
  const average = total
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
    : "0.0";

  return (
    <div>
      {/* Rating summary */}
      <div className="mb-5 flex flex-col items-center rounded-2xl bg-[#18181e] p-6">
        <div className="flex items-end gap-2">
          <span className="text-5xl font-extrabold leading-none text-white">
            {average}
          </span>
          <span className="mb-1 text-sm text-zinc-400">/ 5</span>
        </div>
        <div className="mt-3">
          <Stars rating={Number(average)} size={20} />
        </div>
        <p className="mt-3 text-center text-xs text-zinc-400">
          Rated {average} out of 5 · from {total} reviews
        </p>
      </div>

      {/* Review list */}
      <div className="space-y-3">
        {reviews.slice(0, limit).map((review) => (
          <div key={review.id} className="rounded-2xl bg-[#18181e] p-4">
            <div className="flex items-center gap-3">
              <Avatar author={review.author} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {review.author}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <Stars rating={review.rating} size={13} />
                  <span className="text-[11px] text-zinc-500">
                    {review.time}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-zinc-300">
              {review.text}
            </p>
          </div>
        ))}
      </div>

      {/* Write review button */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-500 transition hover:bg-orange-500/20"
      >
        Tulis Review
        <IconExternalLink size={16} />
      </a>
    </div>
  );
}