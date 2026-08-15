"use client";

import { useEffect, useState } from "react";
import MenuCard from "@/components/MenuCard";
import WhatsAppForm from "@/components/WhatsAppForm";
import GoogleReview from "@/components/GoogleReview";

export default function LandingPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/landing");
        if (!res.ok) {
          throw new Error("Gagal memuat data landing page.");
        }
        const json = await res.json();
        if (active) {
          setData(json);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Terjadi kesalahan.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const settings = data?.settings || {};
  const menu = data?.menu || [];

  const menuSorted = [...menu].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-4 py-10">
        {/* Avatar */}
        <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gray-200 shadow-lg">
          {settings.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.avatar}
              alt={settings.title || "Avatar"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-gray-400">
              {settings.title ? settings.title.charAt(0).toUpperCase() : "?"}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h1 className="text-center text-2xl font-bold text-gray-800">
          {settings.title || "Nama Bisnis Anda"}
        </h1>
        {settings.description && (
          <p className="mt-2 max-w-sm text-center text-sm text-gray-600">
            {settings.description}
          </p>
        )}

        {/* Content */}
        <div className="mt-8 flex w-full flex-col gap-4">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl bg-red-50 p-4 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && menuSorted.map((item, idx) => (
            <MenuCard key={`${item.title}-${idx}`} item={item} />
          ))}

          {!loading && !error && menuSorted.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              Belum ada menu.
            </p>
          )}

          {!loading && !error && (
            <>
              <GoogleReview googlePlaceId={settings.googlePlaceId} />
              <WhatsAppForm whatsappNumber={settings.whatsappNumber} />
            </>
          )}
        </div>

        <footer className="mt-auto pt-10 text-center text-xs text-gray-400">
          Powered by Linktree Landing
        </footer>
      </div>
    </main>
  );
}