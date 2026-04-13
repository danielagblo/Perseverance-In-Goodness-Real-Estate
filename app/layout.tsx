import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Perseverance in Goodness | Elite Real Estate",
  description: "Experience luxury living with a curated collection of the most exclusive residences. Designed for the relentless pursuit of perfection.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Perseverance in Goodness | Elite Real Estate",
    description: "Discover exclusive luxury living designed for the relentless pursuit of perfection.",
    url: "/",
    siteName: "Perseverance in Goodness",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Perseverance in Goodness Luxury Real Estate",
      },
    ],
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Perseverance in Goodness | Elite Real Estate",
    description: "Exclusive luxury residences designed for the relentless pursuit of perfection.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
        lang="en"
        className={`${inter.variable} ${playfair.variable} h-full antialiased`}
        suppressHydrationWarning
      >
      <body className="min-h-full flex flex-col">
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
