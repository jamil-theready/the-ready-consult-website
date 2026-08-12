import type { Media } from "@/lib/work-types";

function Gloss() {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      style={{
        background:
          "linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 22%, rgba(255,255,255,0) 42%)",
      }}
    />
  );
}

function MacBook({ media }: { media: Media }) {
  return (
    <div className="w-full">
      {/* Lid / screen */}
      <div className="relative bg-[#0c0c0e] rounded-t-[14px] p-[0.7%] ring-1 ring-black/40 shadow-[0_40px_70px_-24px_rgba(0,0,0,0.5)]">
        <img src={media.src} alt={media.alt} className="block w-full rounded-[5px]" />
        <Gloss />
      </div>
      {/* Base / deck (wider than the lid) */}
      <div className="relative mx-[-3.4%]">
        <div className="h-[15px] sm:h-[20px] bg-gradient-to-b from-[#dee1e5] via-[#c2c6cb] to-[#979ba1] rounded-b-[13px] rounded-t-[2px] shadow-[0_10px_18px_-8px_rgba(0,0,0,0.5)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[15%] h-[44%] bg-gradient-to-b from-[#a6abb1] to-[#b9bdc2] rounded-b-[9px]" />
      </div>
    </div>
  );
}

function IPhone({ media }: { media: Media }) {
  return (
    <div className="relative bg-[#0b0b0d] rounded-[2rem] p-[5px] ring-1 ring-black/40 shadow-[0_30px_55px_-14px_rgba(0,0,0,0.6)]">
      <img src={media.src} alt={media.alt} className="block w-full rounded-[1.7rem]" />
      <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[30%] h-[13px] bg-black rounded-full" />
      <Gloss />
    </div>
  );
}

export default function BlockDevices({
  desktop, mobile, tone = "light",
}: { desktop: Media; mobile?: Media; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <section
      className={
        "my-16 sm:my-24 py-20 sm:py-28 px-6 overflow-hidden " +
        (dark ? "bg-gradient-to-b from-navy to-[#06182e]" : "bg-gradient-to-b from-gray-50 to-gray-100")
      }
    >
      <div className="max-w-[1080px] mx-auto" style={{ perspective: "2200px" }}>
        <div
          className="relative"
          style={{ transform: "rotateY(-11deg) rotateX(4deg)", transformStyle: "preserve-3d" }}
        >
          {/* grounded floor shadow */}
          <div className="absolute left-[8%] right-[10%] bottom-[-4%] h-12 bg-black/30 blur-[40px] rounded-[50%]" />

          {/* MacBook */}
          <div className="relative z-10 w-[82%]">
            <MacBook media={desktop} />
          </div>

          {/* iPhone overlapping front-right */}
          {mobile && (
            <div className="absolute z-20 right-[1%] bottom-[-8%] w-[20%]">
              <IPhone media={mobile} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
