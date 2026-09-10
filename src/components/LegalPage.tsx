import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Section = { title: string; paragraphs: string[] };

export default function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: Section[] }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-32 sm:pt-40 pb-24">
        <article className="max-w-3xl mx-auto px-6">
          <p className="text-[11px] tracking-[0.24em] uppercase text-amber font-semibold">Legal</p>
          <h1 className="mt-4 text-[clamp(2.5rem,5.2vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-navy">{title}</h1>
          <p className="mt-5 text-sm text-gray-400">Last updated {updated}</p>
          <div className="mt-12 space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-semibold text-navy tracking-[-0.02em]">{section.title}</h2>
                <div className="mt-4 space-y-4 text-gray-500 leading-relaxed">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
