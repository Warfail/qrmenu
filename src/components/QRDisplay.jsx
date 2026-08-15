"use client";

import { useEffect, useState } from "react";

export default function QRDisplay() {
  const [dataUrl, setDataUrl] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadQR() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/qr/preview");
        if (!res.ok) {
          throw new Error("Failed to load QR preview");
        }
        const data = await res.json();
        if (active) {
          setDataUrl(data.dataUrl);
          setUrl(data.url);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load QR code");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadQR();

    return () => {
      active = false;
    };
  }, []);

  function downloadPNG() {
    const link = document.createElement("a");
    link.href = "/api/qr?format=png";
    link.download = "landing-qr.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function downloadSVG() {
    const link = document.createElement("a");
    link.href = "/api/qr?format=svg";
    link.download = "landing-qr.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">QR Code</h2>

      <div className="flex flex-col items-center">
        {loading && (
          <div className="flex h-52 w-52 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          </div>
        )}

        {!loading && error && (
          <div className="flex h-52 w-52 items-center justify-center rounded-lg bg-red-50 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && dataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt="QR Code pointing to the landing page"
            className="h-52 w-52 rounded-lg border border-gray-100"
          />
        )}

        {!loading && !error && url && (
          <p className="mt-3 max-w-full truncate text-xs text-gray-500">
            {url}
          </p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={downloadPNG}
            disabled={loading || Boolean(error)}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download PNG
          </button>
          <button
            type="button"
            onClick={downloadSVG}
            disabled={loading || Boolean(error)}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download SVG
          </button>
        </div>
      </div>
    </div>
  );
}