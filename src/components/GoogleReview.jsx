"use client";

export default function GoogleReview({ googlePlaceId }) {
  const placeId = String(googlePlaceId || "").trim();

  const href = placeId
    ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`
    : "https://www.google.com/maps";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/80 px-4 py-3 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 17.27l-5.65 2.96 1.08-6.29L2.98 9.45l6.34-.55L12 3l2.68 5.9 6.34.55-4.45 4.49 1.08 6.29z"
        />
      </svg>
      <span className="font-medium text-gray-800 sm:text-base">
        Review Kami di Google
      </span>
    </a>
  );
}