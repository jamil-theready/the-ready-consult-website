import type { CaseMeta, Media } from "@/lib/work-types";

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{label}</dt>
      <dd className="mt-1.5 text-sm text-navy">{value}</dd>
    </div>
  );
}

export default function BlockHero({
  client, headline, meta, media,
}: { client: string; headline: string; meta: CaseMeta; media: Media }) {
  return (
    <header className="pt-32 sm:pt-36 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue">{client}</p>
        <h1 className="mt-5 max-w-5xl text-4xl sm:text-6xl lg:text-7xl font-semibold text-navy leading-[1.05] tracking-tight">
          {headline}
        </h1>
        <dl className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 border-t border-gray-200 pt-8 max-w-4xl">
          <MetaItem label="Year" value={meta.year} />
          <MetaItem label="Services" value={meta.services.join(", ")} />
          {meta.role && <MetaItem label="Role" value={meta.role} />}
          {meta.location && <MetaItem label="Location" value={meta.location} />}
        </dl>
      </div>
      {media.src && (
        <div className="mt-12 px-2 sm:px-3">
          <img
            src={media.src}
            alt={media.alt}
            className="w-full h-[60vh] sm:h-[82vh] object-cover object-top rounded-2xl"
          />
        </div>
      )}
    </header>
  );
}
