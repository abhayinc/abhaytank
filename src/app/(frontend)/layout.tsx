import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Abhay Tank — Visual & Brand Design for Travel Brands",
  description: "Specialist brand identity, marketing creatives, and digital designer for hotels, tour operators, and travel brands.",
  keywords: "abhay tank, travel brand design, travel graphic designer, hotel branding, tourism marketing creatives, hospitality visual designer, travel brochure design, figma travel UI UX, tourism marketier",
  openGraph: {
    title: "Abhay Tank — Visual & Brand Design for Travel Brands",
    description: "Specialist brand identity, marketing creatives, and digital designer for hotels, tour operators, and travel brands.",
    url: "https://tourismmarketier.com",
    siteName: "Abhay Tank Portfolio",
    images: [
      {
        url: "https://tourismmarketier.com/images/humsafar.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhay Tank — Visual & Brand Design for Travel Brands",
    description: "Specialist brand identity, marketing creatives, and digital designer for hotels, tour operators, and travel brands.",
    images: ["https://tourismmarketier.com/images/humsafar.png"],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✦</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        suppressHydrationWarning
        className={`${plusJakartaSans.variable} font-sans bg-[#fafafa] dark:bg-[#0f0f11] text-zinc-800 dark:text-zinc-300 antialiased selection:bg-zinc-200 selection:text-black dark:selection:bg-zinc-800 dark:selection:text-white transition-colors duration-300 min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
