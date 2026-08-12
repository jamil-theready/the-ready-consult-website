import type { CaseMeta, Media } from "@/lib/work-types";

function RailItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-gray-400">{label}</p>
      <div className="mt-1.5 text-sm font-medium text-navy leading-relaxed">{children}</div>
    </div>
  );
}

export default function BlockHero({
  client, headline, meta, media,
}: { client: string; headline: string; meta: CaseMeta; media: Media }) {
  const isVideo = media.kind === "video" || /\.(mp4|webm|mov)$/i.test(media.src);
  const contain = (media.fit ?? "cover") === "contain";

  return (
    <header>
      {/* Hero media — 60% viewport height */}
      {media.src && (
        <div className={"w-full h-[60vh] overflow-hidden " + (contain ? "bg-white flex items-center justify-center" : "")}>
          {isVideo ? (
            <video
              src={media.src}
              autoPlay
              muted
              loop
              playsInline
              className={contain ? "w-full h-full object-contain" : "w-full h-full object-cover"}
              style={
                contain
                  ? {
                      WebkitMaskImage: "radial-gradient(120% 120% at 50% 50%, #000 70%, transparent 100%)",
                      maskImage: "radial-gradient(120% 120% at 50% 50%, #000 70%, transparent 100%)",
                    }
                  : undefined
              }
            />
          ) : (
            <img
              src={media.src}
              alt={media.alt}
              className={contain ? "w-full h-full object-contain" : "w-full h-full object-cover object-top"}
            />
          )}
        </div>
      )}

      {/* Title + info right below */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-12 sm:pt-16 pb-8 flex flex-col md:flex-row gap-10 md:gap-16">
        <aside className="md:w-56 lg:w-64 shrink-0 md:border-r md:border-gray-200 md:pr-10 space-y-6">
          <RailItem label="Year">{meta.year}</RailItem>
          <RailItem label="Deliverables">
            <ul className="space-y-0.5">
              {meta.services.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </RailItem>
          {meta.role && <RailItem label="Role">{meta.role}</RailItem>}
          {meta.location && <RailItem label="Location">{meta.location}</RailItem>}
        </aside>

        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue mb-5">{client}</p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-navy leading-[1.04] tracking-tight">
            {headline}
          </h1>
        </div>
      </div>
    </header>
  );
}
