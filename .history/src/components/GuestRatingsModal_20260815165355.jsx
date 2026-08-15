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
