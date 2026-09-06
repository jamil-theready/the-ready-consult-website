import type { Media } from "@/lib/work-types";

export default function BlockGallery({ items, layout = "grid" }: { items: Media[]; layout?: "grid" | "scroll" }) {
  if (layout === "scroll") {
    return (
      <div className="my-12 flex gap-4 overflow-x-auto px-4 sm:px-6 snap-x">
        {items.map((m, i) => (
          <img key={i} src={m.src} alt={m.alt} className="h-[60vh] w-auto snap-center" />
        ))}
      </div>
    );
  }
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 my-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((m, i) => (
        <img key={i} src={m.src} alt={m.alt} className="w-full " />
      ))}
    </div>
  );
}
