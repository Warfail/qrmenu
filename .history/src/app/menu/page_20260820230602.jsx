"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconSearch,
  IconPlus,
  IconMinus,
  IconChevronRight,
  IconChevronDown,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import OrderSheet from "@/components/OrderSheet";
import { useCart } from "@/components/CartContext";

function formatIDR(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

// Urutan tampilan kategori (display) saat "ALL"
const DISPLAY_ORDER = [
  "COFFEE",
  "NON-COFFEE",
  "JUICE & MOCKTAIL",
  "BEER & COCKTAIL",
  "MAIN COURSE",
  "NOODLES & SOUP",
  "SEAFOOD",
  "SNACKS & SIDES",
  "ROKOK & ADD-ONS",
];

// Grup sidebar (Tree/Accordion)
const SIDEBAR_GROUPS = [
  {
    id: "drinks",
    label: "Minuman",
    categories: ["COFFEE", "NON-COFFEE", "JUICE & MOCKTAIL", "BEER & COCKTAIL"],
  },
  {
    id: "foods",
    label: "Makanan",
    categories: [
      "MAIN COURSE",
      "NOODLES & SOUP",
      "SEAFOOD",
      "SNACKS & SIDES",
    ],
  },
  {
    id: "others",
    label: "Rokok & Add-ons",
    categories: ["ROKOK & ADD-ONS"],
  },
];

// Background hero banner SAMA seperti landing page (5213c646...)
const BG_IMAGE =
  "https://api.builder.io/api/v1/image/assets/TEMP/5213c6467ccbd0e62e8132a28f785c7046b7324f?placeholderIfAbsent=true";

// Nama dasar tanpa suffix varian
function baseName(name) {
  return String(name || "").replace(/ Hot$/, "").replace(/ Ice$/, "");
}

// Apakah nama produk mengandung varian HOT/ICE
function hasVariantName(name) {
  return name.endsWith(" Hot") || name.endsWith(" Ice");
}

// Item mie (bakmi/kwetiau/bihun) dari CARBOHYDRATE BOOSTERS
function isNoodle(name) {
  return /^(Bakmi|Kwetiau|Bihun)/i.test(name);
}

// Mapping category DB -> display category (frontend only, DB tidak diubah)
function getDisplayCategory(item) {
  const cat = item.category;
  const name = baseName(item.name);
  switch (cat) {
    case "CAFFEINE INJECTORS":
    case "CLUTCH PERFORMANCE":
      return "COFFEE";
    case "ENDURANCE LAB & HYPERDRIVE":
      return "NON-COFFEE";
    case "POST-MATCH HEALING":
      // Kecuali Ice Cream → pindah ke SNACKS & SIDES
      return /ice ?cream/i.test(name) ? "SNACKS & SIDES" : "NON-COFFEE";
    case "FLUID HYDRATION & REFRESHER":
      return "JUICE & MOCKTAIL";
    case "THE CELEBRATION":
      return "BEER & COCKTAIL";
    case "HEAVYWEIGHT CHAMPIONS":
      return "MAIN COURSE";
    case "CARBOHYDRATE BOOSTERS":
      // Kecuali bakmi/kwetiau/bihun → NOODLES & SOUP
      return isNoodle(name) ? "NOODLES & SOUP" : "MAIN COURSE";
    case "TACTICAL RECHARGE & RECOVERY":
      return "NOODLES & SOUP";
    case "THE MARINE TOURNAMENT":
      return "SEAFOOD";
    case "HALF-TIME BITES & SNACK LEAGUE":
      return "SNACKS & SIDES";
    case "Rokok":
    case "THE ADDITIONAL PLAYERS":
      return "ROKOK & ADD-ONS";
    default:
      return cat || "LAINNYA";
  }
}

export default function MenuPage() {
  const router = useRouter();
  const { cart, addToCart, removeFromCart, setVariant, clearCart } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [showOrder, setShowOrder] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [productCounts, setProductCounts] = useState({});

  const searchRef = useRef(null);
  const sectionRefs = useRef({});

  // Load semua produk sekali + kategori
  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/products").then((r) => (r.ok ? r.json() : { products: [] })),
      fetch("/api/categories").then((r) => (r.ok ? r.json() : { categories: [] })),
    ])
      .then(([prodJson]) => {
        if (!active) return;
        setAllProducts(prodJson.products || []);
      })
      .catch((err) => {
        if (active) setError(err.message || "Terjadi kesalahan.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Kelompokkan produk per DISPLAY category: gabung varian Hot/Ice jadi satu item (nama dasar)
  const groupedByDisplay = useMemo(() => {
    const groups = {};
    const counts = {};
    for (const p of allProducts) {
      const display = getDisplayCategory(p);
      const base = baseName(p.name);
      const isHot = p.name.endsWith(" Hot");
      const isIce = p.name.endsWith(" Ice");
      if (!groups[display]) {
        groups[display] = new Map();
        counts[display] = 0;
      }
      if (!groups[display].has(base)) {
        groups[display].set(base, {
          id: `${display}::${base}`, // key stabil untuk cart
          name: base,
          category: p.category,
          code: p.code ? p.code.replace(/-(HOT|ICE)$/, "") : "",
          price: p.price,
          variants: null, // null = tanpa varian
        });
        counts[display]++;
      }
      const item = groups[display].get(base);
      if (isHot || isIce) {
        item.variants = item.variants || {};
        item.variants[isHot ? "HOT" : "ICE"] = {
          id: p.id,
          name: p.name,
          code: p.code,
        };
      } else if (!item.variants) {
        item.variants = null;
      }
    }
    setProductCounts(counts);
    const out = {};
    for (const [display, map] of Object.entries(groups)) {
      out[display] = [...map.values()].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }
    return out;
  }, [allProducts]);

  // Kategori yang tampil (urut sesuai DISPLAY_ORDER)
  const visibleCategories = useMemo(
    () => DISPLAY_ORDER.filter((c) => (groupedByDisplay[c]?.length ?? 0) > 0),
    [groupedByDisplay]
  );

  // Filter hasil berdasarkan search (client-side)
  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groupedByDisplay;
    const out = {};
    for (const [cat, items] of Object.entries(groupedByDisplay)) {
      const matched = items.filter((p) => p.name.toLowerCase().includes(q));
      if (matched.length) out[cat] = matched;
    }
    return out;
  }, [groupedByDisplay, search]);

  const shownCategories = useMemo(() => {
    if (activeCategory === "ALL") {
      return visibleCategories.filter((c) => (filteredGroups[c]?.length ?? 0) > 0);
    }
    return (filteredGroups[activeCategory]?.length ?? 0) > 0
      ? [activeCategory]
      : [];
  }, [activeCategory, visibleCategories, filteredGroups]);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );
  const cartTotal = useMemo(
    () =>
      Object.values(cart).reduce(
        (sum, item) => sum + item.qty * item.product.price,
        0
      ),
    [cart]
  );

  const cartItems = useMemo(
    () =>
      Object.values(cart).sort((a, b) =>
        a.product.name.localeCompare(b.product.name)
      ),
    [cart]
  );

  function selectCategory(name) {
    setActiveCategory(name);
    setSidebarOpen(false);
    // Setelah filter, scroll ke atas daftar
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  }

  // Expand/collapse grup - hanya satu grup yang terbuka dalam satu waktu
  function toggleGroup(id) {
    setExpandedGroups((prev) => {
      const next = {};
      if (!prev[id]) next[id] = true;
      return next;
    });
  }

  return (
    <main
      className="relative flex min-h-screen flex-col pb-32 transition-opacity duration-300"
      style={{
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#0a0a0c",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Semi-translucent overlay ala menu (theme selaras hero landing) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,12,0.72) 0%, rgba(10,10,12,0.55) 35%, rgba(10,10,12,0.85) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* TOP NAVBAR */}
        <header className="flex w-full items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              aria-label="Kembali"
              className="flex h-10 w-10 items-center justify-center border border-[#2a2a35] bg-[#18181e] transition hover:bg-[#1f1f27]"
            >
              <IconArrowLeft size={20} className="text-[#f3e3c7]" />
            </button>
            <div>
              <h1 className="text-[17px] font-extrabold text-[#f3e3c7] [letter-spacing:-0.85px]">
                Menu Selection
              </h1>
              <p className="text-[10px] font-medium text-[#f48149] [letter-spacing:-0.5px]">
                rooftop<span className="font-medium">fortyfive.</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Buka daftar kategori"
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center border border-[#2a2a35] bg-[#18181e] transition hover:bg-[#1f1f27]"
          >
            <IconMenu2 size={20} className="text-[#f3e3c7]" />
          </button>
        </header>

        {/* SEARCH BAR */}
        <div className="px-6 pb-4">
          <div className="flex min-h-[48px] w-full items-center gap-2.5 border border-[#2a2a35] bg-[#18181e] px-4">
            <IconSearch size={18} className="shrink-0 text-[#f48149]" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes, cocktails, or grills..."
              className="h-full w-full flex-1 bg-transparent text-[12px] font-extrabold text-[#f3e3c7] placeholder-zinc-500 outline-none [letter-spacing:-0.6px]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Hapus pencarian"
                className="shrink-0 border border-[#2a2a35] bg-[#2a2a2a] px-2 py-0.5 text-xs text-[#f3e3c7] hover:bg-white/[0.06]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f48149] border-t-transparent" />
          </div>
        ) : error ? (
          <div className="mx-6 border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-400">
            {error}
          </div>
        ) : shownCategories.length === 0 ? (
          <div className="flex flex-col items-center py-14 text-center">
            <IconSearch size={36} className="mb-3 text-zinc-600" />
            <p className="text-sm font-semibold text-[#f3e3c7]">
              {search ? "Produk tidak ditemukan" : "Belum ada produk"}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              {search ? "Coba kata kunci lain." : "Tidak ada item di kategori ini."}
            </p>
          </div>
        ) : (
          <div className="space-y-8 px-6">
            {shownCategories.map((cat) => (
              <section key={cat} ref={(el) => (sectionRefs.current[cat] = el)}>
                {/* Category Header (display name) */}
                <div className="mb-3 flex items-center justify-between border-b border-[#2a2a35] pb-2">
                  <h2 className="text-[12px] font-extrabold uppercase tracking-wide text-[#f3e3c7] [letter-spacing:-0.6px]">
                    {cat}
                  </h2>
                  <span className="text-[10px] font-medium text-zinc-400 [letter-spacing:-0.5px]">
                    {productCounts[cat] ?? filteredGroups[cat]?.length ?? 0} items
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2.5">
                  {filteredGroups[cat].map((product) => {
                    const inCart = cart[product.id];
                    return (
                      <div
                        key={product.id}
                        className="flex w-full items-center gap-3 border border-[#2a2a35] bg-[#18181e] px-3.5 py-3"
                      >
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="min-w-0 truncate text-[17px] font-extrabold text-[#f3e3c7] [letter-spacing:-0.85px]">
                            {product.name}
                          </p>
                          <div className="mt-1 flex w-full items-center justify-between gap-3">
                            <p className="text-[17px] font-extrabold text-[#f48149] [letter-spacing:-0.85px]">
                              {formatIDR(product.price)}
                            </p>
                            {inCart && inCart.qty > 0 ? (
                              <div className="flex items-center gap-2 border border-[#f48149] bg-[#22222b] px-2.5 py-1.5">
                                <button
                                  type="button"
                                  aria-label="Kurangi"
                                  onClick={() => removeFromCart(product.id)}
                                  className="text-[#f3e3c7] transition hover:text-[#f48149]"
                                >
                                  <IconMinus size={14} />
                                </button>
                                <span className="min-w-[16px] text-center text-[12px] font-extrabold text-[#f3e3c7] [letter-spacing:-0.6px]">
                                  {inCart.qty}
                                </span>
                                <button
                                  type="button"
                                  aria-label="Tambah"
                                  onClick={() => addToCart(product)}
                                  className="text-[#f48149] transition hover:text-[#f48149]"
                                >
                                  <IconPlus size={14} />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => addToCart(product)}
                                className="flex items-center gap-1 border border-[#f48149] bg-[#22222b] px-3 py-1.5 text-[12px] font-extrabold text-[#f3e3c7] transition hover:bg-white/[0.06] [letter-spacing:-0.6px]"
                              >
                                <IconPlus size={12} />
                                ADD
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* FLOATING CART DOCK */}
        {cartCount > 0 && (
          <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] border-t border-[#2a2a35] bg-[#0a0a0c]/90 backdrop-blur">
            <div className="px-6 pb-4 pt-4">
              <button
                type="button"
                onClick={() => setShowOrder(true)}
                className="flex min-h-[54px] w-full items-center justify-between gap-4 bg-[#f48149] px-4 transition hover:brightness-110 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <span className="border border-white/[0.082] bg-[#f3e3c7] px-2.5 py-1 text-[17px] font-extrabold text-[#f48149] [letter-spacing:-0.85px]">
                    {cartCount}
                  </span>
                  <div className="text-left text-[#f3e3c7]">
                    <p className="text-[10px] font-medium [letter-spacing:-0.5px]">
                      {cartCount} item{cartCount > 1 ? "s" : ""} in Basket
                    </p>
                    <p className="text-[17px] font-extrabold [letter-spacing:-0.85px]">
                      Estimated: {formatIDR(cartTotal)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-extrabold text-[#f3e3c7] [letter-spacing:-0.7px]">
                    View Order
                  </span>
                  <IconChevronRight size={18} className="text-[#f3e3c7]" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* SIDEBAR HAMBURGER (dari kanan, tree accordion) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="absolute right-0 top-0 flex h-full w-[280px] max-w-[85%] animate-slide-left flex-col border-l border-[#2a2a35] bg-[#18181e] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#f48149] [letter-spacing:-0.5px]">
                    Rooftop Fourtyfive.
                  </p>
                  <h2 className="text-[17px] font-extrabold text-[#f3e3c7] [letter-spacing:-0.85px]">
                    Menu Categories
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Tutup"
                  className="flex h-8 w-8 items-center justify-center border border-white/[0.082] bg-[#1f1f23] text-[#aaaaaa] transition hover:text-[#f3e3c7]"
                >
                  <IconX size={16} />
                </button>
              </div>

              <div className="flex-1 space-y-1.5 overflow-y-auto">
                {/* ALL button */}
                <button
                  type="button"
                  onClick={() => selectCategory("ALL")}
                  className={`flex w-full items-center justify-between border px-4 py-2.5 text-left transition ${
                    activeCategory === "ALL"
                      ? "border-white/[0.082] bg-[#f48149] text-[#f3e3c7]"
                      : "border-[#2a2a35] bg-[#121216] text-[#f3e3c7] hover:bg-[#2a2a2a]"
                  }`}
                >
                  <span className="text-[12px] font-extrabold [letter-spacing:-0.6px]">
                    ALL / Semua
                  </span>
                  <span className="text-[10px] font-medium text-zinc-400 [letter-spacing:-0.5px]">
                    {allProducts.length} items
                  </span>
                </button>

                {/* Tree accordion groups */}
                {SIDEBAR_GROUPS.map((group) => {
                  const isOpen = !!expandedGroups[group.id];
                  return (
                    <div key={group.id} className="overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        className="flex w-full items-center justify-between gap-2 border border-[#2a2a35] bg-[#121216] px-4 py-2.5 text-left transition hover:bg-[#2a2a2a]"
                      >
                        <span className="truncate text-[12px] font-extrabold text-[#f3e3c7] [letter-spacing:-0.6px]">
                          {group.label}
                        </span>
                        <IconChevronDown
                          size={16}
                          className={`shrink-0 text-zinc-400 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="ml-3 mt-1 space-y-0.5 border-l border-[#2a2a35] pl-3">
              })}
            </div>
          </div>
        </div>
      )}

      {/* ORDER SHEET (Cart → Confirm → Receipt) */}
      <OrderSheet
        open={showOrder}
        onClose={() => setShowOrder(false)}
        cartItems={cartItems}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onClear={clearCart}
        setVariant={setVariant}
        subtotal={cartTotal}
      />
    </main>
  );
}