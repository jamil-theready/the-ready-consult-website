// src/app/work/page.tsx
import type { Metadata } from "next";
import { getFeaturedCases, getGridCases } from "@/lib/work";

export const metadata: Metadata = {
  title: "Work — The Ready Consult",
  description: "Selected websites, video, and marketing work by The Ready Consult.",
};

export default function WorkIndexPage() {
  const featured = getFeaturedCases();
  const grid = getGridCases();

  return (
    <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-28 pb-24">
      <h1 className="text-4xl sm:text-6xl font-semibold text-navy">Our work</h1>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl">
        Websites, video, and marketing systems we have designed, built, and grown.
      </p>

      <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
        {featured.map((c) => (
          <a key={c.slug} href={`/work/${c.slug}`} className="group block">
            <div className="overflow-hidden rounded-xl">
              <img src={c.thumbnail} alt={c.client} className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-navy">{c.client}</h2>
            <p className="text-gray-600">{c.headline}</p>
            <p className="mt-1 text-sm text-gray-400">{c.meta.services.join(" · ")}</p>
          </a>
        ))}
      </section>

      {grid.length > 0 && (
        <section className="mt-24">
          <h2 className="text-sm uppercase tracking-wide text-gray-400">More work</h2>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {grid.map((c) => (
              <a key={c.slug} href={`/work/${c.slug}`} className="group block">
                <img src={c.thumbnail} alt={c.client} className="w-full aspect-square object-cover rounded-lg" />
                <p className="mt-2 text-sm text-navy">{c.client}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
