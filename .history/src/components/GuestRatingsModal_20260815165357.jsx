"use client";

import { useEffect, useState } from "react";
import {
  IconX,
  IconStarFilled,
  IconStarHalfFilled,
  IconStar,
  IconExternalLink,
  IconMapPin,
} from "@tabler/icons-react";

function Stars({ rating }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i - 0.25;
        const half = !filled && rating >= i - 0.75;
        const Icon = filled ? IconStarFilled : half ? IconStarHalfFilled : IconStar;
        return <Icon key={i} size={20} className="text-orange-500" />;
      })}
    </div>
  );
}

const FALLBACK_REVIEWS = [
  {
    author: "Andini P.",
    rating: 5,
    text: "View-nya luar biasa! Sunset dari lantai 45 bikin malam jadi spesial. Cocktail signature-nya wajib dicoba.",
  },
  {
    author: "Rizky H.",
    rating: 5,
    text: "Suasana rooftop paling nyaman di kota. Live DJ session pas weekend nggak pernah mengecewakan.",
  },
  {
    author: "Sarah W.",
    rating: 4.9,
    text: "Grill wagyu-nya juara, pelayanannya ramah. Recommended buat date night atau gathering.",
  },
];

export default function GuestRatingsModal({ open, onClose, googlePlaceId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    let active = true;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const placeId = String(googlePlaceId || "").trim();

    if (!apiKey || !placeId) {
      setReviews(FALLBACK_REVIEWS);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
        placeId
      )}&fields=rating,user_ratings_total,reviews&key=${encodeURIComponent(apiKey)}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (json.status === "OK" && json.result) {
          const r = json.result.reviews || [];
          setReviews(r.map((rv) => ({
            author: rv.author_name,
