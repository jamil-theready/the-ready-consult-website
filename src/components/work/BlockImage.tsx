import type { Media } from "@/lib/work-types";

function BrowserMockup({ media, url }: { media: Media; url?: string }) {
  return (
    <div className="overflow-hidden ring-1 ring-black/10 bg-background">
      <div className="flex items-center gap-2 h-10 px-4 bg-gray-100 border-b border-gray-200">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex-1 max-w-md h-6 bg-slab border border-gray-200 flex items-center px-3 text-[11px] text-gray-400 truncate">
          {url ?? ""}
        </div>
      </div>
      <img src={media.src} alt={media.alt} className="w-full h-[64vh] object-cover object-top" />
    </div>
  );
}

export default function BlockImage({
  media, caption, fullBleed, mockup,
}: { media: Media; caption?: string; fullBleed?: boolean; mockup?: "browser" }) {
  if (mockup === "browser") {
    return (
      <figure className="max-w-[1200px] mx-auto px-6 my-16 sm:my-24">
        <BrowserMockup media={media} url={caption} />
      </figure>
    );
  }

  return (
    <figure className={fullBleed ? "px-2 sm:px-3 my-4" : "max-w-[1400px] mx-auto px-6 my-12"}>
      <img
        src={media.src}
        alt={media.alt}
        className={
          fullBleed
            ? "w-full h-[70vh] sm:h-[88vh] object-cover object-top rounded-2xl"
            : "w-full rounded-2xl"
        }
      />
      {caption && <figcaption className="mt-3 text-sm text-gray-500 text-center">{caption}</figcaption>}
    </figure>
  );
}
