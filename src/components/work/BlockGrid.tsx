import type { Media } from "@/lib/work-types";

// Uniform image grid (2 or 3 columns).
export default function BlockGrid({ items, columns = 2 }: { items: Media[]; columns?: 2 | 3 }) {
  return (
    <section className="max-w-[1400px] mx-auto px-6 sm:px-10 my-12 sm:my-16">
      <div className={"grid gap-4 sm:gap-6 " + (columns === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2")}>
        {items.map((m, i) => (
          <img
            key={i}
            src={m.src}
            alt={m.alt}
            className="w-full rounded-xl object-cover aspect-[4/3] ring-1 ring-black/5"
          />
        ))}
      </div>
    </section>
  );
}
