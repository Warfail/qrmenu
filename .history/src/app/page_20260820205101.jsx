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
  IconChevronRight,
} from "@tabler/icons-react";
import FeedbackModal from "@/components/FeedbackModal";
import GuestRatingsModal from "@/components/GuestRatingsModal";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/Rooftop+Forty+Five/@-7.3370042,110.4879377,15z/data=!4m6!3m5!1s0x2e7a79339f145283:0x26fa97d90cd2e8d2!8m2!3d-7.3371324!4d110.4982667!16s%2Fg%2F11njpl__k4?entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D";

const LIVE_BANNER_EVENTS = [
  "Open 24 Hours",
  "VIP Studio",
  "Big Screen",
  "High Speed Wi-fi",
  "Live Music",
  "City View",
  "Portable Skate Park",
];

export default function HomePage() {
  const [settings, setSettings] = useState({
    whatsappNumber: "62895634120999",
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
    <main className="relative flex min-h-screen flex-col justify-start overflow-hidden bg-[#0a0a0c]">
      {/* HERO BANNER */}
      <section className="relative">
        <div className="relative flex aspect-[1.87/1] min-h-[215px] w-full flex-col justify-end overflow-hidden pb-6">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://api.builder.io/api/v1/image/assets/TEMP/ed7e081e05161d73c04c2ecca414b27fb12db043?placeholderIfAbsent=true)",
            }}
          />

          {/* Status bar */}
          <div className="absolute left-0 right-0 top-0 z-10 flex min-h-[44px] w-full" />

          {/* Brand - kiri atas */}
          <div className="absolute left-[25px] top-[80px] z-10 flex items-start">
            <span className="text-[16px] font-extrabold leading-[1.2] tracking-[-0.8px] text-[#f48149]">
              rooftop<span className="font-medium">fortyfive.</span>
            </span>
          </div>

          {/* Tagline - kanan bawah */}
          <div className="absolute bottom-[-13px] right-[20px] z-10 flex flex-col items-start">
            <span className="text-[32px] font-extrabold leading-[1.05] tracking-[-2.4px] text-[#f3e3c7]">
              URBAN
            </span>
            <span className="text-[32px] font-medium leading-[1.05] tracking-[-2.4px] text-[#f3e3c7]">
              SOCIETY
            </span>
            <span className="text-[32px] font-extrabold leading-[1.05] tracking-[-2.4px] text-[#f3e3c7]">
              STUDIO
            </span>
          </div>
        </div>

        {/* LIVE BANNER (running text, tiap event diawali pulse indicator) */}
        <div className="mt-[15px] flex w-full items-center overflow-hidden bg-[#f48149] px-6 py-3">
          <div className="relative w-full min-w-0 overflow-hidden">
            <div className="animate-marquee flex min-w-max whitespace-nowrap text-[10px] font-extrabold leading-none text-black [letter-spacing:-0.5px]">
              {[0, 1].map((copy) => (
                <span key={copy} className="flex shrink-0 items-center">
                  {LIVE_BANNER_EVENTS.map((evt, i) => (
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
        className="relative flex aspect-[0.918/1] min-h-[438px] w-full flex-col justify-start overflow-hidden bg-cover bg-center px-6 pb-[62px] pt-[62px]"
        style={{
          backgroundImage:
            "url(https://api.builder.io/api/v1/image/assets/TEMP/d2060486470375c1ebcf57c588ab2ab994788d42?placeholderIfAbsent=true)",
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
          className="relative mt-[10px] flex w-full items-center justify-between gap-4 rounded-2xl bg-[#f48149] px-[18px] py-[18px] text-left transition hover:brightness-110 active:scale-[0.99]"
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

        {/* Feedback */}
        <button
          type="button"
          onClick={() => setShowFeedback(true)}
          className="relative mt-[10px] flex w-full items-center justify-between gap-4 rounded-2xl bg-[#f48149] px-[18px] py-[18px] text-left transition hover:brightness-110 active:scale-[0.99]"
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
          <IconChevronRight size={16} className="text-[#f3e3c7]" />
        </button>

        {/* Our Social Media */}
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-[10px] flex w-full items-center justify-between gap-4 rounded-2xl bg-[#f48149] px-[18px] py-[18px] transition hover:brightness-110 active:scale-[0.99]"
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
          <IconChevronRight size={16} className="text-[#f3e3c7]" />
        </a>
      </section>

      {/* FOOTER - absolute bottom 87px */}
      <footer
        className="absolute bottom-[87px] left-1/2 z-10 flex aspect-[6.852/1] h-[54px] w-[370px] max-w-full -translate-x-1/2 items-start justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://api.builder.io/api/v1/image/assets/TEMP/b655ed62c1373498a7ecd39c12cbed09f7878830?placeholderIfAbsent=true)",
        }}
      >
        <div className="relative mt-[-30px] flex min-h-[60px] flex-col items-center gap-0.5">
          <p className="text-[10px] font-bold tracking-wide text-white/90">
            Open Daily: 4:00 PM — 2:00 AM
          </p>
          <p className="text-[9px] font-medium text-white/70">
            45th Floor, Metropolis Tower Plaza
          </p>
          <p className="mt-0.5 text-[9px] font-semibold tracking-wide text-white/80">
            Designed by <span className="font-bold text-white">Rooftop FortyFive</span>
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
