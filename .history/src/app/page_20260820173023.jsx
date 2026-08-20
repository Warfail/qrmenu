"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconChefHat,
  IconArrowRight,
  IconStar,
  IconMessageCircle,
  IconChevronRight,
} from "@tabler/icons-react";
import FeedbackModal from "@/components/FeedbackModal";
import GuestRatingsModal from "@/components/GuestRatingsModal";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/Rooftop+Forty+Five/@-7.3370042,110.4879377,15z/data=!4m6!3m5!1s0x2e7a79339f145283:0x26fa97d90cd2e8d2!8m2!3d-7.3371324!4d110.4982667!16s%2Fg%2F11njpl__k4?entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D";

const LIVE_BANNER_TEXT =
  "Open 24 Hours . VIP Studio . Big Screen . High Speed Wi-fi . Live Music . City View . Portable Skate Park";

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
    <main className="flex min-h-screen flex-col justify-start overflow-hidden bg-[#0a0a0c]">
      {/* HERO BANNER */}
      <section className="relative">
        <div className="relative flex aspect-[1.87/1] min-h-[215px] w-full flex-col justify-end overflow-hidden pb-6">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://api.builder.io/api/v1/image/assets/TEMP/b4f1d54010a6639f1c62ba597c092ae7fdc088e7?placeholderIfAbsent=true)",
            }}
          />

          {/* Status bar (relative, tidak overlap) */}
          <div className="relative z-10 flex min-h-[44px] w-full" />
        </div>

        {/* LIVE BANNER (running text single line) */}
        <div className="flex w-full items-center gap-3 overflow-hidden bg-[#f48149] px-6 py-3">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-black" />
          </span>
          <div className="relative min-w-0 flex-1 overflow-hidden">
            <div className="animate-marquee flex min-w-max whitespace-nowrap text-[10px] font-extrabold leading-none text-black [letter-spacing:-0.5px]">
              {[0, 1].map((copy) => (
                <span key={copy} className="flex shrink-0 items-center">
                  {[0, 1].map((i) => (
                    <span key={i} className="flex items-center">
                      <span className="px-3">{LIVE_BANNER_TEXT}</span>
                      <span className="px-1 text-black/70">•</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ACTION STACK */}
      <section
        className="relative flex aspect-[1.256/1] min-h-[320px] w-full flex-col justify-start overflow-hidden bg-cover bg-center px-6 pb-12 pt-6"
        style={{
          backgroundImage:
            "url(https://api.builder.io/api/v1/image/assets/TEMP/a9bbdfaf8f7d25665566ccf9c20e8c5ca6dd3c3e?placeholderIfAbsent=true)",
        }}
      >
        {/* Explore Menu */}
        <Link
          href="/menu"
          className="relative flex w-full items-center justify-between gap-4 rounded-2xl bg-[#f48149] px-[18px] py-[18px] transition hover:brightness-110 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-6 w-6 items-center justify-center text-[#f3e3c7]">
              <IconChefHat size={24} />
            </div>
            <div>
              <p className="text-[17px] font-extrabold leading-tight text-[#f3e3c7] [letter-spacing:-0.85px]">
                Explore Menu
              </p>
              <p className="text-[10px] font-medium text-[#f3e3c7]/90 [letter-spacing:-0.5px]">
                Find your spesc
              </p>
            </div>
          </div>
          <IconArrowRight size={20} className="text-[#f3e3c7]" />
        </Link>

        {/* Guest Ratings */}
        <button
          type="button"
          onClick={() => setShowRatings(true)}
          className="relative mt-4 flex w-full items-center justify-between gap-4 rounded-2xl bg-[#f48149] px-[18px] py-[18px] text-left transition hover:brightness-110 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-6 w-6 items-center justify-center text-[#f3e3c7]">
              <IconStar size={24} />
            </div>
            <div>
              <p className="text-[17px] font-extrabold leading-tight text-[#f3e3c7] [letter-spacing:-0.85px]">
                Guest Ratings
              </p>
              <p className="text-[10px] font-medium text-[#f3e3c7]/90 [letter-spacing:-0.5px]">
                Join 12,000+ happy patrons
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[17px] font-extrabold text-[#f3e3c7] [letter-spacing:-0.85px]">
              4.9
            </span>
            <IconStar size={14} className="text-[#f3e3c7]" />
          </div>
        </button>

        {/* Feedbacks */}
        <button
          type="button"
          onClick={() => setShowFeedback(true)}
          className="relative mt-4 flex w-full items-center justify-between gap-4 rounded-2xl bg-[#f48149] px-[18px] py-[18px] text-left transition hover:brightness-110 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-6 w-6 items-center justify-center text-[#f3e3c7]">
              <IconMessageCircle size={24} />
            </div>
            <div>
              <p className="text-[17px] font-extrabold leading-tight text-[#f3e3c7] [letter-spacing:-0.85px]">
                Feedbacks
              </p>
              <p className="text-[10px] font-medium text-[#f3e3c7]/90 [letter-spacing:-0.5px]">
                Tell us about your skyline visit
              </p>
            </div>
          </div>
          <IconChevronRight size={16} className="text-[#f3e3c7]" />
        </button>
      </section>

      {/* FOOTER */}
      <footer
        className="relative mt-6 flex aspect-[5.743/1] w-[402px] max-w-full flex-col items-start justify-start self-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://api.builder.io/api/v1/image/assets/TEMP/875a9c68745b099a650878dbdef4603cc79b0286?placeholderIfAbsent=true)",
        }}
      >
        <div className="relative flex min-h-[24px] w-full" />
        <div className="relative mt-4 flex min-h-[34px] w-full items-center justify-center pt-7 pb-2">
          <p className="text-[10px] font-semibold tracking-wide text-white/80">
            Design by <span className="font-bold text-white">Rezky A.K</span>
          </p>
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