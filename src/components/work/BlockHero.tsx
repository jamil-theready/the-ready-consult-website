import type { CaseMeta, Media } from "@/lib/work-types";

function RailItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-white/50">{label}</p>
      <div className="mt-1.5 text-sm font-medium text-white/90 leading-relaxed">{children}</div>
    </div>
  );
}

export default function BlockHero({
  client, headline, meta, media,
}: { client: string; headline: string; meta: CaseMeta; media: Media }) {
  const isVideo = media.kind === "video" || /\.(mp4|webm|mov)$/i.test(media.src);

  return (
    <header className="relative h-screen w-full overflow-hidden">
      {/* Animation / media slot (swap in the AI hero video here) */}
      {media.src &&
        (isVideo ? (
          <video
            src={media.src}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={media.src}
            alt={media.alt}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        ))}

      {/* Legibility scrim — darkest at the bottom where the title sits */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

      {/* Title + meta, moved down to the lower third */}
      <div className="relative h-full max-w-[1400px] mx-auto px-6 sm:px-10 flex items-end pb-16 sm:pb-20">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full">
          <aside className="md:w-56 lg:w-64 shrink-0 space-y-6">
            <RailItem label="Year">{meta.year}</RailItem>
            <RailItem label="Deliverables">
              <ul className="space-y-0.5">
                {meta.services.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </RailItem>
            {meta.location && <RailItem label="Location">{meta.location}</RailItem>}
          </aside>

          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-5">{client}</p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-white leading-[1.04] tracking-tight max-w-4xl">
              {headline}
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
