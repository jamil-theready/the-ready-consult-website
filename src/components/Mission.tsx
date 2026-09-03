// Pinned act. The engine drives the word reveal through its cue system, so the
// hand-rolled scroll listener this component used to carry is gone: one scroll
// listener on the page, owned by the engine.
//
// PROOF LINE: the agency runs this system for a number of paying clients, and
// that count belongs here. It is deliberately absent until it can be read from
// live Stripe. This session could only reach the sandbox account, and an
// unverified figure on a public page is exactly the failure the standing rules
// warn about. Add it back the moment Stripe livemode is reachable.
export default function Mission() {
  return (
    <section
      className="sc-section relative"
      data-sc-act="pin"
      data-sc-span="2.4"
      data-sc-drift="#f6f9fc"
    >
      <div data-sc-stage className="flex items-center">
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 w-full">
          <p className="sc-label text-[12px] tracking-[0.28em] mb-8">
            What we do
          </p>

          <p
            className="text-[clamp(2rem,5.5vw,4.5rem)] font-medium leading-[1.15] tracking-tight max-w-[980px] text-navy"
            data-sc-cue="0 0.92 0"
            data-sc-kinetic="words"
          >
            We build your website, get you found on Google, and make sure every
            call and form gets followed up.
          </p>

          <p
            className="mt-10 text-[17px] text-gray-500 max-w-[560px] leading-relaxed"
            data-sc-cue="0.45"
          >
            One system, running every month, so the work keeps coming in
            without you chasing it.
          </p>
        </div>
      </div>
    </section>
  );
}
