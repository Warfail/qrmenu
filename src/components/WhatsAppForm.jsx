"use client";

import { useState } from "react";

export default function WhatsAppForm({ whatsappNumber }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmed = message.trim();

    if (!trimmed) {
      setError("Pesan tidak boleh kosong.");
      return;
    }

    if (!whatsappNumber) {
      setError("Nomor WhatsApp belum diatur.");
      return;
    }

    const phone = whatsappNumber.replace(/\D/g, "");
    const encoded = encodeURIComponent(trimmed);
    const url = `https://wa.me/${phone}?text=${encoded}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-white/30 bg-white/80 p-4 shadow-sm backdrop-blur"
    >
      <label
        htmlFor="whatsapp-message"
        className="mb-2 block text-left text-sm font-medium text-gray-700"
      >
        Kirim Pesan via WhatsApp
      </label>
      <textarea
        id="whatsapp-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="Tulis pesan Anda di sini..."
        className="w-full resize-y rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
      />
      {error && <p className="mt-2 text-left text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        className="mt-3 w-full rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
      >
        Kirim ke WhatsApp
      </button>
    </form>
  );
}