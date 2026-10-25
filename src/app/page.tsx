import Link from "next/link";
import { ArrowRight, ClipboardList, MapPin, ScanLine, TriangleAlert } from "lucide-react";
import { Badge, DemoNote, SampleTag } from "@/components/ui";
import {
  cropFields,
  farmProfile,
  recentReports,
  threatSignals,
} from "@/lib/demo-data";

export default function HomePage() {
  const urgent = threatSignals
    .filter((s) => s.level === "high")
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="forest">Home</Badge>
            <SampleTag label="Sample data" />
          </div>
          <h1 className="mt-3 font-display text-[clamp(2.1rem,4.5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-forest-950">
            {farmProfile.farmer}&apos;s farm overview
          </h1>
          <p className="mt-2 text-[14px] text-ink-muted">
            {farmProfile.name} · {farmProfile.location} · {farmProfile.fields}{" "}
            fields · {farmProfile.area}
          </p>
        </div>
        <Link
          href="/scan-assess"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-forest-800"
        >
          Scan a crop
          <ScanLine size={16} aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-6">
        <DemoNote title="Demo scope">
          No AI diagnosis, live weather, or real outbreak prediction is connected. All values below are sample data.
        </DemoNote>
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-white shadow-card">
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <ClipboardList size={16} className="text-forest-600" aria-hidden="true" />
            <h2 className="text-[15px] font-extrabold text-forest-950">
              Crop health summary
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-forest-700">
            Farm health {farmProfile.health}/100
          </span>
        </header>
        <div className="divide-y divide-line">
          {cropFields.map((field) => (
            <div
              key={field.id}
              className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-bold text-forest-950">{field.name}</p>
                <p className="text-[12px] text-ink-muted">
                  {field.crop} · {field.stage} · {field.area}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-semibold text-ink-muted">
                  Health {field.health}/100
                </span>
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
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white shadow-card">
          <header className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="flex items-center gap-2">
              <TriangleAlert size={16} className="text-clay-600" aria-hidden="true" />
              <h2 className="text-[15px] font-extrabold text-forest-950">
                Urgent alerts
              </h2>
            </div>
            <Link
              href="/field-activity"
              className="inline-flex items-center gap-1 text-[12px] font-bold text-forest-700"
            >
              View all
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </header>
          <div className="divide-y divide-line">
            {urgent.length > 0 ? (
              urgent.map((signal) => (
                <div key={signal.id} className="px-5 py-3">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-forest-950">{signal.title}</p>
                    <span className="rounded-full bg-clay-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-clay-600">
                      High
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-ink-muted">
                    {signal.crop} · {signal.field}
                  </p>
                  <p className="mt-2 text-[12px] leading-5 text-ink-muted">
                    {signal.summary}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">
                    Demo signal · {signal.updated}
                  </p>
                </div>
              ))
            ) : (
              <p className="px-5 py-4 text-[13px] text-ink-muted">
                No high-priority alerts in sample data.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white shadow-card">
          <header className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-forest-600" aria-hidden="true" />
              <h2 className="text-[15px] font-extrabold text-forest-950">
                Recent field reports
              </h2>
            </div>
            <Link
              href="/field-activity"
              className="inline-flex items-center gap-1 text-[12px] font-bold text-forest-700"
            >
              Field Activity
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </header>
          <div className="divide-y divide-line">
            {recentReports.slice(0, 3).map((report) => (
              <div key={report.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-forest-950">
                    {report.issueType} · {report.crop}
                  </p>
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
                <p className="mt-1 text-[12px] text-ink-muted">
                  {report.field} · {report.date} · {report.status}
                </p>
                <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-ink-muted">
                  {report.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-line bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[15px] font-extrabold text-forest-950">
            Check a crop for symptoms
          </p>
          <p className="text-[13px] text-ink-muted">
            Guided workflow: crop, stage, photo/symptoms, and assessment results in one place.
          </p>
        </div>
        <Link
          href="/scan-assess"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-forest-800"
        >
          Start Scan & Assess
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
