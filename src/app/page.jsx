"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconChefHat,
  IconArrowRight,
  IconStar,
  IconAward,
  IconMessageCircle,
  IconUsers,
  IconBrandWhatsapp,
  IconX,
} from "@tabler/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import FeedbackModal from "@/components/FeedbackModal";
import GuestRatingsModal from "@/components/GuestRatingsModal";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/Rooftop+Forty+Five/@-7.3370042,110.4879377,15z/data=!4m6!3m5!1s0x2e7a79339f145283:0x26fa97d90cd2e8d2!8m2!3d-7.3371324!4d110.4982667!16s%2Fg%2F11njpl__k4?entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D";

const DEFAULT_PROMO_TEXT =
  "Open 24 Hours - VIP Studio - Big Screen - High Speed Wi-fi - Live Music - City View - Portable Skate Park";

export default function HomePage() {
  const [promoEvents, setPromoEvents] = useState([
    "Open 24 Hours",
    "VIP Studio",
    "Big Screen",
    "High Speed Wi-fi",
    "Live Music",
    "City View",
    "Portable Skate Park",
  ]);
  const [settings, setSettings] = useState({
    whatsappNumber: "62895634120999",
    googlePlaceId: "",
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [showRatings, setShowRatings] = useState(false);
  const [showSocialMenu, setShowSocialMenu] = useState(false);

  const SOCIAL_LINKS = [
    {
      id: "fb",
      label: "Facebook",
      iconUrl: "https://cdn.simpleicons.org/facebook",
      href: "https://www.facebook.com/share/19A6JojNt5/",
    },
    {
      id: "ig",
      label: "Instagram",
      iconUrl: "https://cdn.simpleicons.org/instagram",
      href: "https://www.instagram.com/rooftopfortyfive_salatiga?igsh=MTRzM2w2dDRmZ2hwZA==&igsi=MTRzM2w2dDRmZ2hwZA==",
    },
    {
      id: "tiktok",
      label: "TikTok",
      iconUrl: "https://cdn.simpleicons.org/tiktok",
      href: "https://www.tiktok.com/@rooftop45_?_r=1&_t=ZS-992nkx9TvvD",
    },
  ];

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

  // Fetch promo running text dari /api/promo (fallback: teks default)
  useEffect(() => {
    let active = true;
    fetch("/api/promo")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!active) return;
        const text = json?.text?.trim();
        if (!text) return; // promo kosong → pakai default
        const events = text
          .split(/\s*[-●]\s*/)
          .map((e) => e.trim())
          .filter(Boolean);
        if (events.length) setPromoEvents(events);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col justify-start overflow-hidden bg-[#0a0a0c]">
      {/* HERO BANNER */}
      <section className="relative">
        <div className="relative flex aspect-[1.748/1] min-h-[230px] w-full flex-col justify-start overflow-hidden pb-6">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://api.builder.io/api/v1/image/assets/TEMP/5213c6467ccbd0e62e8132a28f785c7046b7324f?placeholderIfAbsent=true)",
            }}
          />

          {/* Status bar */}
          <div className="absolute left-0 right-0 top-0 z-10 flex min-h-[44px] w-full" />

          {/* Brand - kiri atas (posisi navbar, tidak tabrakan dengan tagline) */}
          <div className="absolute left-[25px] top-[52px] z-10 flex h-[44px] items-start">
            <span className="text-[16px] font-extrabold leading-[1.2] tracking-[-0.8px] text-[#f48149]">
              rooftop<span className="font-medium">fortyfive.</span>
            </span>
          </div>

          {/* Tagline - kiri bawah (sejajar dengan brand, tidak terpotong) */}
          <div className="absolute bottom-[2px] left-[25px] z-10 flex w-max max-w-full flex-col items-start">
            <span className="text-[48px] font-extrabold leading-[1.05] tracking-[-2.4px] text-[#f3e3c7]">
              URBAN
            </span>
            <span className="text-[48px] font-medium leading-[1.05] tracking-[-2.4px] text-[#f3e3c7]">
              SOCIETY
            </span>
            <span className="text-[48px] font-extrabold leading-[1.05] tracking-[-2.4px] text-[#f3e3c7]">
              STUDIO
            </span>
          </div>
        </div>

        {/* LIVE BANNER (running text, tiap event diawali pulse indicator) */}
        <div className="mt-[22px] flex min-h-[38px] w-full items-center overflow-hidden bg-[#f48149] px-6 pb-[16px] pt-[13px]">
          <div className="relative w-full min-w-0 overflow-hidden">
            <div className="animate-marquee flex min-w-max whitespace-nowrap text-[12px] font-extrabold leading-none text-black [letter-spacing:-0.5px]">
              {[0, 1].map((copy) => (
                <span key={copy} className="flex shrink-0 items-center">
                  {promoEvents.map((evt, i) => (
                    <span key={i} className="flex items-center">
                      <span className="relative mx-1.5 inline-block h-[6px] w-[6px] shrink-0 rounded-full bg-black" />
                      <span className="px-1">{evt}</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ACTION STACK (4 tombol) */}
      <section
        className="relative mt-[24px] flex aspect-[0.918/1] min-h-[438px] w-full flex-col justify-start overflow-hidden bg-cover bg-center px-6 pb-[63px] pt-[63px]"
        style={{
          backgroundImage:
            "url(https://api.builder.io/api/v1/image/assets/TEMP/d2060486470375c1ebcf57c588ab2ab994788d42?placeholderIfAbsent=true)",
        }}
      >
        {/* Explore Menu */}
        <Link
          href="/menu"
          className="relative flex w-full items-center justify-between gap-4 bg-[#f48149] px-[18px] py-[18px] transition hover:brightness-110 active:scale-[0.99]"
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
                Find the perfect dish for your mood
              </p>
            </div>
          </div>
          <IconArrowRight size={20} className="text-[#f3e3c7]" />
        </Link>

        {/* Guest Ratings */}
        <button
          type="button"
          onClick={() => setShowRatings(true)}
          className="relative mt-[8px] flex w-full items-center justify-between gap-4 bg-[#f48149] px-[18px] py-[18px] text-left transition hover:brightness-110 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-6 w-6 items-center justify-center text-[#f3e3c7]">
              <IconAward size={24} />
            </div>
            <div>
              <p className="text-[17px] font-extrabold leading-tight text-[#f3e3c7] [letter-spacing:-0.85px]">
                Guest Ratings
              </p>
              <p className="text-[10px] font-medium text-[#f3e3c7]/90 [letter-spacing:-0.5px]">
                Be one of our happy patrons
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

        {/* Feedback - icon kanan WhatsApp */}
        <button
          type="button"
          onClick={() => setShowFeedback(true)}
          className="relative mt-[8px] flex w-full items-center justify-between gap-4 bg-[#f48149] px-[18px] py-[18px] text-left transition hover:brightness-110 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-6 w-6 items-center justify-center text-[#f3e3c7]">
              <IconMessageCircle size={24} />
            </div>
            <div>
              <p className="text-[17px] font-extrabold leading-tight text-[#f3e3c7] [letter-spacing:-0.85px]">
                Feedback
              </p>
              <p className="text-[10px] font-medium text-[#f3e3c7]/90 [letter-spacing:-0.5px]">
                Help us improve your next visit
              </p>
            </div>
          </div>
          <IconBrandWhatsapp size={20} className="text-[#f3e3c7]" />
        </button>

        {/* Our Social Media - toggle dropdown */}
        <div className="relative mt-[8px]">
          <button
            type="button"
            onClick={() => setShowSocialMenu((v) => !v)}
            className="flex w-full items-center justify-between gap-4 bg-[#f48149] px-[18px] py-[18px] text-left transition hover:brightness-110 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-6 w-6 items-center justify-center text-[#f3e3c7]">
                <IconUsers size={24} />
              </div>
              <div>
                <p className="text-[17px] font-extrabold leading-tight text-[#f3e3c7] [letter-spacing:-0.85px]">
                  Our Social Media
                </p>
                <p className="text-[10px] font-medium text-[#f3e3c7]/90 [letter-spacing:-0.5px]">
                  Stay in touch with us
                </p>
              </div>
            </div>
            <FontAwesomeIcon
              icon={faLink}
              className="h-[18px] w-[18px] shrink-0 text-[#f3e3c7]"
            />
          </button>

        </div>
      </section>

      {/* SOCIAL MEDIA MODAL */}
      {showSocialMenu && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-5"
          onClick={() => setShowSocialMenu(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-[342px] border border-white/[0.082] bg-[#161618] p-6 shadow-[0px_16px_32px_rgba(0,0,0,0.502)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-[#f48149] [letter-spacing:-0.5px]">
                  Our Social Media
                </p>
                <h3 className="mt-1 text-[22px] font-extrabold leading-tight text-[#f3e3c7] [letter-spacing:-1.1px]">
                  Stay in Touch
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSocialMenu(false)}
                aria-label="Tutup"
                className="flex h-8 w-8 items-center justify-center border border-white/[0.082] bg-[#1f1f23] text-[#aaaaaa] transition hover:text-[#f3e3c7]"
              >
                <IconX size={16} />
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center gap-3 rounded-xl border border-white/[0.082] bg-[#1f1f23] px-4 py-3 text-[17px] font-extrabold text-[#f3e3c7] [letter-spacing:-0.85px] transition hover:bg-white/[0.06]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.iconUrl}
                    alt={s.label}
                    width={20}
                    height={20}
                    className="h-5 w-5 shrink-0 object-contain"
                  />
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer
        className="relative mt-[18px] flex w-full flex-col items-center justify-center bg-[#0a0a0c] px-[9px] py-4"
        style={{ zIndex: 2 }}
      >
        {/* LOCATION ICON — nyelonong: setengah di action stack, setengah di footer */}
        <a
          href="https://maps.app.goo.gl/LEvD7LbcxwcDfQyH6"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Buka lokasi di Google Maps"
          className="absolute block"
          style={{
            right: "34px",
            top: "-8px",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            zIndex: 20,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/c96dab6a978e65b98bfd0855db347731b7e2d0db?placeholderIfAbsent=true"
            alt="location_on"
            className="h-full w-full object-contain"
          />
        </a>
        {/* Landing footer strip */}
        <div
          className="relative h-[60px] min-h-[60px] w-[384px] max-w-full bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://api.builder.io/api/v1/image/assets/TEMP/51bbaf151f0379c20cca4c73d269058c5738f2a3?placeholderIfAbsent=true)",
          }}
        />
        {/* Logo */}
        <div
          className="relative mt-2 h-[50px] min-h-[50px] w-[50px] bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://api.builder.io/api/v1/image/assets/TEMP/7f82a1ed5b6eb46bcb8933dc37b55513ff00e3c6?placeholderIfAbsent=true)",
          }}
        />
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