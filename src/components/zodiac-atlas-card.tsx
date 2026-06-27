import Link from "next/link";
import type { ZodiacSign } from "@/lib/zodiac";

export function ZodiacAtlasCard({ sign }: { sign: ZodiacSign }) {
  return (
    <Link
      href={`/zodiac/${sign.slug}`}
      aria-label={`查看${sign.name}百科`}
      className="group overflow-hidden rounded-md border border-white/12 bg-[#090d1d] shadow-sm transition hover:-translate-y-0.5 hover:border-[#f0c96a]/45 hover:shadow-[0_24px_70px_rgba(0,0,0,.28)]"
    >
      <ZodiacConstellation sign={sign} />
      <div className="p-4">
        <p className="line-clamp-3 text-sm leading-7 text-white/72">{sign.summary}</p>
      </div>
    </Link>
  );
}

export function ZodiacConstellation({ sign, className = "" }: { sign: ZodiacSign; className?: string }) {
  return (
    <div className={`relative aspect-[4/3] overflow-hidden bg-black ${className}`}>
      <Starfield />
      <div className="absolute left-4 top-4 z-10 grid size-11 place-items-center rounded-md border border-white/22 bg-white/8 text-3xl leading-none text-white shadow-[0_16px_44px_rgba(255,255,255,.08)] backdrop-blur">
        <span aria-hidden>{sign.glyph}</span>
      </div>
      <ConstellationImage slug={sign.slug} />
      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-xs font-semibold text-white/70">{sign.dateRange}</p>
        <h3 className="mt-1 text-xl font-semibold text-white">
          {sign.englishName}（{sign.shortName}）
        </h3>
      </div>
    </div>
  );
}

function Starfield() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-90" viewBox="0 0 320 240" aria-hidden focusable="false">
      <rect width="320" height="240" fill="black" />
      {backgroundStars.map(([cx, cy, r, opacity]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="white" opacity={opacity} />
      ))}
    </svg>
  );
}

function ConstellationImage({ slug }: { slug: string }) {
  const map = constellationMaps[slug] ?? defaultConstellationMap;

  return (
    <svg
      className="absolute inset-0 h-full w-full transition duration-300 group-hover:scale-[1.03]"
      viewBox="0 0 320 240"
      aria-hidden
      focusable="false"
    >
      <g transform={map.transform}>
        <path d={map.primaryPath} fill="none" stroke="rgba(255,255,255,.74)" strokeWidth="1.2" />
        <path d={map.secondaryPath} fill="none" stroke="rgba(255,255,255,.48)" strokeWidth="1" />
      </g>
      {map.stars.map(([cx, cy, r]) => (
        <StarNode key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} transform={map.transform} />
      ))}
    </svg>
  );
}

function StarNode({ cx, cy, r, transform }: { cx: number; cy: number; r: number; transform: string }) {
  const size = r * 2.8;

  return (
    <g transform={transform}>
      <path
        d="M0 -5.5L1.45 -1.45L5.5 0L1.45 1.45L0 5.5L-1.45 1.45L-5.5 0L-1.45 -1.45Z"
        transform={`translate(${cx} ${cy}) scale(${size / 5.5})`}
        fill="white"
        opacity="0.96"
      />
      <circle cx={cx} cy={cy} r={r * 1.45} fill="white" opacity="0.16" />
    </g>
  );
}

type ConstellationMap = {
  primaryPath: string;
  secondaryPath: string;
  stars: Array<[number, number, number]>;
  transform: string;
};

const defaultConstellationMap: ConstellationMap = {
  primaryPath: "M64 92L118 88L176 118L238 154",
  secondaryPath: "M118 88L92 64M176 118L210 94",
  stars: [
    [64, 92, 3.4],
    [92, 64, 2.4],
    [118, 88, 3.2],
    [176, 118, 4.4],
    [210, 94, 2.8],
    [238, 154, 3.2],
  ],
  transform: "translate(0 0)",
};

const constellationMaps: Record<string, ConstellationMap> = {
  aries: {
    primaryPath: "M54 86L92 76L136 86L196 116L238 158",
    secondaryPath: "M92 76L116 108M136 86L196 116",
    stars: [
      [54, 86, 2.6],
      [92, 76, 3.1],
      [136, 86, 3.5],
      [196, 116, 5.1],
      [238, 158, 3.6],
    ],
    transform: "translate(14 8) scale(.95)",
  },
  taurus: {
    primaryPath: "M76 184L104 148L128 110L150 70L178 44",
    secondaryPath: "M128 110L88 88L56 118M150 70L194 92L236 72M104 148L148 166L190 138",
    stars: [
      [76, 184, 2.5],
      [104, 148, 3.1],
      [128, 110, 4.4],
      [150, 70, 3.2],
      [178, 44, 2.9],
      [88, 88, 2.5],
      [56, 118, 2.3],
      [194, 92, 3.3],
      [236, 72, 2.7],
      [148, 166, 2.4],
      [190, 138, 2.8],
    ],
    transform: "translate(18 4) scale(.9)",
  },
  gemini: {
    primaryPath: "M98 74L128 54L168 58L202 84L218 124L194 158L154 150L126 116L92 102",
    secondaryPath: "M128 54L124 116M202 84L154 150M218 124L248 118M92 102L70 132",
    stars: [
      [98, 74, 2.8],
      [128, 54, 3.4],
      [168, 58, 3.3],
      [202, 84, 3.2],
      [218, 124, 3.6],
      [194, 158, 3],
      [154, 150, 2.7],
      [126, 116, 3],
      [92, 102, 2.6],
      [248, 118, 2.4],
      [70, 132, 2.4],
    ],
    transform: "translate(10 2) scale(.95)",
  },
  cancer: {
    primaryPath: "M136 52L148 112L138 160",
    secondaryPath: "M148 112L102 140L90 194M148 112L196 152L230 196M138 160L118 206",
    stars: [
      [136, 52, 3.9],
      [148, 112, 2.7],
      [138, 160, 4.3],
      [102, 140, 2.4],
      [90, 194, 2.8],
      [196, 152, 2.5],
      [230, 196, 2.7],
      [118, 206, 2.5],
    ],
    transform: "translate(22 2) scale(.9)",
  },
  leo: {
    primaryPath: "M78 194L102 128L132 96L172 112L212 96L246 138",
    secondaryPath: "M102 128C78 86 104 48 146 66M132 96L142 58M172 112L190 174",
    stars: [
      [78, 194, 4.1],
      [102, 128, 2.9],
      [132, 96, 3],
      [146, 66, 3.2],
      [142, 58, 2.3],
      [172, 112, 3.7],
      [212, 96, 2.8],
      [246, 138, 3.1],
      [190, 174, 2.5],
    ],
    transform: "translate(8 -4) scale(.95)",
  },
  virgo: {
    primaryPath: "M82 70L120 92L152 126L178 160L212 194",
    secondaryPath: "M152 126L192 92L238 92M178 160L216 142L250 166M120 92L94 124",
    stars: [
      [82, 70, 4.1],
      [120, 92, 2.9],
      [152, 126, 3.2],
      [178, 160, 3.4],
      [212, 194, 2.7],
      [192, 92, 2.6],
      [238, 92, 2.6],
      [216, 142, 2.7],
      [250, 166, 2.3],
      [94, 124, 2.4],
    ],
    transform: "translate(12 -2) scale(.93)",
  },
  libra: {
    primaryPath: "M72 166L108 110L162 86L218 112L244 156L188 184L126 184L72 166",
    secondaryPath: "M108 110L126 184M218 112L188 184M126 184L162 86L188 184",
    stars: [
      [72, 166, 3],
      [108, 110, 3.1],
      [162, 86, 4.2],
      [218, 112, 3.2],
      [244, 156, 2.8],
      [188, 184, 2.9],
      [126, 184, 2.8],
    ],
    transform: "translate(10 0) scale(.94)",
  },
  scorpio: {
    primaryPath: "M54 122L92 96L130 104L164 130L196 118L226 140L258 118",
    secondaryPath: "M130 104L118 154L144 190L190 178M226 140L250 176L284 150M92 96L70 70",
    stars: [
      [54, 122, 2.7],
      [70, 70, 2.3],
      [92, 96, 3],
      [130, 104, 3.5],
      [164, 130, 2.8],
      [196, 118, 3],
      [226, 140, 3.1],
      [258, 118, 2.6],
      [118, 154, 2.7],
      [144, 190, 4],
      [190, 178, 2.6],
      [250, 176, 2.6],
      [284, 150, 2.4],
    ],
    transform: "translate(8 -4) scale(.94)",
  },
  sagittarius: {
    primaryPath: "M82 184L132 132L204 56M154 66L204 56L196 112",
    secondaryPath: "M120 90L184 152M106 142L132 132M184 152L222 184L260 162M154 66L128 108L96 96",
    stars: [
      [82, 184, 3],
      [106, 142, 2.6],
      [132, 132, 3.2],
      [204, 56, 4.5],
      [154, 66, 2.6],
      [196, 112, 2.8],
      [120, 90, 2.4],
      [184, 152, 3.1],
      [222, 184, 2.7],
      [260, 162, 2.4],
      [128, 108, 2.5],
      [96, 96, 2.3],
    ],
    transform: "translate(8 -4) scale(.94)",
  },
  capricorn: {
    primaryPath: "M62 128L98 96L136 112L176 84L218 120L206 168L166 188L120 172L86 146L62 128",
    secondaryPath: "M218 120L246 88M206 168L236 188M136 112L120 172",
    stars: [
      [62, 128, 2.8],
      [98, 96, 3],
      [136, 112, 2.8],
      [176, 84, 4.2],
      [218, 120, 3.1],
      [246, 88, 2.5],
      [206, 168, 3.5],
      [166, 188, 2.9],
      [120, 172, 2.6],
      [86, 146, 2.6],
      [236, 188, 2.5],
    ],
    transform: "translate(14 -2) scale(.92)",
  },
  aquarius: {
    primaryPath: "M44 150L88 146L128 132L168 142L206 122L250 136",
    secondaryPath: "M70 104L110 94L150 108L188 92L232 106M88 146L110 94M168 142L188 92M206 122L232 106",
    stars: [
      [44, 150, 2.8],
      [88, 146, 3],
      [128, 132, 3.5],
      [168, 142, 2.8],
      [206, 122, 3.4],
      [250, 136, 2.8],
      [70, 104, 2.5],
      [110, 94, 2.7],
      [150, 108, 2.5],
      [188, 92, 2.8],
      [232, 106, 2.5],
    ],
    transform: "translate(18 8) scale(.9)",
  },
  pisces: {
    primaryPath: "M78 92C110 58 150 76 138 118C128 152 88 144 78 92",
    secondaryPath: "M186 126C218 88 266 104 270 148C258 190 202 180 186 126M138 118L186 126",
    stars: [
      [78, 92, 3],
      [104, 66, 2.5],
      [138, 118, 3.7],
      [112, 150, 2.6],
      [186, 126, 3.6],
      [226, 96, 2.6],
      [270, 148, 3.2],
      [236, 184, 2.6],
      [202, 178, 2.4],
    ],
    transform: "translate(6 0) scale(.95)",
  },
};

const backgroundStars: Array<[number, number, number, number]> = [
  [14, 16, 0.8, 0.62],
  [34, 42, 1.2, 0.42],
  [54, 22, 0.9, 0.68],
  [82, 50, 1.1, 0.45],
  [106, 18, 0.7, 0.74],
  [132, 34, 1.4, 0.36],
  [166, 20, 0.8, 0.62],
  [194, 48, 1.1, 0.5],
  [228, 24, 0.9, 0.7],
  [258, 46, 1.2, 0.42],
  [296, 22, 0.8, 0.68],
  [22, 86, 1, 0.48],
  [70, 98, 0.7, 0.72],
  [118, 76, 1.1, 0.44],
  [154, 96, 0.8, 0.66],
  [198, 82, 1.4, 0.36],
  [246, 96, 0.9, 0.62],
  [304, 82, 1.1, 0.48],
  [38, 146, 0.8, 0.7],
  [88, 166, 1.2, 0.42],
  [128, 140, 0.8, 0.68],
  [178, 164, 1.1, 0.5],
  [218, 138, 0.7, 0.74],
  [272, 160, 1.3, 0.38],
  [18, 212, 1.1, 0.48],
  [62, 202, 0.8, 0.7],
  [122, 216, 1.2, 0.42],
  [164, 206, 0.8, 0.64],
  [224, 218, 1.1, 0.5],
  [286, 204, 0.9, 0.66],
];
