"use client";

/* A layered horizon of the thing our clients actually build: a back yard.
   Sky, ridge, rooflines, planting, hardscape, and a block wall you stand
   behind. Six layers, six parallax rates, so leaving the hero pulls the
   scene apart the way distance does.

   Rates are NOT viewport fractions. The engine writes
     translate3d(0, rate * (p - 0.5) * 100px, 0)
   so a rate is "hundreds of px of travel across the act". The hero's old
   0.30 and 0.08 moved 15px and 4px, which is why the hero read as static.
   Positive lags behind the scroll and reads far; negative outruns it and
   reads near. */

const RIDGE_FAR =
  "M0 286 C 150 246 268 262 392 236 C 528 208 648 246 786 230 C 922 214 1036 250 1172 234 C 1304 219 1434 244 1600 224 L1600 420 L0 420 Z";
const RIDGE_NEAR =
  "M0 318 C 128 296 236 306 372 286 C 512 266 636 292 764 280 C 906 267 1024 292 1168 278 C 1312 264 1452 286 1600 272 L1600 420 L0 420 Z";

// x, width, wall height, roof rise, chimney
const HOUSES: [number, number, number, number, boolean][] = [
  [-40, 210, 96, 62, true],
  [186, 152, 74, 48, false],
  [322, 244, 108, 74, true],
  [548, 176, 82, 52, false],
  [706, 268, 116, 80, true],
  [956, 188, 88, 56, false],
  [1122, 232, 100, 70, true],
  [1336, 200, 78, 50, false],
  [1520, 180, 92, 60, false],
];

// x, canopy radius, trunk height
const TREES: [number, number, number][] = [
  [70, 46, 34], [178, 32, 26], [268, 52, 40], [392, 36, 28],
  [500, 44, 34], [618, 30, 24], [742, 50, 38], [872, 34, 26],
  [980, 42, 32], [1104, 30, 24], [1218, 48, 36], [1344, 34, 26],
  [1452, 44, 34], [1560, 32, 26],
];

// Conifers and a palm, because the planting list is the client's product.
const CONIFERS = [126, 452, 812, 1170, 1512];
const PALMS = [340, 1044];

export default function HeroDiorama() {
  return (
    <div className="hd" aria-hidden="true">
      <div className="hd__l hd__sky" data-sc-parallax="5.0" />

      <div className="hd__l hd__ridge" data-sc-parallax="3.6">
        <svg viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax slice">
          <path d={RIDGE_FAR} fill="#483d2d" />
          <path d={RIDGE_NEAR} fill="#473c2c" />
        </svg>
      </div>

      <div className="hd__l hd__roofs" data-sc-parallax="2.6">
        <svg viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax slice">
          {HOUSES.map(([x, w, h, rise, chimney], i) => {
            const base = 420;
            const top = base - h;
            return (
              <g key={i} fill="#463a2c">
                {chimney && <rect x={x + w * 0.66} y={top - rise - 26} width={16} height={40} rx={2} />}
                <path d={`M${x - 10} ${top} L${x + w / 2} ${top - rise} L${x + w + 10} ${top} Z`} />
                <rect x={x} y={top} width={w} height={h} />
                <rect x={x + w * 0.2} y={top + h * 0.28} width={w * 0.16} height={h * 0.3} fill="#43382b" />
                <rect x={x + w * 0.62} y={top + h * 0.28} width={w * 0.16} height={h * 0.3} fill="#43382b" />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="hd__l hd__trees" data-sc-parallax="1.7">
        <svg viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax slice">
          {CONIFERS.map((x, i) => (
            <path key={`c${i}`} d={`M${x} ${420 - 168} L${x + 34} 420 L${x - 34} 420 Z`} fill="#3f362b" />
          ))}
          {PALMS.map((x, i) => (
            <g key={`p${i}`} fill="none" stroke="#3d352a" strokeWidth="7" strokeLinecap="round">
              <path d={`M${x} 420 C ${x - 6} 360 ${x + 4} 320 ${x} 288`} />
              {[-1, 1].map((s) =>
                [0, 1, 2].map((k) => (
                  <path
                    key={`${s}-${k}`}
                    d={`M${x} 288 C ${x + s * (26 + k * 12)} ${282 - k * 14} ${x + s * (46 + k * 16)} ${292 - k * 18} ${x + s * (56 + k * 20)} ${316 - k * 16}`}
                  />
                ))
              )}
            </g>
          ))}
          {TREES.map(([x, r, t], i) => (
            <g key={`t${i}`} fill="#40372c">
              <rect x={x - 4} y={420 - t} width={8} height={t} fill="#3d352b" />
              <circle cx={x} cy={420 - t - r * 0.72} r={r} />
              <circle cx={x - r * 0.62} cy={420 - t - r * 0.34} r={r * 0.66} />
              <circle cx={x + r * 0.6} cy={420 - t - r * 0.4} r={r * 0.6} />
            </g>
          ))}
        </svg>
      </div>

      <div className="hd__l hd__hard" data-sc-parallax="0.8">
        <svg viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax slice">
          {/* paver patio, laid in perspective */}
          <path d="M120 420 L1480 420 L1330 268 L270 268 Z" fill="#473c2d" />
          {Array.from({ length: 9 }, (_, i) => {
            const t = (i + 1) / 10;
            const y = 268 + t * 152;
            const xl = 270 - t * 150;
            const xr = 1330 + t * 150;
            return <line key={`h${i}`} x1={xl} y1={y} x2={xr} y2={y} stroke="#44392c" strokeWidth="2" />;
          })}
          {Array.from({ length: 13 }, (_, i) => {
            const t = (i + 1) / 14;
            const xTop = 270 + t * 1060;
            const xBot = 120 + t * 1360;
            return <line key={`v${i}`} x1={xTop} y1={268} x2={xBot} y2={420} stroke="#44392c" strokeWidth="2" />;
          })}
          {/* gunite pool with coping */}
          <ellipse cx="1090" cy="336" rx="270" ry="60" fill="#483d2d" />
          <ellipse cx="1090" cy="336" rx="248" ry="46" fill="#3f3529" />
          <ellipse cx="1090" cy="330" rx="200" ry="28" fill="#41372a" opacity="0.7" />
          {/* fire pit. Sits high on the patio: down at the coping line the hedge
              covers the basin and the flame reads as a blob in mid air. */}
          <ellipse cx="430" cy="312" rx="76" ry="23" fill="#453b2d" />
          <ellipse cx="430" cy="305" rx="54" ry="15" fill="#42392c" />
          <path d="M430 305 C 419 288 439 284 430 269 C 450 283 446 298 430 305 Z" fill="#403628" opacity="0.85" />
        </svg>
      </div>

      <div className="hd__l hd__fore" data-sc-parallax="-1.2">
        <svg viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax slice">
          {/* shrub crest, drawn first so the wall caps it */}
          {Array.from({ length: 26 }, (_, i) => {
            const x = i * 64 + (i % 3) * 9;
            const r = 26 + (i % 4) * 9;
            return <circle key={`s${i}`} cx={x} cy={286} r={r} fill="#322c23" />;
          })}
          {/* stacked block retaining wall */}
          <rect x="0" y="286" width="1600" height="18" rx="4" fill="#362f26" />
          <rect x="0" y="304" width="1600" height="116" fill="#342d25" />
          {[0, 1, 2].map((row) =>
            Array.from({ length: 17 }, (_, i) => (
              <rect
                key={`b${row}-${i}`}
                x={i * 96 + (row % 2 ? -48 : 0)}
                y={310 + row * 38}
                width={92}
                height={34}
                rx={3}
                fill="none"
                stroke="#322b24"
                strokeWidth="2"
              />
            ))
          )}
        </svg>
      </div>
    </div>
  );
}
