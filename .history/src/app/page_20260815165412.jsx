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
