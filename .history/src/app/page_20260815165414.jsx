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
        <div
          className="relative flex aspect-[1.06/1] min-h-[380px] w-full flex-col justify-end bg-gradient-to-b from-[#1a1a20] via-[#0e0e12] to-[#0a0a0c] px-6 pb-6"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.25) 0%, rgba(10,10,12,0) 55%), linear-gradient(180deg, #15151b 0%, #0a0a0c 100%)",
          }}
        >
          {/* Status bar */}
          <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-4">
            <div className="h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
            <div className="h-3 w-24 rounded-full bg-white/10" />
          </div>

          {/* Brand */}
          <div className="relative">
            <h1 className="max-w-full text-[40px] font-extrabold leading-[0.95] text-white">
              ROOFTOP
              <span className="font-medium">FORTYFIVE</span>.
            </h1>
            <p className="mt-1 text-[14px] font-bold uppercase text-orange-500">
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
      <section className="flex flex-col px-6 py-6">
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
