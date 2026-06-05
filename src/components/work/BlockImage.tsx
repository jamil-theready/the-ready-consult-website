import type { Media } from "@/lib/work-types";

export default function BlockImage({ media, caption, fullBleed }: { media: Media; caption?: string; fullBleed?: boolean }) {
  return (
    <figure className={fullBleed ? "w-full my-12" : "max-w-[1400px] mx-auto px-4 sm:px-6 my-12"}>
      <img src={media.src} alt={media.alt} className={fullBleed ? "w-full" : "w-full rounded-xl"} />
      {caption && <figcaption className="mt-3 text-sm text-gray-500 text-center">{caption}</figcaption>}
    </figure>
  );
}
