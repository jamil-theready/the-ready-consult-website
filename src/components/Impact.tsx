const metrics = [
  { value: "$50M+", label: "Attributed revenue" },
  { value: "30%", label: "Avg LTV improvement" },
  { value: "15%", label: "QoQ organic growth" },
  { value: "72hr", label: "Feedback to launch" },
];

export default function Impact() {
  return (
    <section className="relative bg-gradient-to-r from-teal via-teal-light to-teal py-16 lg:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.15),transparent_70%)]" />
      <div className="relative max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {metrics.map((m) => (
            <div key={m.label} className="text-center lg:text-left">
              <p className="text-[2.5rem] lg:text-[3rem] font-bold text-white tracking-tight leading-none">{m.value}</p>
              <p className="text-white/50 text-[13px] mt-2 uppercase tracking-wider">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
