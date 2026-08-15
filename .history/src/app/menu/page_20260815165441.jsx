"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconSearch,
  IconPlus,
  IconMinus,
  IconShoppingBag,
  IconChevronRight,
} from "@tabler/icons-react";

function formatIDR(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

const ALL_CATEGORY = { id: "all", name: "All", icon: "", description: "" };

export default function MenuPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState({}); // { productId: { product, qty } }

  const searchRef = useRef(null);
  const activeRef = useRef(null);

  // Load categories
  useEffect(() => {
    let active = true;
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : { categories: [] }))
      .then((json) => {
        if (active) setCategories(json.categories || []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoadingCats(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Load products per category
  useEffect(() => {
    let active = true;
    setLoadingProducts(true);
    setError("");
    const query =
      activeCategory && activeCategory !== "All"
        ? `?category=${encodeURIComponent(activeCategory)}`
        : "";
    fetch(`/api/products${query}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat produk.");
        return res.json();
      })
      .then((json) => {
        if (active) setProducts(json.products || []);
      })
      .catch((err) => {
        if (active) setError(err.message || "Terjadi kesalahan.");
      })
      .finally(() => {
        if (active) setLoadingProducts(false);
      });
    return () => {
      active = false;
    };
  }, [activeCategory]);

  // Scroll active category pill into view
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeCategory]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, search]);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );
  const cartTotal = useMemo(
    () =>
      Object.values(cart).reduce((sum, item) => sum + item.qty * item.product.price, 0),
    [cart]
  );

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev[product.id];
      return {
        ...prev,
        [product.id]: {
          product,
          qty: existing ? existing.qty + 1 : 1,
        },
      };
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => {
      const existing = prev[productId];
      if (!existing) return prev;
      if (existing.qty <= 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: { ...existing, qty: existing.qty - 1 } };
    });
  }, []);

  const categoriesList = useMemo(
    () => [ALL_CATEGORY, ...categories],
    [categories]
  );

  return (
    <main className="flex min-h-screen flex-col bg-[#0a0a0c] pb-32">
      {/* TOP NAVBAR */}
      <header className="flex w-full items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            aria-label="Kembali"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2a2a35] bg-[#18181e] transition hover:bg-[#1f1f27]"
          >
            <IconArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-[18px] font-bold text-white">Menu Selection</h1>
            <p className="text-xs text-zinc-400">Rooftop Fortyfive</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Cari"
          onClick={() => searchRef.current?.focus()}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2a2a35] bg-[#18181e] transition hover:bg-[#1f1f27]"
        >
          <IconSearch size={20} className="text-white" />
        </button>
      </header>

      {/* SEARCH BAR */}
      <div className="px-6 pb-4">
        <div className="flex min-h-[48px] w-full items-center gap-2.5 rounded-xl border border-[#2a2a35] bg-[#18181e] px-4">
          <IconSearch size={18} className="shrink-0 text-zinc-400" />
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes, cocktails, or grills..."
            className="h-full w-full flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Hapus pencarian"
              className="shrink-0 rounded-full bg-[#2a2a35] px-2 py-0.5 text-xs text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* CATEGORIES CAROUSEL */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-6 pb-4">
        {loadingCats ? (
