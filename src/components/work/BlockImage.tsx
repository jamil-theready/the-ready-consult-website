import type { Media } from "@/lib/work-types";

export default function BlockImage({ media, caption, fullBleed }: { media: Media; caption?: string; fullBleed?: boolean }) {
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
