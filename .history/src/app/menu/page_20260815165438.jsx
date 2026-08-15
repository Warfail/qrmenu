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
