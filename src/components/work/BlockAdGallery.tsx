import type { Media } from "@/lib/work-types";

export default function BlockAdGallery({ ads, note }: { ads: Media[]; note?: string }) {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 my-16">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ads.map((m, i) =>
          m.kind === "video"
            ? <video key={i} src={m.src} controls playsInline className="w-full rounded-lg" />
            : <img key={i} src={m.src} alt={m.alt} className="w-full rounded-lg" />
        )}
      </div>
      {note && <p className="mt-4 text-sm text-gray-500">{note}</p>}
    </section>
  );
}
