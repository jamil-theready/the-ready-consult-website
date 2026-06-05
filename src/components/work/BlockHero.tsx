import type { CaseMeta, Media } from "@/lib/work-types";

export default function BlockHero({
  client, headline, meta, media,
}: { client: string; headline: string; meta: CaseMeta; media: Media }) {
  return (
    <header className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 pb-12">
      <p className="text-sm uppercase tracking-wide text-gray-500">{client}</p>
      <h1 className="mt-3 text-3xl sm:text-5xl font-semibold text-navy max-w-4xl">{headline}</h1>
      <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
        <div><dt className="text-gray-400">Year</dt><dd className="text-navy">{meta.year}</dd></div>
        <div className="col-span-1 sm:col-span-2"><dt className="text-gray-400">Services</dt><dd className="text-navy">{meta.services.join(", ")}</dd></div>
        {meta.location && <div><dt className="text-gray-400">Location</dt><dd className="text-navy">{meta.location}</dd></div>}
      </dl>
      {media.src && (
        <div className="mt-10">
          <img src={media.src} alt={media.alt} className="w-full rounded-xl" />
        </div>
      )}
    </header>
  );
}
