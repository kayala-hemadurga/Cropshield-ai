import type { ReactNode } from "react";
import { Info } from "lucide-react";
import type { ThreatLevel } from "@/lib/demo-data";

type BadgeTone =
  | "forest"
  | "citron"
  | "clay"
  | "sun"
  | "neutral"
  | "outline";

const badgeTones: Record<BadgeTone, string> = {
  forest: "border-forest-200 bg-forest-100 text-forest-800",
  citron: "border-citron-300 bg-citron-100 text-forest-900",
  clay: "border-clay-500/20 bg-clay-100 text-clay-600",
  sun: "border-sun-500/20 bg-sun-100 text-sun-600",
  neutral: "border-line bg-paper-deep text-ink-muted",
  outline: "border-forest-300 bg-transparent text-forest-800",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${badgeTones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

const threatTone: Record<ThreatLevel, { tone: BadgeTone; label: string }> = {
  high: { tone: "clay", label: "High" },
  moderate: { tone: "sun", label: "Moderate" },
  watch: { tone: "forest", label: "Watch" },
};

export function ThreatBadge({ level }: { level: ThreatLevel }) {
  const config = threatTone[level];
  return (
    <Badge tone={config.tone}>
      <span
        className={`size-1.5 rounded-full ${
          level === "high"
            ? "bg-clay-500"
            : level === "moderate"
              ? "bg-sun-500"
              : "bg-forest-500"
        }`}
        aria-hidden="true"
      />
      {config.label}
    </Badge>
  );
}

export function Eyebrow({
  children,
  dark = false,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] ${
        dark ? "text-citron-300" : "text-forest-600"
      }`}
    >
      <span
        className={`h-px w-6 ${dark ? "bg-citron-400/70" : "bg-forest-400"}`}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}

export function DemoNote({
  children,
  title = "Illustrative data",
  className = "",
}: {
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-sun-500/20 bg-sun-100/60 px-4 py-3.5 text-sm leading-6 text-sun-600 ${className}`}
    >
      <Info size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p>
        <strong className="font-bold">{title}.</strong> {children}
      </p>
    </div>
  );
}

export function Sparkline({
  data,
  label,
  className = "",
  tone = "forest",
}: {
  data: number[];
  label: string;
  className?: string;
  tone?: "forest" | "citron";
}) {
  const width = 320;
  const height = 96;
  const padding = 8;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / span) * (height - padding * 2);
    return [x, y] as const;
  });

  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${padding},${height - padding} ${line} ${width - padding},${height - padding}`;
  const stroke = tone === "citron" ? "#cfee86" : "#2f6842";
  const fill = tone === "citron" ? "#cfee86" : "#2f6842";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className={className}
      preserveAspectRatio="none"
    >
      {[0.25, 0.5, 0.75].map((ratio) => (
        <line
          key={ratio}
          x1={padding}
          x2={width - padding}
          y1={height * ratio}
          y2={height * ratio}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.1"
        />
      ))}
      <polygon points={area} fill={fill} opacity="0.1" />
      <polyline
        points={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {points.map(([x, y], index) => (
        <circle
          key={index}
          cx={x}
          cy={y}
          r={index === points.length - 1 ? 4 : 2}
          fill={stroke}
          stroke={tone === "citron" ? "#0d2017" : "#f7f8f2"}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

export function ScoreRing({
  score,
  band,
  size = 184,
  dark = false,
}: {
  score: number;
  band: string;
  size?: number;
  dark?: boolean;
}) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Illustrative risk score ${score} out of 100, ${band} band`}
    >
      <svg viewBox="0 0 180 180" className="size-full -rotate-90">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={dark ? "#285336" : "#ddeede"}
          strokeWidth="11"
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={dark ? "#cfee86" : "#2f6842"}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-display text-5xl font-semibold leading-none tracking-[-0.04em] ${
            dark ? "text-white" : "text-forest-950"
          }`}
        >
          {score}
        </span>
        <span
          className={`mt-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
            dark ? "text-forest-300" : "text-ink-muted"
          }`}
        >
          / 100
        </span>
        <span
          className={`mt-2 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
            dark
              ? "bg-clay-500/20 text-clay-100"
              : "bg-clay-100 text-clay-600"
          }`}
        >
          {band}
        </span>
      </div>
    </div>
  );
}

export function SampleTag({ label = "Sample data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">
      <span className="size-1.5 rounded-full bg-sun-500" aria-hidden="true" />
      {label}
    </span>
  );
}
