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

// Urutan kategori saat tampil di "ALL"
const CATEGORY_ORDER = [
  "CARBOHYDRATE BOOSTERS",
  "HEAVYWEIGHT CHAMPIONS",
  "THE MARINE TOURNAMENT",
  "TACTICAL RECHARGE & RECOVERY",
  "HALF-TIME BITES & SNACK LEAGUE",
  "THE ADDITIONAL PLAYERS",
  "CAFFEINE INJECTORS",
  "CLUTCH PERFORMANCE",
  "ENDURANCE LAB & HYPERDRIVE",
  "FLUID HYDRATION & REFRESHER",
  "POST-MATCH HEALING",
  "THE CELEBRATION",
  "Rokok",
];

const BG_IMAGE =
  "https://api.builder.io/api/v1/image/assets/TEMP/979e074464d8e4c44b55b3a495ff275e80e38426?placeholderIfAbsent=true";

// Grup sidebar (Tree/Accordion)
const SIDEBAR_GROUPS = [
  {
    id: "foods",
    label: "Makanan",
    categories: [
      "CARBOHYDRATE BOOSTERS",
      "HEAVYWEIGHT CHAMPIONS",
      "THE MARINE TOURNAMENT",
      "TACTICAL RECHARGE & RECOVERY",
      "HALF-TIME BITES & SNACK LEAGUE",
      "THE ADDITIONAL PLAYERS",
    ],
  },
  {
    id: "drinks",
    label: "Minuman",
    categories: [
      "CAFFEINE INJECTORS",
      "CLUTCH PERFORMANCE",
      "ENDURANCE LAB & HYPERDRIVE",
      "FLUID HYDRATION & REFRESHER",
      "POST-MATCH HEALING",
      "THE CELEBRATION",
    ],
  },
  {
    id: "others",
    label: "Rokok & Add-ons",
    categories: ["Rokok"],
  },
];

// Nama dasar tanpa suffix varian
function baseName(name) {
  return name.replace(/ Hot$/, "").replace(/ Ice$/, "");
}

// Apakah nama produk mengandung varian HOT/ICE
function hasVariantName(name) {
  return name.endsWith(" Hot") || name.endsWith(" Ice");
}

export default function MenuPage() {
  const router = useRouter();
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

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
      .then(([prodJson, catJson]) => {
        if (!active) return;
        const prods = prodJson.products || [];
        const cats = catJson.categories || [];
        setAllProducts(prods);

        const counts = {};
        cats.forEach((c) => {
          counts[c.name] = prods.filter((p) => p.category === c.name).length;
        });
        setProductCounts(counts);
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

  // Kelompokkan produk per kategori: gabung varian Hot/Ice jadi satu item (nama dasar)
  const groupedByCategory = useMemo(() => {
    const groups = {};
    for (const p of allProducts) {
      const cat = p.category;
      const base = baseName(p.name);
      if (!groups[cat]) groups[cat] = new Map();
      if (!groups[cat].has(base)) {
        groups[cat].set(base, {
          id: p.id,
          name: base,
          category: cat,
          code: p.code ? p.code.replace(/-(HOT|ICE)$/, "") : "",
          price: p.price,
          hasVariants: hasVariantName(p.name),
        });
      } else if (hasVariantName(p.name)) {
        groups[cat].get(base).hasVariants = true;
      }
    }
    const out = {};
    for (const [cat, map] of Object.entries(groups)) {
      out[cat] = [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
    }
    return out;
  }, [allProducts]);

  // Kategori yang tampil (urut sesuai CATEGORY_ORDER)
  const visibleCategories = useMemo(
    () => CATEGORY_ORDER.filter((c) => (groupedByCategory[c]?.length ?? 0) > 0),
    [groupedByCategory]
  );

  // Filter hasil berdasarkan search (client-side)
  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groupedByCategory;
    const out = {};
    for (const [cat, items] of Object.entries(groupedByCategory)) {
      const matched = items.filter((p) => p.name.toLowerCase().includes(q));
      if (matched.length) out[cat] = matched;
    }
    return out;
  }, [groupedByCategory, search]);

  const shownCategories = useMemo(() => {
    if (activeCategory === "ALL") {
      return visibleCategories.filter((c) => (filteredGroups[c]?.length ?? 0) > 0);
    }
    return (filteredGroups[activeCategory]?.length ?? 0) > 0 ? [activeCategory] : [];
  }, [activeCategory, visibleCategories, filteredGroups]);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );
  const cartTotal = useMemo(
    () =>
      Object.values(cart).reduce((sum, item) => sum + item.qty * item.product.price, 0),
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
      className="flex min-h-screen flex-col bg-[#0a0a0c] pb-32"
      style={{
        backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.18) 0%, rgba(10,10,12,0) 45%), linear-gradient(180deg, rgba(10,10,12,0.82) 0%, rgba(10,10,12,0.68) 40%, rgba(10,10,12,0.94) 100%), url(${BG_IMAGE})`,
        backgroundSize: "auto, auto, cover",
        backgroundPosition: "center, center, center",
        backgroundRepeat: "no-repeat, no-repeat, no-repeat",
      }}
    >
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
          aria-label="Buka daftar kategori"
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2a2a35] bg-[#18181e] transition hover:bg-[#1f1f27]"
        >
          <IconMenu2 size={20} className="text-white" />
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

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="mx-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-400">
          {error}
        </div>
      ) : shownCategories.length === 0 ? (
        <div className="flex flex-col items-center py-14 text-center">
          <IconSearch size={36} className="mb-3 text-zinc-600" />
          <p className="text-sm font-semibold text-zinc-300">
            {search ? "Produk tidak ditemukan" : "Belum ada produk"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {search
              ? "Coba kata kunci lain."
              : "Tidak ada item di kategori ini."}
          </p>
        </div>
      ) : (
        <div className="space-y-8 px-6">
          {shownCategories.map((cat) => (
            <section key={cat} ref={(el) => (sectionRefs.current[cat] = el)}>
              {/* Category Header */}
              <div className="mb-3 flex items-center justify-between border-b border-[#2a2a35] pb-2">
                <h2 className="text-[15px] font-bold uppercase tracking-wide text-orange-500">
                  {cat}
                </h2>
                <span className="text-[11px] text-zinc-500">
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
                      className="flex w-full items-center gap-3 rounded-2xl border border-[#2a2a35] bg-[#18181e] px-3.5 py-3"
                    >
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="min-w-0 truncate text-[14px] font-semibold text-white">
                          {product.name}
                        </p>
                        <div className="mt-1 flex w-full items-center justify-between gap-3">
                          <p className="text-[15px] font-bold text-orange-500">
                            {formatIDR(product.price)}
                          </p>
                          {inCart && inCart.qty > 0 ? (
                            <div className="flex items-center gap-2 rounded-lg border border-orange-500 bg-[#22222b] px-2.5 py-1.5">
                              <button
                                type="button"
                                aria-label="Kurangi"
                                onClick={() => removeFromCart(product.id)}
                                className="text-white transition hover:text-orange-500"
                              >
                                <IconMinus size={14} />
                              </button>
                              <span className="min-w-[16px] text-center text-[13px] font-bold text-white">
                                {inCart.qty}
                              </span>
                              <button
                                type="button"
                                aria-label="Tambah"
                                onClick={() => addToCart(product)}
                                className="text-orange-500 transition hover:text-orange-400"
                              >
                                <IconPlus size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addToCart(product)}
                              className="flex items-center gap-1 rounded-lg border border-orange-500 bg-[#22222b] px-3 py-1.5 text-[12px] font-bold text-white transition hover:bg-orange-500/20"
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
              className="flex min-h-[54px] w-full items-center justify-between gap-4 rounded-2xl bg-orange-500 px-4 transition hover:bg-orange-600 active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-white px-2.5 py-1 text-[13px] font-bold text-orange-500">
                  {cartCount}
                </span>
                <div className="text-left">
                  <p className="text-[15px] font-bold text-white">
                    {cartCount} item{cartCount > 1 ? "s" : ""} in Basket
                  </p>
                  <p className="text-[11px] text-white/80">
                    Estimated: {formatIDR(cartTotal)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-white">View Order</span>
                <IconChevronRight size={18} className="text-white" />
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-orange-500">
                  Rooftop Fourtyfive.
                </p>
                <h2 className="text-lg font-bold text-white">Menu Categories</h2>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Tutup"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2a2a2a] text-[#aaaaaa] transition hover:text-white"
              >
                <IconX size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-1.5 overflow-y-auto">
              {/* ALL button */}
              <button
                type="button"
                onClick={() => selectCategory("ALL")}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left transition ${
                  activeCategory === "ALL"
                    ? "border-orange-500 bg-orange-500/15 text-orange-500"
                    : "border-[#2a2a35] bg-[#121216] text-white hover:bg-[#2a2a2a]"
                }`}
              >
                <span className="text-sm font-bold">ALL / Semua</span>
                <span className="text-[11px] text-zinc-500">
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
                      className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#2a2a35] bg-[#121216] px-4 py-2.5 text-left transition hover:bg-[#2a2a2a]"
                    >
                      <span className="truncate text-[14px] font-bold text-zinc-300">
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
                        {group.categories
                          .filter((c) => (productCounts[c] ?? 0) > 0)
                          .map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => selectCategory(cat)}
                              className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[13px] transition hover:bg-[#2a2a2a] ${
                                activeCategory === cat
                                  ? "font-semibold text-orange-500"
                                  : "text-zinc-400"
                              }`}
                            >
                              <span className="truncate">{cat}</span>
                              <span className="shrink-0 text-[10px] text-zinc-500">
                                {productCounts[cat] ?? 0}
                              </span>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                );
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
        subtotal={cartTotal}
      />
    </main>
  );
}