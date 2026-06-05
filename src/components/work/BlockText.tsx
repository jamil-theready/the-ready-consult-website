export default function BlockText({ subheading, body }: { subheading?: string; body: string }) {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {subheading && <h2 className="text-sm uppercase tracking-wide text-teal mb-3">{subheading}</h2>}
      <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">{body}</p>
    </section>
  );
}
