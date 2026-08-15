import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "ROOFTOP FORTYFIVE",
  description: "Urban Society Studio — 45th Floor, Metropolis Tower Plaza",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={montserrat.variable}>
      <body className="min-h-screen bg-[#0a0a0c] antialiased">
        <CartProvider>
          <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#0a0a0c] shadow-2xl">
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}