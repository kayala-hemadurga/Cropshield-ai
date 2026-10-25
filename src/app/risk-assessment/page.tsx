import type { Metadata } from "next";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Info,
  Lightbulb,
  Radar,
  Scale,
  Sprout,
} from "lucide-react";
import Link from "next/link";
import { Badge, DemoNote, SampleTag, ScoreRing } from "@/components/ui";
import { riskAssessment } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Risk assessment",
  description:
    "Explainable risk factors with suggested next steps. Illustrative demo score — not a live prediction.",
};

const factorTone: Record<string, string> = {
  Elevated: "bg-clay-100 text-clay-600",
  Moderate: "bg-sun-100 text-sun-600",
  Low: "bg-forest-100 text-forest-700",
};

export default function RiskAssessmentPage() {
  const totalWeight = riskAssessment.factors.reduce(
    (sum, factor) => sum + factor.weight,
    0,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="forest">
              <Radar size={12} aria-hidden="true" />
              Risk assessment
            </Badge>
            <SampleTag label="Illustrative output" />
          </div>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold leading-[1.01] tracking-[-0.038em] text-forest-950">
            A score you can interrogate.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-ink-muted">
            Every factor is shown with weight, evidence and contribution. The
            score below is an illustrative calculation for demo purposes — not
            produced by a trained model.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/scanner"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-bold text-forest-900 transition-colors hover:bg-forest-50"
          >
            Capture in scanner
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href="/field-reports"
            className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-forest-800"
          >
            Submit field report
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <DemoNote title="Not a live prediction">
          Weather, history and nearby reports here are sample values. No real
          weather API or outbreak model is connected. Treat suggested actions as
          a scouting prompt to verify with an extension officer.
        </DemoNote>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Score card */}
        <section className="rounded-3xl border border-line bg-forest-950 text-white shadow-lift">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[auto_1fr] lg:items-center">
            <ScoreRing
              score={riskAssessment.score}
              band={riskAssessment.band}
              dark
            />
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge tone="citron">Illustrative assessment</Badge>
                <span className="text-[11px] font-semibold text-forest-300">
                  {riskAssessment.assessed}
                </span>
              </div>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                Elevated risk for late blight
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-7 text-forest-200/80">
                {riskAssessment.summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-full border border-forest-700 px-3.5 py-2 text-[11px] font-semibold text-forest-200">
                  Field: {riskAssessment.field}
                </div>
                <div className="rounded-full border border-forest-700 px-3.5 py-2 text-[11px] font-semibold text-forest-200">
                  {riskAssessment.crop} · {riskAssessment.variety}
                </div>
                <div className="rounded-full border border-forest-700 px-3.5 py-2 text-[11px] font-semibold text-forest-200">
                  Stage: {riskAssessment.stage}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explanation */}
        <section className="rounded-3xl border border-line bg-white shadow-card">
          <header className="flex items-center justify-between border-b border-line px-6 py-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                Calculation
              </p>
              <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em] text-forest-950">
                How this demo score works
              </h2>
            </div>
            <Scale size={18} className="text-forest-500" aria-hidden="true" />
          </header>
          <div className="px-6 py-5">
            <p className="text-[13px] leading-6 text-ink-muted">
              Weights are illustrative and sum to {totalWeight}. Each factor
              contributes to the score shown. No regression model, no live
              features and no confidence calibration are implemented.
            </p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-paper">
                    <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted">
                      Factor
                    </th>
                    <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted">
                      Weight
                    </th>
                    <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted">
                      Demo contrib.
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {riskAssessment.factors.map((factor) => (
                    <tr key={factor.id}>
                      <td className="px-4 py-2.5 font-semibold text-forest-950">
                        {factor.name}
                      </td>
                      <td className="px-4 py-2.5 text-right text-ink-muted">
                        {factor.weight}%
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-forest-900">
                        {factor.contribution}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-paper">
                    <td className="px-4 py-2.5 font-bold text-forest-950">
                      Total
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-forest-950">
                      {totalWeight}%
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-forest-950">
                      {riskAssessment.score}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* Factors */}
      <section className="mt-6 rounded-3xl border border-line bg-white shadow-card">
        <header className="flex flex-col gap-3 border-b border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
              Factor breakdown
            </p>
            <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em] text-forest-950">
              What is driving this score
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold text-ink-muted">
            <BarChart3 size={13} aria-hidden="true" />
            Transparent weights
          </div>
        </header>
        <div className="grid gap-4 px-6 py-6 sm:px-7 lg:grid-cols-2">
          {riskAssessment.factors.map((factor) => (
            <article
              key={factor.id}
              className="rounded-2xl border border-line p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] font-extrabold text-forest-950">
                    {factor.name}
                  </p>
                  <p className="mt-1 text-[12px] text-ink-muted">
                    Weight {factor.weight}% · Contribution {factor.contribution}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${factorTone[factor.level]}`}
                >
                  {factor.level}
                </span>
              </div>
              <p className="mt-3 text-[13px] leading-6 text-ink-muted">
                {factor.description}
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-paper px-3 py-2">
                <Info size={14} className="text-forest-600" aria-hidden="true" />
                <p className="text-[11px] font-semibold text-forest-800">
                  Evidence: {factor.evidence}
                </p>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-forest-100">
                <div
                  className="h-full rounded-full bg-forest-600"
                  style={{ width: `${factor.contribution}%` }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="mt-6 rounded-3xl border border-line bg-white shadow-card">
        <header className="flex flex-col gap-3 border-b border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
              Recommended next steps
            </p>
            <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em] text-forest-950">
              Scout-first, escalate when needed
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold text-ink-muted">
            <ClipboardList size={13} aria-hidden="true" />
            Actionable checklist
          </div>
        </header>
        <div className="grid gap-4 px-6 py-6 sm:px-7 lg:grid-cols-2">
          {riskAssessment.steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-2xl border border-line p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-full bg-forest-100 font-display text-base font-semibold text-forest-800">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[15px] font-extrabold text-forest-950">
                      {step.title}
                    </p>
                    <p className="text-[11px] text-ink-muted">
                      {step.timeframe} ·{" "}
                      {step.priority === "high" ? "High priority" : "Follow up"}
                    </p>
                  </div>
                </div>
                <CheckCircle2 size={18} className="text-forest-500" aria-hidden="true" />
              </div>
              <p className="mt-3 text-[13px] leading-6 text-ink-muted">
                {step.detail}
              </p>
            </article>
          ))}
        </div>
        <div className="border-t border-line px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Lightbulb
                size={18}
                className="mt-0.5 shrink-0 text-forest-600"
                aria-hidden="true"
              />
              <p className="text-[13px] leading-6 text-ink-muted">
                <strong className="font-bold text-forest-900">
                  Important:
                </strong>{" "}
                These are suggested actions for this demo only. They are not
                agronomic advice. Always verify with a qualified extension
                officer before making costly interventions.
              </p>
            </div>
            <Link
              href="/field-reports"
              className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-forest-800"
            >
              <Sprout size={16} aria-hidden="true" />
              Log findings as a report
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
