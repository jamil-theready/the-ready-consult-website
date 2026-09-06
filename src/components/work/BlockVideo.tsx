export default function BlockVideo({ src, poster, caption }: { src: string; poster?: string; caption?: string }) {
  return (
    <figure className="max-w-[1400px] mx-auto px-4 sm:px-6 my-12">
      <video src={src} poster={poster} controls playsInline preload="none" className="w-full " />
      {caption && <figcaption className="mt-3 text-sm text-gray-500 text-center">{caption}</figcaption>}
    </figure>
  );
}
