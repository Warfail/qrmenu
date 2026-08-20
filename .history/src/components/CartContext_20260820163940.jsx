"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const CART_STORAGE_KEY = "rooftop45_cart";

const CartContext = createContext(null);

// Nama dasar tanpa suffix varian
function baseName(name) {
  return String(name || "").replace(/ Hot$/, "").replace(/ Ice$/, "");
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});
  const [restoredCount, setRestoredCount] = useState(0);
  const [showRestored, setShowRestored] = useState(false);
  const loadedFromStorage = useRef(false);

  // 1. Load cart dari localStorage saat pertama kali
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          const cleaned = {};
          let count = 0;
          for (const [id, item] of Object.entries(parsed)) {
              if (item && item.product && item.product.id && item.qty > 0) {
                const name = item.product.name || "";
                cleaned[id] = {
                  product: {
                    id: item.product.id,
                    name: baseName(item.product.name),
                    category: item.product.category || "",
                    code: item.product.code || "",
                    price: Number(item.product.price) || 0,
                    hasVariants: !!item.product.hasVariants,
                    variants: item.product.variants || {},
                  },
                  variant: item.variant || null,
                  qty: item.qty,
                };
                count += item.qty;
              }
          }
          if (count > 0) {
            setCart(cleaned);
            setRestoredCount(count);
            setShowRestored(true);
            setTimeout(() => setShowRestored(false), 4000);
          }
        }
      }
    } catch {
      // abaikan data localStorage yang corrupt
    }
    loadedFromStorage.current = true;
  }, []);

  // 2. Save cart ke localStorage setiap items berubah
  useEffect(() => {
    if (!loadedFromStorage.current) return;
    try {
      if (Object.keys(cart).length === 0) {
        localStorage.removeItem(CART_STORAGE_KEY);
      } else {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      }
    } catch {
      // storage mungkin penuh / tidak tersedia
    }
  }, [cart]);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev[product.id];
      // Default varian: HOT jika tersedia, selain itu ICE (kalau cuma Ice), selain itu null
      let variant = null;
      if (product.variants) {
        variant = product.variants.HOT ? "HOT" : product.variants.ICE ? "ICE" : null;
      }
      return {
        ...prev,
        [product.id]: {
          product,
          variant,
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

  // Ganti varian HOT/ICE item di cart (sebelum confirm order)
  const setVariant = useCallback((baseId, variant) => {
    setCart((prev) => {
      const existing = prev[baseId];
      if (!existing) return prev;
      const v = existing.product.variants?.[variant];
      if (!v) return prev;
      return {
        ...prev,
        [baseId]: {
          ...existing,
          product: {
            ...existing.product,
            // update id/code ke id varian terkait (untuk konsistensi struk)
            metaId: v.id,
            code: v.code,
          },
          variant,
        },
      };
    });
  }, []);

  // 3. Clear cart setelah checkout + hapus dari localStorage
  const clearCart = useCallback(() => {
    setCart({});
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({ cart, addToCart, removeFromCart, setVariant, clearCart }),
    [cart, addToCart, removeFromCart, setVariant, clearCart]
  );

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* 4. Notifikasi item restored */}
      {showRestored && (
        <div className="fixed inset-x-0 top-0 z-[60] mx-auto w-full max-w-[480px] px-4 pt-3">
          <div className="animate-fade-in rounded-xl border border-orange-500/30 bg-[#18181e]/95 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg backdrop-blur">
            {restoredCount} item{restoredCount > 1 ? "s" : ""} restored
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}