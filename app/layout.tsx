import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "Maison Noir | Premium Streetwear",
    template: "%s | Maison Noir"
  },
  description:
    "Premium T-shirts, shirts and overshirts in heavyweight cotton, refined neutrals and luxury streetwear silhouettes.",
  keywords: ["premium t-shirts", "streetwear shirts", "luxury fashion", "cash on delivery", "Maison Noir"],
  openGraph: {
    title: "Maison Noir",
    description: "Luxury streetwear essentials with cash on delivery.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
