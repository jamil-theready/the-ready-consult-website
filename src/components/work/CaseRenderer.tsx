import type { Block } from "@/lib/work-types";
import BlockHero from "./BlockHero";
import BlockText from "./BlockText";
import BlockImage from "./BlockImage";
import BlockDevices from "./BlockDevices";
import BlockGallery from "./BlockGallery";
import BlockMetricRow from "./BlockMetricRow";
import BlockTimeline from "./BlockTimeline";
import BlockAdGallery from "./BlockAdGallery";
import BlockVideo from "./BlockVideo";
import BlockQuote from "./BlockQuote";
import BlockNextCase from "./BlockNextCase";

export default function CaseRenderer({ blocks, currentSlug }: { blocks: Block[]; currentSlug: string }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "hero": return <BlockHero key={i} client={b.client} headline={b.headline} meta={b.meta} media={b.media} />;
          case "text": return <BlockText key={i} subheading={b.subheading} body={b.body} />;
          case "image": return <BlockImage key={i} media={b.media} caption={b.caption} fullBleed={b.fullBleed} mockup={b.mockup} />;
          case "devices": return <BlockDevices key={i} desktop={b.desktop} mobile={b.mobile} tone={b.tone} />;
          case "gallery": return <BlockGallery key={i} items={b.items} layout={b.layout} />;
          case "metricRow": return <BlockMetricRow key={i} stats={b.stats} />;
          case "timeline": return <BlockTimeline key={i} milestones={b.milestones} />;
          case "adGallery": return <BlockAdGallery key={i} ads={b.ads} note={b.note} />;
          case "video": return <BlockVideo key={i} src={b.src} poster={b.poster} caption={b.caption} />;
          case "quote": return <BlockQuote key={i} text={b.text} author={b.author} role={b.role} />;
          case "nextCase": return <BlockNextCase key={i} currentSlug={currentSlug} />;
        }
      })}
    </>
  );
}
