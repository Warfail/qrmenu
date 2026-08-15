"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconChefHat,
  IconArrowRight,
  IconStar,
  IconMessageCircle,
  IconChevronRight,
  IconMapPin,
  IconClock,
} from "@tabler/icons-react";
import FeedbackModal from "@/components/FeedbackModal";
import GuestRatingsModal from "@/components/GuestRatingsModal";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/Rooftop+Forty+Five/@-7.3370042,110.4879377,15z/data=!4m6!3m5!1s0x2e7a79339f145283:0x26fa97d90cd2e8d2!8m2!3d-7.3371324!4d110.4982667!16s%2Fg%2F11njpl__k4?entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D";

export default function HomePage() {
  const [settings, setSettings] = useState({
    whatsappNumber: "6281234567890",
    googlePlaceId: "",
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [showRatings, setShowRatings] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/landing")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (active && json?.settings) {
          setSettings((prev) => ({
            ...prev,
            whatsappNumber: json.settings.whatsappNumber || prev.whatsappNumber,
            googlePlaceId: json.settings.googlePlaceId || prev.googlePlaceId,
          }));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col justify-between overflow-hidden bg-[#0a0a0c]">
      {/* HERO */}
      <section className="relative">
        <div className="relative flex min-h-[170px] w-full flex-col justify-end overflow-hidden px-6 pb-3">
          {/* Background image with subtle overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://api.builder.io/api/v1/image/assets/TEMP/2e63d8fb1ea158c886bb538727ff16bd85cf971e?placeholderIfAbsent=true)",
              opacity: 0.5,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c]/60 via-[#0a0a0c]/40 to-[#0a0a0c]" />

          {/* Brand */}
          <div className="relative">
            <h1 className="max-w-full text-[20px] font-extrabold leading-tight text-white">
              ROOFTOP
              <span className="font-medium">FORTYFIVE</span>.
            </h1>
            <p className="mt-0.5 text-[12px] font-bold uppercase text-orange-500">
              Urban <span className="font-medium">Society</span> Studio
            </p>
          </div>
        </div>

        {/* LIVE BANNER */}
        <div className="flex w-full items-center gap-3 border-y border-orange-500 bg-orange-500/[0.12] px-6 py-3">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
          </span>
          <p className="text-[13px] font-extrabold text-white">
            Tonight: Sunset DJ Sessions (9 PM — Late)
          </p>
        </div>
      </section>

      {/* ACTION STACK */}
      <section className="flex flex-col px-6 py-4">
        <p className="text-xs font-extrabold uppercase tracking-wide text-zinc-400">
          Exquisite Experiences
        </p>

        {/* Explore Menu */}
        <Link
          href="/menu"
          className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-orange-500 px-[18px] py-[18px] transition hover:bg-orange-600 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-6 w-6 items-center justify-center">
              <IconChefHat size={24} />
            </div>
            <div>
              <p className="text-[18px] font-extrabold text-white">Explore Menu</p>
              <p className="text-xs font-medium text-white/80">
                Fine cocktails & signature grills
              </p>
            </div>
          </div>
          <IconArrowRight size={20} className="text-white" />
        </Link>

        {/* Guest Ratings */}
        <button
          type="button"
          onClick={() => setShowRatings(true)}
          className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-[#2a2a35] bg-[#18181e] px-[18px] py-[18px] text-left transition hover:bg-[#1f1f27] active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-6 w-6 items-center justify-center">
              <IconStar size={24} className="text-orange-500" />
            </div>
            <div>
              <p className="text-[18px] font-bold text-white">Guest Ratings</p>
              <p className="text-xs font-medium text-zinc-400">
                Join 12,000+ happy patrons
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-base font-bold text-white">4.9</span>
            <IconStar size={14} className="text-orange-500" />
          </div>
        </button>

        {/* Feedbacks */}
        <button
          type="button"
          onClick={() => setShowFeedback(true)}
          className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-[#2a2a35] bg-[#18181e] px-[18px] py-[18px] text-left transition hover:bg-[#1f1f27] active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-6 w-6 items-center justify-center">
              <IconMessageCircle size={24} className="text-orange-500" />
            </div>
            <div>
              <p className="text-[18px] font-extrabold text-white">Feedbacks</p>
              <p className="text-xs font-medium text-zinc-400">
                Tell us about your skyline visit
              </p>
            </div>
          </div>
          <IconChevronRight size={16} className="text-zinc-500" />
        </button>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-col items-center pb-2 pt-5">
        <div className="flex flex-col items-center font-extrabold text-zinc-400">
          <p className="flex items-center gap-1.5 text-[13px]">
            <IconClock size={14} className="text-orange-500" />
            Open Everyday 24 Hour
          </p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-1.5 text-xs font-medium transition hover:text-orange-400"
          >
            <IconMapPin size={13} className="text-orange-500" />
            <span className="text-center">
              Jl. Veteran No.13 Blok K, Mangunsari, Kota Salatiga, Jawa Tengah
            </span>
          </a>
        </div>
        <div className="mt-3 flex w-full items-start justify-center pt-4 pb-2">
          <div className="h-[5px] w-[139px] rounded-full bg-white" />
        </div>
      </footer>

      {/* MODALS */}
      <FeedbackModal
        open={showFeedback}
        onClose={() => setShowFeedback(false)}
        whatsappNumber={settings.whatsappNumber}
      />
      <GuestRatingsModal
        open={showRatings}
        onClose={() => setShowRatings(false)}
        googlePlaceId={settings.googlePlaceId}
      />
    </main>
  );
}