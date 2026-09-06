import type { Media } from "@/lib/work-types";

function Frame({ media }: { media: Media }) {
  const isVideo = media.kind === "video" || /\.(mp4|webm|mov)$/i.test(media.src);
  return isVideo ? (
    <video src={media.src} autoPlay muted loop playsInline className="w-full ring-1 ring-black/10" />
  ) : (
    <img src={media.src} alt={media.alt} className="w-full ring-1 ring-black/10" />
  );
}

// Two-column feature: text + media, alternating sides via `flip`.
export default function BlockSplit({
  subheading, body, media, flip, tone = "light",
}: { subheading?: string; body: string; media: Media; flip?: boolean; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <section className={(dark ? "bg-void" : "") + " py-14 sm:py-20"}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className={flip ? "md:order-2" : ""}>
          {subheading && (
            <h2 className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue mb-5">
              <span className="inline-block h-px w-8 bg-blue" />
              {subheading}
            </h2>
          )}
          <p className={(dark ? "text-white/90" : "text-navy/90") + " text-xl sm:text-2xl font-light leading-[1.5]"}>
            {body}
          </p>
        </div>
        <div className={flip ? "md:order-1" : ""}>
          <Frame media={media} />
        </div>
      </div>
    </section>
  );
}
