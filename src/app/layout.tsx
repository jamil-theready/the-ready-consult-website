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
  title: "Websites Built in One Day | The Ready Consult",
  description: "Your website built in one business day after confirmed onboarding, with monthly SEO and lead alerts. $103/month. No minimum term.",
  keywords:
    "small business website, local services website, home service website, monthly SEO, website subscription",
  metadataBase: new URL("https://www.thereadyconsult.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Websites Built in One Day | The Ready Consult",
    description:
      "Your website built in one business day after confirmed onboarding, with monthly SEO. $103/month. No minimum term.",
    url: "https://www.thereadyconsult.com",
    siteName: "The Ready Consult",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://www.thereadyconsult.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Ready Consult, websites and monthly SEO for small businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Websites Built in One Day | The Ready Consult",
    description:
      "Your website built in one business day after confirmed onboarding, with monthly SEO. $103/month. No minimum term.",
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
              // Dark only, for now. Light mode is BUILT — every token is in
              // globals.css and ThemeToggle still works — but the scroll-craft
              // engine writes --sc-canvas inline from the dark drift targets
              // and mixes its scrims from it, so a light page renders dark
              // scrims over dark ink (214 of 227 text nodes failed contrast).
              // Re-enabling light means re-initialising the engine per theme.
              "(function(){try{document.documentElement.dataset.theme='dark';" +
              "localStorage.setItem('trc-theme','dark');}" +
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
