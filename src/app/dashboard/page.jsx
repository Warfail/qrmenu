"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRDisplay from "@/components/QRDisplay";

const emptyMenuItem = {
  title: "",
  link: "",
  type: "link",
  icon: "",
};

const emptySettings = {
  title: "",
  description: "",
  whatsappNumber: "",
  googlePlaceId: "",
  avatar: "",
};

export default function DashboardPage() {
  const router = useRouter();

  const [authLoading, setAuthLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [menu, setMenu] = useState([]);
  const [settings, setSettings] = useState(emptySettings);
  const [dataLoading, setDataLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setAuthLoading(true);
        const res = await fetch("/api/admin/dashboard", {
          cache: "no-store",
        });

        if (res.status === 401) {
          router.replace("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Gagal memuat data dashboard.");
        }

        setAuthorized(true);
        const data = await res.json();
        setMenu(data.menu || []);
        setSettings({ ...emptySettings, ...(data.settings || {}) });
      } catch (err) {
        console.error(err);
        setAuthorized(false);
      } finally {
        setAuthLoading(false);
        setDataLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  function handleMenuChange(index, field, value) {
    setMenu((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function addMenuItem() {
    setMenu((prev) => [...prev, { ...emptyMenuItem }]);
  }

  function deleteMenuItem(index) {
    setMenu((prev) => prev.filter((_, i) => i !== index));
  }

  function moveMenuItem(index, direction) {
    setMenu((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function handleSettingsChange(field, value) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage(null);

    try {
      const menuWithOrder = menu.map((item, index) => ({
        ...item,
        order: index,
      }));

      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menu: menuWithOrder,
          settings,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan perubahan.");
      }

      setMenu(data.menu || []);
      setSettings({ ...emptySettings, ...(data.settings || {}) });

      setSaveMessage({ type: "success", text: "Perubahan berhasil disimpan." });
    } catch (err) {
      setSaveMessage({
        type: "error",
        text: err.message || "Terjadi kesalahan saat menyimpan.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/login");
    router.refresh();
  }

  if (authLoading || dataLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Mengalihkan ke halaman login...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <a
              href="/landing"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Lihat Landing Page
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* QR Section */}
          <section className="lg:col-span-1">
            <QRDisplay />
          </section>

          {/* Settings Section */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Settings
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={settings.title}
                    onChange={(e) =>
                      handleSettingsChange("title", e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Nama bisnis"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={settings.description}
                    onChange={(e) =>
                      handleSettingsChange("description", e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Deskripsi singkat"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) =>
                      handleSettingsChange("whatsappNumber", e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="6281234567890"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Google Place ID
                  </label>
                  <input
                    type="text"
                    value={settings.googlePlaceId}
                    onChange={(e) =>
                      handleSettingsChange("googlePlaceId", e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="ChIJ..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    value={settings.avatar}
                    onChange={(e) =>
                      handleSettingsChange("avatar", e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Menu Section */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Menu Items</h2>
            <button
              type="button"
              onClick={addMenuItem}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              + Tambah Menu
            </button>
          </div>

          {menu.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Belum ada menu. Klik "Tambah Menu" untuk membuat menu baru.
            </p>
          ) : (
            <div className="space-y-4">
              {menu.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto_auto]">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        handleMenuChange(index, "title", e.target.value)
                      }
                      placeholder="Judul menu"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <input
                      type="text"
                      value={item.link}
                      onChange={(e) =>
                        handleMenuChange(index, "link", e.target.value)
                      }
                      placeholder="Link URL"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <select
                      value={item.type}
                      onChange={(e) =>
                        handleMenuChange(index, "type", e.target.value)
                      }
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="link">Link</option>
                      <option value="popup">Popup</option>
                    </select>
                    <input
                      type="text"
                      value={item.icon}
                      onChange={(e) =>
                        handleMenuChange(index, "icon", e.target.value)
                      }
                      placeholder="Icon (emoji/URL)"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveMenuItem(index, -1)}
                      disabled={index === 0}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ↑ Naik
                    </button>
                    <button
                      type="button"
                      onClick={() => moveMenuItem(index, 1)}
                      disabled={index === menu.length - 1}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ↓ Turun
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMenuItem(index)}
                      className="ml-auto rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Save Button */}
        <div className="sticky bottom-4 mt-6 flex flex-col items-center gap-2">
          {saveMessage && (
            <div
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                saveMessage.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {saveMessage.text}
            </div>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full max-w-sm rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Save Changes"}
          </button>
        </div>
      </div>
    </main>
  );
}