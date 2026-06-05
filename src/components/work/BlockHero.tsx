import type { CaseMeta, Media } from "@/lib/work-types";

function RailItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <div className="mt-1.5 text-sm font-medium text-navy leading-relaxed">{children}</div>
    </div>
  );
}

export default function BlockHero({
  client, headline, meta, media,
}: { client: string; headline: string; meta: CaseMeta; media: Media }) {
  return (
    <header className="pt-36 sm:pt-40 pb-16">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left meta rail */}
        <aside className="md:w-56 lg:w-64 shrink-0 md:border-r md:border-gray-200 md:pr-10 space-y-7">
          <RailItem label="Year">{meta.year}</RailItem>
          <RailItem label="Deliverables">
            <ul className="space-y-0.5">
              {meta.services.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </RailItem>
          {meta.role && <RailItem label="Role">{meta.role}</RailItem>}
          {meta.location && <RailItem label="Location">{meta.location}</RailItem>}
        </aside>

        {/* Giant headline */}
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue mb-6">{client}</p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-navy leading-[1.04] tracking-tight">
            {headline}
          </h1>
        </div>
      </div>

      {/* Full-bleed framed hero image */}
      {media.src && (
        <div className="mt-16 px-2 sm:px-3">
          <img
            src={media.src}
            alt={media.alt}
            className="w-full h-[60vh] sm:h-[88vh] object-cover object-top rounded-2xl"
          />
        </div>
      )}
    </header>
  );
}
