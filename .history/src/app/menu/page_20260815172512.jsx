"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconSearch,
  IconPlus,
  IconMinus,
  IconChevronRight,
} from "@tabler/icons-react";
import OrderSheet from "@/components/OrderSheet";

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
  const [showOrder, setShowOrder] = useState(false);

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

  const clearCart = useCallback(() => setCart({}), []);

  const cartItems = useMemo(
    () =>
      Object.values(cart).sort((a, b) =>
        a.product.name.localeCompare(b.product.name)
      ),
    [cart]
  );

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
          <div className="h-10 w-24 animate-pulse rounded-xl bg-[#18181e]" />
        ) : (
          categoriesList.map((cat) => {
            const active = activeCategory === cat.name;
            return (
              <button
                key={cat.id}
                ref={active ? activeRef : undefined}
                type="button"
                onClick={() => setActiveCategory(cat.name)}
                className={`shrink-0 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-orange-500 font-semibold text-white"
                    : "border border-[#2a2a35] bg-[#18181e] text-white hover:bg-[#1f1f27]"
                }`}
              >
                {cat.name}
              </button>
            );
          })
        )}
      </div>

      {/* MENU ITEMS LIST */}
      <section className="flex flex-col gap-3 px-6">
        {loadingProducts && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          </div>
        )}

        {!loadingProducts && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {!loadingProducts && !error && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center py-14 text-center">
            <IconSearch size={36} className="mb-3 text-zinc-600" />
            <p className="text-sm font-semibold text-zinc-300">
              {search ? "Produk tidak ditemukan" : "Belum ada produk"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {search
                ? `Coba kata kunci lain di "${activeCategory}".`
                : `Tidak ada item di kategori ${activeCategory}.`}
            </p>
          </div>
        )}

        {!loadingProducts &&
          !error &&
          filteredProducts.map((product) => {
            const inCart = cart[product.id];
            return (
              <div
                key={product.id}
                className="flex w-full items-center gap-3.5 rounded-2xl border border-[#2a2a35] bg-[#18181e] px-3.5 py-3.5"
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex w-full items-center gap-1.5">
                    <p className="min-w-0 flex-1 truncate text-[15px] font-bold text-white">
                      {product.name}
                    </p>
                    {product.stock > 0 && (
                      <span className="shrink-0 rounded bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-orange-500">
                        Stock {product.stock}
                      </span>
                    )}
                  </div>
                  <div className="flex w-full items-center justify-between gap-4">
                    <p className="text-[16px] font-bold text-orange-500">
                      {formatIDR(product.price)}
                    </p>
                    <div className="flex items-center">
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
                          className="flex items-center gap-1 rounded-lg border border-orange-500 bg-[#22222b] px-3 py-1.5 font-bold text-white transition hover:bg-orange-500/20"
                        >
                          <IconPlus size={12} />
                          ADD
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </section>

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
                <span className="rounded-lg bg-white px-2.5 py-1 text-[13px] font-extrabold text-orange-500">
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
          <div className="flex justify-center pb-2 pt-1">
            <div className="h-[5px] w-[139px] rounded-full bg-white" />
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
      />
    </main>
  );
}
