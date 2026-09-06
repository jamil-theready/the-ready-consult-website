// src/app/work/page.tsx
import type { Metadata } from "next";
import { getFeaturedCases, getGridCases } from "@/lib/work";
import WorkShowcase from "@/components/work/WorkShowcase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Work | The Ready Consult",
  description: "Selected websites, video, and marketing work by The Ready Consult.",
  // Without this, Next falls back to metadataBase and /work emits the HOMEPAGE
  // canonical — telling Google the two are the same page. /blog already declares
  // its own; /work was the one that didn't, and it was the last piece of the
  // duplicate-content signal this branch set out to remove.
  alternates: { canonical: "/work" },
};

export default function WorkIndexPage() {
  const featured = getFeaturedCases();
  const grid = getGridCases();

  return (
    <>
      <Navbar />
      <main>
      {/* Intro panel */}
      <section className="h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-6xl sm:text-8xl font-semibold text-navy leading-none">Our work</h1>
        <p className="mt-2 text-4xl sm:text-6xl text-gray-400 font-semibold leading-none">See all</p>
      </section>

      {/* Full-bleed scroll of featured cases + tracking pill */}
      <WorkShowcase cases={featured} />

      {/* More work (grid-tier) */}
      {grid.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-24">
          <h2 className="text-sm uppercase tracking-wide text-gray-400">More work</h2>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {grid.map((c) => (
              <a key={c.slug} href={`/work/${c.slug}`} className="group block no-underline">
                <img src={c.thumbnail} alt={c.client} className="w-full aspect-square object-cover " />
                <p className="mt-2 text-sm text-navy">{c.client}</p>
              </a>
            ))}
          </div>
        </section>
      )}
      </main>
      <Footer />
    </>
  );
}
