const team = [
  {
    name: "Jamil Gonzales",
    role: "CEO & Growth Strategist",
    bio: "10+ years building growth systems across SEO, UX, and brand identity. Turns attention into revenue.",
    gradient: "from-teal to-cyan",
  },
];

export default function Team() {
  return (
    <section id="team" className="bg-background py-24 lg:py-36 rounded-[12px]">
      <div className="max-w-[1280px] mx-auto px-6">
        <p className="text-teal font-semibold text-[15px] mb-4">Team</p>
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-navy leading-[1.1] tracking-tight max-w-md mb-16">
          Two builders, zero bloat
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {team.map((m) => (
            <div key={m.name} className="group">
              <div className={`h-2 bg-gradient-to-r ${m.gradient}`} />
              <div className="bg-gray-50 p-8 rounded-[12px]">
                <div className={`w-14 h-14 bg-gradient-to-br ${m.gradient} flex items-center justify-center mb-5`}>
                  <span className="text-foreground font-bold text-lg">
                    {m.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-navy">{m.name}</h3>
                <p className="text-teal text-[14px] font-medium mt-1">{m.role}</p>
                <p className="text-gray-500 text-[15px] mt-4 leading-relaxed">{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
