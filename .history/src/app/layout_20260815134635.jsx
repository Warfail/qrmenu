import "./globals.css";

export const metadata = {
  title: "Linktree Landing",
  description: "Landing page with link menu and WhatsApp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}