import { getNextCase } from "@/lib/work";

export default function BlockNextCase({ currentSlug }: { currentSlug: string }) {
  const next = getNextCase(currentSlug);
  if (!next || next.slug === currentSlug) return null;
  return (
    <a href={`/work/${next.slug}`} className="block relative mt-24 min-h-screen overflow-hidden group">
      <img src={next.thumbnail} alt={next.client} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-void/40 flex flex-col items-center justify-center text-foreground">
        <p className="text-sm uppercase tracking-wide">Next case study</p>
        <h2 className="mt-3 text-4xl sm:text-6xl font-semibold">{next.client}</h2>
        <span className="mt-8 inline-block rounded-full bg-background text-navy px-6 py-3 text-sm">See next case study →</span>
      </div>
    </a>
  );
}
