import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import CartHydrator from "@/components/cart-hydrator";
import SiteHeader from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://cartify-frontend-rouge.vercel.app"
).replace(/\/$/, "");

const siteTitle = "Cartify | Electronics and Accessories Store";
const siteDescription =
  "Shop electronics and everyday accessories with clear product details and live stock availability.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Cartify",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Cartify",
    title: siteTitle,
    description: siteDescription,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Providers live here so auth and cart state are shared across every route. */}
        <AuthProvider>
          <CartHydrator />
          <SiteHeader />
          <main>{children}</main>
          <Toaster closeButton richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
