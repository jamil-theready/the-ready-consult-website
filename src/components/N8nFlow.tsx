"use client";

import { useEffect, useState } from "react";

// Labelled the way a contractor would describe their own follow up, not the way
// the tools are named. Clearbit, OpenAI and HubSpot mean nothing on a job site.
const nodes = [
  { id: "trigger", x: 40, y: 180, label: "New lead", sub: "Call or form", color: "#9b59b6", icon: "webhook" },
  { id: "enrich", x: 220, y: 100, label: "Logged", sub: "Your dashboard", color: "#e67e22", icon: "data" },
  { id: "ai", x: 220, y: 260, label: "Text back", sub: "Within a minute", color: "#10a37f", icon: "ai" },
  { id: "router", x: 420, y: 180, label: "Did they reply?", sub: "Check", color: "#3498db", icon: "split" },
  { id: "hot", x: 600, y: 100, label: "Book estimate", sub: "Straight to your calendar", color: "#e74c3c", icon: "slack" },
  { id: "warm", x: 600, y: 260, label: "Follow up", sub: "Day two and day five", color: "#2ecc71", icon: "email" },
  { id: "crm", x: 780, y: 180, label: "Job won", sub: "Marked in your dashboard", color: "#ff7a59", icon: "crm" },
];

const connections = [
  { from: "trigger", to: "enrich" },
  { from: "trigger", to: "ai" },
  { from: "enrich", to: "router" },
  { from: "ai", to: "router" },
  { from: "router", to: "hot" },
  { from: "router", to: "warm" },
  { from: "hot", to: "crm" },
  { from: "warm", to: "crm" },
];

function getNode(id: string) {
  return nodes.find((n) => n.id === id)!;
}

function NodeIcon({ type }: { type: string }) {
  switch (type) {
    case "webhook":
      return (
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      );
    case "data":
      return <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />;
    case "ai":
      return <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />;
    case "split":
      return <path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4h-6zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3L10 4z" />;
    case "slack":
      return <path d="M5.04 15.16a2.53 2.53 0 01-2.52 2.52 2.53 2.53 0 01-2.52-2.52 2.53 2.53 0 012.52-2.52h2.52v2.52zm1.27 0a2.53 2.53 0 012.52-2.52 2.53 2.53 0 012.52 2.52v6.31a2.53 2.53 0 01-2.52 2.52 2.53 2.53 0 01-2.52-2.52v-6.31z" />;
    case "email":
      return <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />;
    case "crm":
      return <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />;
    default:
      return <circle cx="12" cy="12" r="4" />;
  }
}

export default function N8nFlow() {
  const [activeConnection, setActiveConnection] = useState(0);
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set(["trigger"]));

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConnection((prev) => {
        const next = (prev + 1) % connections.length;
        setActiveNodes((nodes) => {
          const updated = new Set(nodes);
          updated.add(connections[next].from);
          updated.add(connections[next].to);
          if (next === 0) {
            return new Set(["trigger"]);
          }
          return updated;
        });
        return next;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-[#16110A] overflow-hidden flex flex-col" style={{ boxShadow: "0 25px 60px -12px rgba(0,0,0,0.12), 0 8px 20px -8px rgba(0,0,0,0.08)" }}>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-200 bg-slab">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-[#ff6d5a]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-xs font-semibold text-gray-600">Lead follow up</span>
          <div className="flex items-center gap-1 ml-2 bg-green/10 px-2 py-0.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            <span className="text-[10px] font-medium text-green">Active</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 bg-gray-100 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: "radial-gradient(circle, #d0d0d0 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 860 380">
          {/* Connection lines */}
          {connections.map((conn, i) => {
            const from = getNode(conn.from);
            const to = getNode(conn.to);
            const fromX = from.x + 70;
            const fromY = from.y + 25;
            const toX = to.x;
            const toY = to.y + 25;
            const midX = (fromX + toX) / 2;
            const isActive = i <= activeConnection;
            const isCurrent = i === activeConnection;

            return (
              <g key={`${conn.from}-${conn.to}`}>
                <path
                  d={`M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`}
                  stroke={isActive ? "var(--amber)" : "#d4d4d4"}
                  strokeWidth={isActive ? 2 : 1.5}
                  fill="none"
                  style={{ transition: "stroke 0.4s ease, stroke-width 0.4s ease" }}
                />
                {/* Animated dot */}
                {isCurrent && (
                  <circle r="4" fill="var(--amber)">
                    <animateMotion
                      dur="0.8s"
                      repeatCount="indefinite"
                      path={`M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`}
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isActive = activeNodes.has(node.id);
            return (
              <g key={node.id}>
                {/* Shadow */}
                <rect
                  x={node.x + 2}
                  y={node.y + 2}
                  width={70}
                  height={50}
                  rx={10}
                  fill="rgba(0,0,0,0.06)"
                />
                {/* Node body */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={70}
                  height={50}
                  rx={10}
                  fill="#16110A"
                  stroke={isActive ? node.color : "#e0e0e0"}
                  strokeWidth={isActive ? 2 : 1}
                  style={{ transition: "stroke 0.3s ease" }}
                />
                {/* Icon circle */}
                <circle
                  cx={node.x + 20}
                  cy={node.y + 18}
                  r={10}
                  fill={isActive ? node.color : "#f0f0f0"}
                  style={{ transition: "fill 0.3s ease" }}
                />
                <g
                  transform={`translate(${node.x + 12}, ${node.y + 10}) scale(0.65)`}
                  fill={isActive ? "#16110A" : "#999"}
                  style={{ transition: "fill 0.3s ease" }}
                >
                  <NodeIcon type={node.icon} />
                </g>
                {/* Label */}
                <text
                  x={node.x + 35}
                  y={node.y + 40}
                  textAnchor="middle"
                  className="text-[8px] font-semibold"
                  fill={isActive ? "var(--foreground)" : "#aaa"}
                  style={{ transition: "fill 0.3s ease" }}
                >
                  {node.label}
                </text>
                {/* Connector dots */}
                <circle cx={node.x} cy={node.y + 25} r={3} fill={isActive ? node.color : "#ddd"} style={{ transition: "fill 0.3s ease" }} />
                <circle cx={node.x + 70} cy={node.y + 25} r={3} fill={isActive ? node.color : "#ddd"} style={{ transition: "fill 0.3s ease" }} />
              </g>
            );
          })}
        </svg>

        {/* Execution counter */}
        <div className="absolute bottom-3 left-4 flex items-center gap-4 text-[10px] text-gray-400">
          <span>Leads handled: <strong className="text-navy">every one</strong></span>
          <span>Reply time: <strong className="text-green">under a minute</strong></span>
          <span>Your effort: <strong className="text-navy">none</strong></span>
        </div>

        {/* Mini map hint */}
        <div className="absolute bottom-3 right-4 w-16 h-10 border border-gray-200 bg-slab/80 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-5 border border-teal/30 " />
          </div>
        </div>
      </div>
    </div>
  );
}
