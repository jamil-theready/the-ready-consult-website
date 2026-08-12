import type { CaseStudy } from "@/lib/work-types";

// Full-bleed vertical scroll of case panels (Analogue-style). Each panel is a
// designed case cover: full-bleed media + scrim + editorial label.
export default function WorkShowcase({ cases }: { cases: CaseStudy[] }) {
  return (
    <>
      {cases.map((c) => {
        const isVideo = /\.(mp4|webm|mov)$/i.test(c.thumbnail);
        return (
          <section
            key={c.slug}
            className="relative h-screen w-full bg-white p-2 sm:p-3 snap-start"
          >
            <a
              href={`/work/${c.slug}`}
              className="group relative block w-full h-full overflow-hidden rounded-2xl"
            >
              {isVideo ? (
                <video
                  src={c.thumbnail}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={c.thumbnail}
                  alt={c.client}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
              )}

              {/* Unifying scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/15" />

              {/* Editorial cover label */}
              <div className="absolute left-6 sm:left-12 bottom-10 sm:bottom-14 right-6 text-white">
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                  {c.meta.services.join(" · ")}
                </p>
                <h3 className="mt-3 text-4xl sm:text-6xl font-semibold tracking-tight">{c.client}</h3>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/90">
                  View case
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </span>
              </div>
            </a>
          </section>
        );
      })}
    </>
  );
}
