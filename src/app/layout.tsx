import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CropShield AI — Predict. Protect. Prevent.",
    template: "%s · CropShield AI",
  },
  description:
    "CropShield AI is an early-warning workspace for crop threats. This hackathon demo includes a farmer dashboard, field reports, a health scanner interface, and a Leaflet threat map using clearly labelled sample data.",
  applicationName: "CropShield AI",
  keywords: [
    "crop health",
    "agriculture",
    "early warning",
    "farm monitoring",
    "Kenya",
  ],
  openGraph: {
    title: "CropShield AI — Predict. Protect. Prevent.",
    description:
      "A farmer-first crop threat monitoring workspace. Hackathon demo with clearly labelled sample data.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d2017",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <a
          href="#main-content"
          className="sr-only z-[100] rounded-lg bg-forest-950 px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>

        <div className="bg-forest-950 text-forest-100">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2.5 gap-y-1 px-4 py-2 text-[11px] sm:px-6 lg:px-8">
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-citron-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-citron-300" />
            </span>
            <span className="font-bold uppercase tracking-[0.16em] text-citron-300">
              Hackathon demo
            </span>
            <span className="hidden text-forest-200/80 sm:inline">
              Sample data only — AI diagnosis, live weather and outbreak feeds are
              not connected.
            </span>
            <span className="text-forest-200/80 sm:hidden">Sample data only.</span>
          </div>
        </div>

        <SiteHeader />

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
