import type { Metadata } from "next";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  CloudSun,
  Droplets,
  FileText,
  Leaf,
  MapPin,
  Sprout,
  ThermometerSun,
  TriangleAlert,
  Wind,
} from "lucide-react";
import Link from "next/link";
import { DemoNote, Eyebrow, SampleTag, Sparkline } from "@/components/ui";
import {
  cropFields,
  farmProfile,
  healthTrend,
  healthTrendLabels,
  recentReports,
  threatSignals,
  weatherSnapshot,
} from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Farmer dashboard",
  description:
    "Sample farm overview with crop health, threat indicators and recent field reports. No live weather or predictions connected.",
};

const levelStyles: Record<string, string> = {
  high: "border-clay-500/20 bg-clay-100 text-clay-600",
  moderate: "border-sun-500/20 bg-sun-100 text-sun-600",
  watch: "border-forest-200 bg-forest-100 text-forest-700",
};

export default function DashboardPage() {
  const maxTrend = Math.max(...healthTrend);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Eyebrow>Farmer workspace</Eyebrow>
            <SampleTag label="Sample data" />
          </div>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold leading-[1.01] tracking-[-0.038em] text-forest-950">
            Welcome back, {farmProfile.farmer}.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-ink-muted">
            {farmProfile.name} · {farmProfile.location} · {farmProfile.fields}{" "}
            fields · {farmProfile.area} monitored. Everything below is
            illustrative sample data for this demo.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/scanner"
            className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-forest-800"
          >
            Start a crop scan
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href="/field-reports"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-bold text-forest-900 transition-colors hover:bg-forest-50"
          >
            Submit field report
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <DemoNote title="Demo workspace">
          No live weather, AI diagnosis or outbreak feed is connected. Use this
          view to explore the intended layout and data structure.
        </DemoNote>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Farm health",
            value: `${farmProfile.health}/100`,
            change: `+${farmProfile.trend} this week`,
            icon: Activity,
            tone: "forest",
          },
          {
            label: "Fields monitored",
            value: String(farmProfile.fields),
            change: farmProfile.area,
            icon: Sprout,
            tone: "forest",
          },
          {
            label: "Open reports",
            value: String(farmProfile.openReports),
            change: "Sample status",
            icon: FileText,
            tone: "sun",
          },
          {
            label: "Threat signals",
            value: String(farmProfile.threatSignals),
            change: "Illustrative alerts",
            icon: TriangleAlert,
            tone: "clay",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.label}
              className="relative overflow-hidden rounded-3xl border border-line bg-white p-5 shadow-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.03em] text-forest-950">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-ink-muted">
                    {stat.change}
                  </p>
                </div>
                <span
                  className={`grid size-10 place-items-center rounded-2xl ${
                    stat.tone === "clay"
                      ? "bg-clay-100 text-clay-600"
                      : stat.tone === "sun"
                        ? "bg-sun-100 text-sun-600"
                        : "bg-forest-100 text-forest-700"
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Main column */}
        <div className="space-y-6">
          {/* Crop health */}
          <section className="rounded-3xl border border-line bg-white shadow-card">
            <header className="flex flex-col gap-3 border-b border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                  Crop health by field
                </p>
                <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em] text-forest-950">
                  Field summary
                </h2>
              </div>
              <SampleTag />
            </header>
            <div className="divide-y divide-line">
              {cropFields.map((field) => (
                <div
                  key={field.id}
                  className="grid gap-4 px-6 py-4 sm:grid-cols-[1.2fr_0.8fr_0.6fr_0.6fr]"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-forest-100 text-forest-700">
                      <Leaf size={16} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-bold text-forest-950">
                        {field.name}
                      </p>
                      <p className="text-[12px] text-ink-muted">
                        {field.crop} · {field.variety} · {field.area}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted">
                      Stage
                    </p>
                    <p className="mt-1 text-sm font-semibold text-forest-900">
                      {field.stage}
                    </p>
                    <p className="text-[11px] text-ink-muted">
                      Scouted {field.lastScouted}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted">
                      Health
                    </p>
                    <div className="mt-1 flex items-end gap-2">
                      <p className="font-display text-2xl font-semibold leading-none text-forest-950">
                        {field.health}
                      </p>
                      <span
                        className={`mb-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          field.trend >= 0
                            ? "bg-forest-100 text-forest-700"
                            : "bg-clay-100 text-clay-600"
                        }`}
                      >
                        {field.trend >= 0 ? "+" : ""}
                        {field.trend}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${
                        field.status === "Healthy"
                          ? "bg-forest-100 text-forest-700"
                          : field.status === "Monitor"
                            ? "bg-sun-100 text-sun-600"
                            : "bg-clay-100 text-clay-600"
                      }`}
                    >
                      {field.status}
                    </span>
                    <MapPin
                      size={16}
                      className="text-forest-400"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trend + reports */}
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-line bg-white shadow-card">
              <header className="flex items-center justify-between border-b border-line px-6 py-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                    Health trend
                  </p>
                  <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em] text-forest-950">
                    Illustrative trend
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-forest-600">
                  Peak {maxTrend}/100
                </span>
              </header>
              <div className="px-6 pb-5 pt-4">
                <Sparkline
                  data={healthTrend}
                  label="Eight week illustrative crop health trend."
                  className="h-32 w-full text-forest-700"
                />
                <div className="mt-2 flex justify-between text-[10px] font-semibold text-ink-muted">
                  {healthTrendLabels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
                <p className="mt-4 text-[11px] text-ink-muted">
                  Not weather-adjusted or model-generated. Shown to illustrate
                  a weekly summary.
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-line bg-white shadow-card">
              <header className="flex items-center justify-between border-b border-line px-6 py-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                    Field reports
                  </p>
                  <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em] text-forest-950">
                    Recent activity
                  </h2>
                </div>
                <Link
                  href="/field-reports"
                  className="inline-flex items-center gap-1 text-[12px] font-bold text-forest-700 hover:text-forest-900"
                >
                  View all
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </header>
              <div className="divide-y divide-line">
                {recentReports.slice(0, 3).map((report) => (
                  <div key={report.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-forest-950">
                          {report.issueType} · {report.crop}
                        </p>
                        <p className="text-[12px] text-ink-muted">
                          {report.field} · {report.date}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${
                          report.severity === "High"
                            ? "bg-clay-100 text-clay-600"
                            : report.severity === "Moderate"
                              ? "bg-sun-100 text-sun-600"
                              : "bg-forest-100 text-forest-700"
                        }`}
                      >
                        {report.severity}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-ink-muted">
                      {report.description}
                    </p>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">
                      {report.status} · Sample
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Threat indicators */}
          <section className="rounded-3xl border border-line bg-white shadow-card">
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                  Threat indicators
                </p>
                <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em] text-forest-950">
                  Watch list
                </h2>
              </div>
              <Link
                href="/threat-map"
                className="inline-flex items-center gap-1 text-[12px] font-bold text-forest-700 hover:text-forest-900"
              >
                Open map
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </header>
            <div className="divide-y divide-line">
              {threatSignals.map((signal) => (
                <div key={signal.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`grid size-9 place-items-center rounded-xl ${
                          signal.level === "high"
                            ? "bg-clay-100 text-clay-600"
                            : signal.level === "moderate"
                              ? "bg-sun-100 text-sun-600"
                              : "bg-forest-100 text-forest-700"
                        }`}
                      >
                        <TriangleAlert size={16} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-bold text-forest-950">
                          {signal.title}
                        </p>
                        <p className="text-[12px] text-ink-muted">
                          {signal.crop} · {signal.field}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${levelStyles[signal.level]}`}
                    >
                      {signal.level}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] leading-5 text-ink-muted">
                    {signal.summary}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">
                    Updated {signal.updated} · Demo
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Weather */}
          <section className="rounded-3xl border border-line bg-forest-950 p-6 text-white shadow-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-300">
                  Weather snapshot
                </p>
                <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em]">
                  Sample conditions
                </h2>
              </div>
              <span className="grid size-10 place-items-center rounded-2xl bg-forest-900 text-citron-300">
                <CloudSun size={18} aria-hidden="true" />
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-forest-900/70 p-3.5">
                <div className="flex items-center gap-2 text-forest-300">
                  <ThermometerSun size={14} aria-hidden="true" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em]">
                    Temp
                  </p>
                </div>
                <p className="mt-1.5 font-display text-2xl font-semibold">
                  {weatherSnapshot.temperature}
                </p>
              </div>
              <div className="rounded-2xl bg-forest-900/70 p-3.5">
                <div className="flex items-center gap-2 text-forest-300">
                  <Droplets size={14} aria-hidden="true" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em]">
                    Humidity
                  </p>
                </div>
                <p className="mt-1.5 font-display text-2xl font-semibold">
                  {weatherSnapshot.humidity}
                </p>
              </div>
              <div className="rounded-2xl bg-forest-900/70 p-3.5">
                <div className="flex items-center gap-2 text-forest-300">
                  <CloudSun size={14} aria-hidden="true" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em]">
                    Rain
                  </p>
                </div>
                <p className="mt-1.5 text-lg font-extrabold">
                  {weatherSnapshot.rainfall}
                </p>
              </div>
              <div className="rounded-2xl bg-forest-900/70 p-3.5">
                <div className="flex items-center gap-2 text-forest-300">
                  <Wind size={14} aria-hidden="true" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em]">
                    Wind
                  </p>
                </div>
                <p className="mt-1.5 text-lg font-extrabold">
                  {weatherSnapshot.wind}
                </p>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-forest-300/80">
              {weatherSnapshot.condition} · {weatherSnapshot.observed}
            </p>
          </section>

          {/* Quick actions */}
          <section className="rounded-3xl border border-line bg-white shadow-card">
            <header className="border-b border-line px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                Quick actions
              </p>
              <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em] text-forest-950">
                Do the next thing
              </h2>
            </header>
            <div className="space-y-2 p-3">
              <Link
                href="/scanner"
                className="flex items-center justify-between rounded-2xl px-3 py-2.5 transition-colors hover:bg-forest-50"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-forest-100 text-forest-700">
                    <Leaf size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-forest-950">
                      Scan a crop
                    </p>
                    <p className="text-[11px] text-ink-muted">
                      Guided capture with preview
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-forest-500" aria-hidden="true" />
              </Link>
              <Link
                href="/field-reports"
                className="flex items-center justify-between rounded-2xl px-3 py-2.5 transition-colors hover:bg-forest-50"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-forest-100 text-forest-700">
                    <FileText size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-forest-950">
                      Log a field report
                    </p>
                    <p className="text-[11px] text-ink-muted">
                      Save locally in this demo
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-forest-500" aria-hidden="true" />
              </Link>
              <Link
                href="/risk-assessment"
                className="flex items-center justify-between rounded-2xl px-3 py-2.5 transition-colors hover:bg-forest-50"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-forest-100 text-forest-700">
                    <CalendarClock size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-forest-950">
                      Review risk factors
                    </p>
                    <p className="text-[11px] text-ink-muted">
                      See what drives the demo score
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-forest-500" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
