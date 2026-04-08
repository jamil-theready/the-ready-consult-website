import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Ready Consult | AI-First Growth & Media Partner",
  description:
    "AI-first consulting agency fusing strategy, content, and automation to convert attention into sustainable revenue. Fractional growth leadership, video production, SEO, and paid ads.",
  keywords:
    "AI consulting, growth marketing, fractional CMO, video production, SEO, paid ads, content strategy, AI marketing agency",
  metadataBase: new URL("https://www.thereadyconsult.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "The Ready Consult | AI-First Growth & Media Partner",
    description:
      "Strategy, content, and automation to convert attention into sustainable revenue.",
    url: "https://www.thereadyconsult.com",
    siteName: "The Ready Consult",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Ready Consult | AI-First Growth & Media Partner",
    description:
      "Strategy, content, and automation to convert attention into sustainable revenue.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
