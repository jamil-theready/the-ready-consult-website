const NODES = [
  { id: "video", label: "AI video", x: 160, y: 26 },
  { id: "meta", label: "Meta Ads", x: 282, y: 82 },
  { id: "gads", label: "Google Ads", x: 282, y: 166 },
  { id: "leads", label: "Leads", x: 160, y: 214 },
  { id: "data", label: "Data", x: 38, y: 166 },
  { id: "auto", label: "Follow up", x: 38, y: 82 },
];

// The six pieces of the Acquisition System, drawn as one connected loop rather
// than listed. Connectors are drawn against the act progress the engine
// publishes as --sc-p, so the system assembles as the card is scrolled.
export default function SystemDiagram() {
  return (
    <div className="system" data-sc-magnet="0.18">
      <svg
        viewBox="0 0 320 240"
        role="img"
        aria-label="AI video, Meta Ads, Google Ads, lead generation, data structure and follow up automation connected into one system"
      >
        <g className="system__wires">
          {NODES.map((n) => (
            <line key={n.id} x1="160" y1="120" x2={n.x} y2={n.y} pathLength={1} />
          ))}
        </g>
        <circle className="system__hub" cx="160" cy="120" r="26" />
        <text className="system__hubt" x="160" y="124" textAnchor="middle">
          You
        </text>
        {NODES.map((n) => (
          <g key={n.id} className="system__node">
            <circle cx={n.x} cy={n.y} r="5" />
            <text x={n.x} y={n.y - 12} textAnchor="middle">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
