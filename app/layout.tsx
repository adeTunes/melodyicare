import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://melodyicare.vercel.app"),
  title: "MelodyiCare | Caring, Compassion and Comfort",
  description:
    "Premium care service agency committed to delivering personalized, professional and compassionate support to individuals and families in Lagos, Nigeria.",
  keywords: [
    "caregiver",
    "elderly care",
    "childcare",
    "lagos",
    "nigeria",
    "home care",
    "nursing",
    "melodyicare",
    "MelodyiCare",
  ],
  authors: [{ name: "MelodyiCare" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-32x32.png",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://melodyicare.vercel.app",
    siteName: "MelodyiCare",
    title: "MelodyiCare | Professional Care Services in Lagos",
    description:
      "Empowering families to live with comfort, dignity, and peace of mind.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MelodyiCare - Caring, Compassion and Comfort",
      },
      {
        url: "/og-square.png",
        width: 500,
        height: 500,
        alt: "MelodyiCare Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MelodyiCare | Professional Care Services in Lagos",
    description:
      "Empowering families to live with comfort, dignity, and peace of mind.",
    images: ["/og-image.png", "/og-square.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
