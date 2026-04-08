export default function Footer() {
  return (
    <footer className="bg-navy">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <svg width="20" height="20" viewBox="0 0 66 66" fill="none">
                <rect x="2" y="2" width="17" height="17" rx="5" fill="white"/>
                <rect x="24" y="2" width="17" height="17" rx="5" fill="white"/>
                <rect x="46" y="2" width="17" height="17" rx="5" fill="white"/>
                <rect x="2" y="24" width="17" height="17" rx="5" fill="white"/>
                <rect x="24" y="24" width="17" height="17" rx="5" fill="white"/>
                <rect x="2" y="46" width="17" height="17" rx="5" fill="white"/>
                <rect x="46" y="46" width="17" height="17" rx="5" fill="white"/>
              </svg>
              <p className="text-white font-semibold tracking-tight">The Ready Consult</p>
            </div>
            <p className="text-white/30 text-[14px] mt-1">AI-first growth and media partner</p>
          </div>
          <div className="flex flex-wrap items-center gap-6 lg:gap-8">
            {[
              { l: "Services", h: "#services" },
              { l: "Pricing", h: "#pricing" },
              { l: "Process", h: "#how-it-works" },
              { l: "Team", h: "#team" },
              { l: "FAQ", h: "#faq" },
              { l: "Contact", h: "#contact" },
            ].map((i) => (
              <a key={i.l} href={i.h} className="text-[14px] text-white/40 hover:text-white transition-colors">{i.l}</a>
            ))}
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-white/25">&copy; {new Date().getFullYear()} The Ready Consult</p>
          <a href="mailto:team@thereadyconsult.com" className="text-[13px] text-white/25 hover:text-white/50 transition-colors">
            team@thereadyconsult.com
          </a>
        </div>
      </div>
    </footer>
  );
}
