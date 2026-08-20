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

// Ambil varian HOT/ICE dari nama produk
function getVariant(name) {
  if (name.endsWith(" Hot")) return "HOT";
  if (name.endsWith(" Ice")) return "ICE";
  return null;
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
                  name,
                  category: item.product.category || "",
                  code: item.product.code || "",
                  price: Number(item.product.price) || 0,
                  stock: Number(item.product.stock) || 0,
                },
                variant: item.variant || getVariant(name),
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
      return {
        ...prev,
        [product.id]: {
          product,
          variant: getVariant(product.name),
          qty: existing ? existing.qty + 1 : 1,
        },
      };
    });
  }, []);
      return { ...prev, [productId]: { ...existing, qty: existing.qty - 1 } };
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
    () => ({ cart, addToCart, removeFromCart, clearCart }),
    [cart, addToCart, removeFromCart, clearCart]
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