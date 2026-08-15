"use client";

import { useState } from "react";

function renderIcon(icon, title) {
  if (!icon) {
    return (
      <span className="flex h-6 w-6 items-center justify-center text-xl leading-none">
        {title.charAt(0).toUpperCase()}
      </span>
    );
  }

  // Emoji or single-character icon
  if (/^[\p{Emoji}\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/u.test(icon)) {
    return <span className="text-xl leading-none">{icon}</span>;
  }

  // URL to an image
  if (icon.startsWith("http") || icon.startsWith("/") || icon.startsWith("data:")) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={icon}
        alt=""
        className="h-7 w-7 rounded-full object-cover"
      />
    );
  }

  // Fallback: treat as text/emoji
  return <span className="text-xl leading-none">{icon}</span>;
}

export default function MenuCard({ item }) {
  const [open, setOpen] = useState(false);

  const { title, link, type = "link", icon } = item;

  const cardContent = (
    <>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-800 shadow-sm">
        {renderIcon(icon, title)}
      </span>
      <span className="flex-1 text-center font-medium text-gray-800 sm:text-base">
        {title}
      </span>
      <span className="w-6 text-gray-400">
        {type === "popup" ? (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </span>
    </>
  );

  const baseClasses =
    "flex w-full items-center gap-3 rounded-2xl border border-white/30 bg-white/80 px-4 py-3 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md";

  return (
    <>
      {type === "popup" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={baseClasses}
        >
          {cardContent}
        </button>
      ) : (
        <a
          href={link}
          target={link && link !== "#" ? "_blank" : undefined}
          rel="noopener noreferrer"
          className={baseClasses}
        >
          {cardContent}
        </a>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close popup"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6 rounded-xl bg-gray-50 p-4">
              <p className="break-all text-sm text-gray-600">{link || "No link provided"}</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
              >
                Tutup
              </button>
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Buka Link
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}