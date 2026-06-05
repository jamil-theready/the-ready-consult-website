export default function BlockText({ subheading, body }: { subheading?: string; body: string }) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
      {subheading && (
        <h2 className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue mb-6">
          <span className="inline-block h-px w-8 bg-blue" />
          {subheading}
        </h2>
      )}
      <p className="text-2xl sm:text-3xl font-light text-navy/90 leading-[1.5] tracking-tight">{body}</p>
    </section>
  );
}
