"use client";

import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  FileText,
  Filter,
  MapPin,
  Plus,
  UserRound,
} from "lucide-react";
import { Badge, DemoNote, SampleTag } from "@/components/ui";
import {
  cropOptions,
  issueTypeOptions,
  recentReports,
  type RecentReport,
} from "@/lib/demo-data";

const severityStyles: Record<string, string> = {
  High: "bg-clay-100 text-clay-600",
  Moderate: "bg-sun-100 text-sun-600",
  Low: "bg-forest-100 text-forest-700",
};

const statusStyles: Record<string, string> = {
  "Pending review": "bg-sun-100 text-sun-600",
  Triaged: "bg-forest-100 text-forest-700",
  Closed: "bg-forest-100 text-forest-700",
};

type FormState = {
  reporter: string;
  phone: string;
  crop: string;
  field: string;
  issueType: string;
  severity: string;
  date: string;
  description: string;
};

const initialForm: FormState = {
  reporter: "",
  phone: "",
  crop: "Tomato",
  field: "",
  issueType: "Disease",
  severity: "Moderate",
  date: new Date().toISOString().slice(0, 10),
  description: "",
};

export function FieldReportsClient() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);
  const [reports, setReports] = useState<RecentReport[]>(recentReports);
  const [filter, setFilter] = useState<"All" | "Disease" | "Pest" | "Other">(
    "All",
  );
  const [storageNotice, setStorageNotice] = useState(false);
  const skipNextSaveRef = useRef(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cropshield-field-reports");
      if (stored) {
        const parsed = JSON.parse(stored) as RecentReport[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Hydrate client-only saved reports after mount.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setReports([...parsed, ...recentReports]);
        }
      }
    } catch {
      // Ignore malformed storage and fall back to sample reports.
    }
  }, []);

  useEffect(() => {
    // Skip the first save so the initial sample-only render cannot clear
    // reports that were previously saved in this browser.
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    try {
      const savedOnly = reports.filter((report) => !report.sample);
      localStorage.setItem(
        "cropshield-field-reports",
        JSON.stringify(savedOnly),
      );
    } catch {
      // Ignore storage quota/privacy-mode failures.
    }
  }, [reports]);

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.reporter.trim()) nextErrors.reporter = "Enter a name.";
    if (!form.field.trim()) nextErrors.field = "Enter the field or location.";
    if (!form.date) nextErrors.date = "Select the date observed.";
    if (form.description.trim().length < 15) {
      nextErrors.description =
        "Add a short description (at least 15 characters).";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);

    if (!validate()) {
      const firstError = document.querySelector("[data-error='true']");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const newReport: RecentReport = {
      id: `local-${crypto.randomUUID()}`,
      reporter: form.reporter.trim(),
      crop: form.crop,
      field: form.field.trim(),
      issueType: form.issueType,
      severity: form.severity as RecentReport["severity"],
      date: form.date,
      description: form.description.trim(),
      status: "Pending review",
      sample: false,
    };

    setReports((current) => [newReport, ...current]);
    setForm({ ...initialForm, date: new Date().toISOString().slice(0, 10) });
    setErrors({});
    setSubmitted(true);
    setStorageNotice(true);
    window.setTimeout(() => setStorageNotice(false), 6000);
    document
      .getElementById("reports-list")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredReports = reports.filter((report) => {
    if (filter === "All") return true;
    if (filter === "Other") {
      return !["Disease", "Pest"].includes(report.issueType);
    }
    return report.issueType === filter;
  });

  const chips = [
    { id: "All" as const, label: "All" },
    { id: "Disease" as const, label: "Disease" },
    { id: "Pest" as const, label: "Pest" },
    { id: "Other" as const, label: "Other" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="forest">
              <ClipboardList size={12} aria-hidden="true" />
              Field reports
            </Badge>
            <SampleTag label="Working form + sample data" />
          </div>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold leading-[1.01] tracking-[-0.038em] text-forest-950">
            Turn a hunch into a trackable report.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-ink-muted">
            Submit observations in a consistent format. In this demo, new
            reports are saved only in your browser with clear labels. No
            notifications are sent to an extension officer.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <DemoNote title="Working demo form">
          Validation is active, reports persist to localStorage, and sample
          reports are clearly labelled. This is a UI workflow only.
        </DemoNote>
        {storageNotice ? (
          <div role="status" aria-live="polite" className="flex items-start gap-2 rounded-xl border border-forest-200 bg-forest-50 px-3 py-2 text-[13px] text-forest-900">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-forest-600" aria-hidden="true" />
            <p>
              <strong className="font-bold">Report saved locally.</strong>{" "}
              It appears below with <strong>Pending review</strong> status.
            </p>
          </div>
        ) : null}
        {submitted && !storageNotice ? (
          <div role="status" aria-live="polite" className="flex items-start gap-2 rounded-xl border border-forest-200 bg-forest-50 px-3 py-2 text-[13px] text-forest-900">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-forest-600" aria-hidden="true" />
            <p>Report submitted. Saved to this browser only.</p>
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Form */}
        <section className="rounded-2xl border border-forest-200 bg-forest-50/40 shadow-card">
          <header className="border-b border-forest-200 px-5 py-4 sm:px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">
              New field report
            </p>
            <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em] text-forest-950">
              Capture observations
            </h2>
          </header>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 px-5 py-5 sm:px-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-bold text-forest-950">
                  Reporter name <span aria-hidden="true">*</span>
                </span>
                <div className="relative">
                  <UserRound
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                    aria-hidden="true"
                  />
                  <input
                    value={form.reporter}
                    onChange={(event) => setForm({ ...form, reporter: event.target.value })}
                    className={`h-10 w-full rounded-lg border bg-white pl-9 pr-2 text-sm text-forest-900 focus:outline-none ${
                      errors.reporter
                        ? "border-clay-500"
                        : "border-line hover:border-forest-300 focus:border-forest-600"
                    }`}
                    placeholder="e.g. Wanjiku Kamau"
                  />
                </div>
                {errors.reporter ? (
                  <span className="text-[11px] font-semibold text-clay-600" data-error="true">
                    {errors.reporter}
                  </span>
                ) : null}
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-bold text-forest-950">
                  Phone (optional)
                </span>
                <input
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  className="h-10 rounded-lg border border-line bg-white px-2 text-sm text-forest-900 focus:outline-none hover:border-forest-300 focus:border-forest-600"
                  placeholder="e.g. +254..."
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-bold text-forest-950">
                  Crop
                </span>
                <select
                  value={form.crop}
                  onChange={(event) => setForm({ ...form, crop: event.target.value })}
                  className="h-10 rounded-lg border border-line bg-white px-2 text-sm text-forest-900 focus:outline-none hover:border-forest-300 focus:border-forest-600"
                >
                  {cropOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-bold text-forest-950">
                  Field / location <span aria-hidden="true">*</span>
                </span>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                    aria-hidden="true"
                  />
                  <input
                    value={form.field}
                    onChange={(event) => setForm({ ...form, field: event.target.value })}
                    className={`h-10 w-full rounded-lg border bg-white pl-9 pr-2 text-sm text-forest-900 focus:outline-none ${
                      errors.field
                        ? "border-clay-500"
                        : "border-line hover:border-forest-300 focus:border-forest-600"
                    }`}
                    placeholder="e.g. Athi River Plot C"
                  />
                </div>
                {errors.field ? (
                  <span className="text-[11px] font-semibold text-clay-600" data-error="true">
                    {errors.field}
                  </span>
                ) : null}
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-bold text-forest-950">
                  Issue type
                </span>
                <select
                  value={form.issueType}
                  onChange={(event) => setForm({ ...form, issueType: event.target.value })}
                  className="h-10 rounded-lg border border-line bg-white px-2 text-sm text-forest-900 focus:outline-none hover:border-forest-300 focus:border-forest-600"
                >
                  {issueTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-bold text-forest-950">
                  Severity
                </span>
                <select
                  value={form.severity}
                  onChange={(event) => setForm({ ...form, severity: event.target.value })}
                  className="h-10 rounded-lg border border-line bg-white px-2 text-sm text-forest-900 focus:outline-none hover:border-forest-300 focus:border-forest-600"
                >
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-bold text-forest-950">
                  Date observed <span aria-hidden="true">*</span>
                </span>
                <div className="relative">
                  <Calendar
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                    aria-hidden="true"
                  />
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm({ ...form, date: event.target.value })}
                    className={`h-10 w-full rounded-lg border bg-white pl-9 pr-2 text-sm text-forest-900 focus:outline-none ${
                      errors.date
                        ? "border-clay-500"
                        : "border-line hover:border-forest-300 focus:border-forest-600"
                    }`}
                  />
                </div>
                {errors.date ? (
                  <span className="text-[11px] font-semibold text-clay-600" data-error="true">
                    {errors.date}
                  </span>
                ) : null}
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-bold text-forest-950">
                Description <span aria-hidden="true">*</span>
              </span>
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                rows={4}
                className={`rounded-xl border bg-white px-3 py-2 text-sm leading-6 text-forest-900 focus:outline-none ${
                  errors.description
                    ? "border-clay-500"
                    : "border-line hover:border-forest-300 focus:border-forest-600"
                }`}
                placeholder="Describe location in field, plant parts affected, when noticed, and any changes..."
                aria-invalid={errors.description ? "true" : "false"}
              />
              <div className="flex items-center justify-between text-[11px] text-ink-muted">
                <span>Helpful details for triage</span>
                <span>{form.description.trim().length}/min 15</span>
              </div>
              {errors.description ? (
                <span className="text-[11px] font-semibold text-clay-600" role="alert" data-error="true">
                  {errors.description}
                </span>
              ) : null}
            </label>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-[11px] text-ink-muted">
                <FileText size={14} aria-hidden="true" />
                Demo only — no notifications sent.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-forest-800"
              >
                <Plus size={16} aria-hidden="true" />
                Submit field report
              </button>
            </div>
          </form>
        </section>

        {/* Tips */}
        <div className="space-y-6">
          <section className="rounded-3xl border border-line bg-white shadow-card">
            <header className="border-b border-line px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                Report tips
              </p>
              <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em] text-forest-950">
                Make it triage-friendly
              </h2>
            </header>
            <div className="space-y-3 px-6 py-5">
              {[
                "Note the edge/block of field and how many plants affected.",
                "Photograph both healthy and affected parts in daylight.",
                "Record when first noticed and if it is spreading.",
                "Mention recent rain, irrigation or inputs if relevant.",
                "Only share what you are comfortable recording in this demo.",
              ].map((tip) => (
                <div key={tip} className="flex gap-2.5 text-[13px] leading-5 text-ink-muted">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-forest-600" aria-hidden="true" />
                  {tip}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-forest-200 bg-forest-50/70 p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-forest-900 text-citron-300">
                <ClipboardList size={16} aria-hidden="true" />
              </span>
              <h2 className="text-[15px] font-extrabold text-forest-950">
                What counts as a report
              </h2>
            </div>
            <p className="mt-2 text-[13px] leading-6 text-forest-900/80">
              Include observable facts. Avoid guessing a name unless unsure — say
              &quot;unknown&quot; and describe symptoms. This matches how a
              good triage form works.
            </p>
          </section>
        </div>
      </div>

      {/* Reports list */}
      <section id="reports-list" className="mt-6 scroll-mt-24 rounded-2xl border border-line bg-white shadow-card">
        <header className="flex flex-col gap-4 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
              Report history
            </p>
            <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em] text-forest-950">
              Sample data &amp; your submissions
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-ink-muted">
              <Filter size={13} aria-hidden="true" />
              Filter
            </div>
            {chips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilter(chip.id)}
                aria-pressed={filter === chip.id}
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${
                  filter === chip.id
                    ? "bg-forest-900 text-white"
                    : "border border-line bg-white text-ink-muted hover:text-forest-900"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </header>

        <div className="divide-y divide-line">
          {filteredReports.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-ink-muted">
              No reports match this filter.
            </div>
          ) : (
            filteredReports.map((report) => (
              <article key={report.id} className="flex flex-col gap-3 px-5 py-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-extrabold text-forest-950">
                      {report.issueType} · {report.crop}
                    </p>
                    {report.sample ? <SampleTag /> : <Badge tone="citron">Saved in browser</Badge>}
                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${severityStyles[report.severity]}`}
                    >
                      {report.severity}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${statusStyles[report.status]}`}
                  >
                    {report.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[12px] text-ink-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} aria-hidden="true" />
                    {report.field}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <UserRound size={13} aria-hidden="true" />
                    {report.reporter}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={13} aria-hidden="true" />
                    {report.date}
                  </span>
                </div>
                <p className="text-[13px] leading-6 text-forest-900/80">
                  {report.description}
                </p>
              </article>
            ))
          )}
        </div>
        <div className="border-t border-line px-5 py-3 text-center text-[11px] text-ink-muted sm:px-6">
          Sample reports are pre-loaded. New reports are appended to the top and
          saved to localStorage under <code>cropshield-field-reports</code>.
        </div>
      </section>
    </div>
  );
}
