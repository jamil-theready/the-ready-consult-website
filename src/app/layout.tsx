import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-4HYJNLYDBD";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Mono carries the eyebrows, labels, counters and captions. It is the most
// recognisable trait of the reference design and costs one font load.
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
  },
  title: "The Ready Consult | Websites and SEO for Contractors",
  description:
    "We build websites and Google Business Profiles for construction and landscaping companies, then keep you showing up so the calls keep coming.",
  keywords:
    "contractor website, masonry marketing, landscaping SEO, Google Business Profile, local SEO for contractors, construction lead generation",
  metadataBase: new URL("https://www.thereadyconsult.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "The Ready Consult | Websites and SEO for Contractors",
    description:
      "Websites, Google Business Profiles and SEO for construction and landscaping companies.",
    url: "https://www.thereadyconsult.com",
    siteName: "The Ready Consult",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://www.thereadyconsult.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Ready Consult, websites and SEO for contractors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Ready Consult | Websites and SEO for Contractors",
    description:
      "Websites, Google Business Profiles and SEO for construction and landscaping companies.",
    images: ["https://www.thereadyconsult.com/og-image.png"],
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
    <html lang="en" className={`${inter.variable} ${robotoMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/*
          Sets the theme BEFORE first paint. It has to be blocking and inline —
          anything deferred, or anything reading localStorage from a React
          effect, renders one theme then swaps after paint, which IS the flash.
          Falls back to the OS preference, then to dark if storage throws.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('trc-theme');" +
              "if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}" +
              "document.documentElement.dataset.theme=t;}" +
              "catch(e){document.documentElement.dataset.theme='dark';}})();",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
        <img
          src="https://tracker.metricool.com/c3po.jpg?hash=e716baa6b1484524a0dd6332688afc52"
          alt=""
          aria-hidden="true"
          width={1}
          height={1}
          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
        />
      </body>
    </html>
  );
}
