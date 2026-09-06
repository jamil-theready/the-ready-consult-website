import type { Milestone } from "@/lib/work-types";

export default function BlockTimeline({ milestones }: { milestones: Milestone[] }) {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 my-16">
      <ol className="relative border-l border-gray-200 ml-3">
        {milestones.map((m, i) => (
          <li key={i} className="mb-10 ml-6">
            <span className="absolute -left-1.5 w-3 h-3 rounded-full bg-teal" />
            <time className="text-xs uppercase tracking-wide text-gray-400">{m.date}</time>
            <h3 className="text-lg font-semibold text-navy">{m.title}</h3>
            <p className="text-gray-700">{m.desc}</p>
            {m.media && <img src={m.media.src} alt={m.media.alt} className="mt-3 w-full " />}
          </li>
        ))}
      </ol>
    </section>
  );
}
