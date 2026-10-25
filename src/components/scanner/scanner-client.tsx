"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  FileImage,
  Info,
  ScanLine,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { Badge, DemoNote, SampleTag } from "@/components/ui";
import { cropOptions, growthStageOptions } from "@/lib/demo-data";

type CapturedFile = {
  file: File;
  url: string;
  name: string;
  size: number;
};

export function ScannerClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [crop, setCrop] = useState("Tomato");
  const [stage, setStage] = useState("Fruiting / grain fill");
  const [captured, setCaptured] = useState<CapturedFile | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPreview = () => {
    if (captured?.url.startsWith("blob:")) {
      URL.revokeObjectURL(captured.url);
    }
    setCaptured(null);
    setSubmitted(false);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, WebP or similar).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Image is too large. Please use a file under 8 MB.");
      return;
    }

    if (captured?.url.startsWith("blob:")) {
      URL.revokeObjectURL(captured.url);
    }

    const url = URL.createObjectURL(file);
    setCaptured({
      file,
      url,
      name: file.name,
      size: Math.round((file.size / 1024 / 1024) * 10) / 10,
    });
    setSubmitted(false);
    setError(null);
  };

  const useSample = () => {
    if (captured?.url.startsWith("blob:")) {
      URL.revokeObjectURL(captured.url);
    }
    setCaptured({
      file: new File([], "sample-leaf.svg", { type: "image/svg+xml" }),
      url: "/sample-leaf.svg",
      name: "sample-leaf.svg",
      size: 0.01,
    });
    setSubmitted(false);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!captured) {
      setError("Add a photo or use the sample leaf illustration before previewing.");
      return;
    }

    setSubmitted(true);
    window.setTimeout(() => {
      document
        .getElementById("scanner-preview")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  useEffect(() => {
    return () => {
      if (captured?.url.startsWith("blob:")) {
        URL.revokeObjectURL(captured.url);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="forest">
              <ScanLine size={12} aria-hidden="true" />
              Crop health scanner
            </Badge>
            <SampleTag label="Demo capture" />
          </div>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold leading-[1.01] tracking-[-0.038em] text-forest-950">
            Guided capture, no pretend diagnosis.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-ink-muted">
            Select the crop and growth stage, add a clear photo, and preview
            the capture. This interface is ready for an image model, but none
            is connected in this build.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <DemoNote title="No AI analysis in this build">
          Images stay in your browser for preview. Nothing is uploaded or
          diagnosed. Submitting only prepares a readable summary of what would
          go to an analysis pipeline.
        </DemoNote>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Form */}
        <section className="rounded-3xl border border-line bg-white shadow-card">
          <header className="border-b border-line px-6 py-5 sm:px-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
              Capture details
            </p>
            <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em] text-forest-950">
              Crop, stage and photo
            </h2>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6 sm:px-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-forest-950">
                  Crop
                </span>
                <select
                  value={crop}
                  onChange={(event) => setCrop(event.target.value)}
                  className="h-11 rounded-xl border border-line bg-white px-3 text-sm font-semibold text-forest-900 transition-colors hover:border-forest-300 focus:border-forest-600 focus:outline-none"
                >
                  {cropOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-forest-950">
                  Growth stage
                </span>
                <select
                  value={stage}
                  onChange={(event) => setStage(event.target.value)}
                  className="h-11 rounded-xl border border-line bg-white px-3 text-sm font-semibold text-forest-900 transition-colors hover:border-forest-300 focus:border-forest-600 focus:outline-none"
                >
                  {growthStageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-forest-950">
                  Plant photo
                </span>
                <button
                  type="button"
                  onClick={useSample}
                  className="text-[12px] font-bold text-forest-700 transition-colors hover:text-forest-900"
                >
                  Use sample leaf illustration
                </button>
              </div>

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setDragActive(false);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragActive(false);
                  handleFiles(event.dataTransfer.files);
                }}
                className={`relative flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed px-6 py-10 text-center transition-all ${
                  dragActive
                    ? "border-forest-500 bg-forest-50"
                    : "border-forest-300 bg-forest-50/40"
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleFiles(event.target.files)}
                  className="sr-only"
                  id="crop-image"
                />

                {captured ? (
                  <div className="flex w-full flex-col items-center gap-4">
                    <div className="relative aspect-[4/3] w-full max-w-[420px] overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={captured.url}
                        alt="Captured crop preview"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <Badge tone="forest">
                        <FileImage size={12} aria-hidden="true" />
                        {captured.name}
                      </Badge>
                      {captured.size > 0 ? (
                        <Badge tone="neutral">{captured.size} MB</Badge>
                      ) : null}
                      <button
                        type="button"
                        onClick={resetPreview}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-bold text-ink-muted transition-colors hover:text-forest-900"
                      >
                        <X size={13} aria-hidden="true" />
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-bold text-forest-700 transition-colors hover:text-forest-900"
                      >
                        Change photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="grid size-14 place-items-center rounded-full bg-white text-forest-600 shadow-sm">
                      <Upload size={22} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-base font-extrabold text-forest-950">
                        Drag and drop a photo, or browse
                      </p>
                      <p className="mt-1 text-[13px] text-ink-muted">
                        JPG, PNG or WebP · up to 8 MB · stays in your browser
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-forest-800"
                    >
                      <Camera size={16} aria-hidden="true" />
                      Choose image
                    </button>
                  </>
                )}
              </div>
            </div>

            {error ? (
              <div className="flex items-start gap-3 rounded-2xl border border-clay-500/20 bg-clay-100/60 px-4 py-3.5 text-sm text-clay-600">
                <AlertTriangle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                <p>{error}</p>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-[12px] text-ink-muted">
                <Info size={14} aria-hidden="true" />
                No image is sent to a server in this demo.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-forest-800"
              >
                Preview capture
                <ScanLine size={16} aria-hidden="true" />
              </button>
            </div>
          </form>
        </section>

        {/* Guidance */}
        <div className="space-y-6">
          <section className="rounded-3xl border border-line bg-white shadow-card">
            <header className="border-b border-line px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                Readiness check
              </p>
              <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em] text-forest-950">
                What this screen will do
              </h2>
            </header>
            <div className="space-y-4 px-6 py-5">
              {[
                {
                  icon: Camera,
                  title: "Guided capture",
                  body: "Crop and growth stage are captured to give context to any future analysis.",
                },
                {
                  icon: ShieldCheck,
                  title: "Explainable pipeline",
                  body: "When connected, results should show evidence (regions, lesions) not just a label.",
                },
                {
                  icon: CheckCircle2,
                  title: "Field-first actions",
                  body: "Any future diagnosis should link to a scouting checklist and a field report.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-700">
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-bold text-forest-950">{item.title}</p>
                      <p className="mt-1 text-[13px] leading-5 text-ink-muted">
                        {item.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-forest-200 bg-forest-50/70 p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-forest-900 text-citron-300">
                <Info size={16} aria-hidden="true" />
              </span>
              <h2 className="text-[15px] font-extrabold text-forest-950">
                Privacy note
              </h2>
            </div>
            <p className="mt-2 text-[13px] leading-6 text-forest-900/80">
              This demo uses <code className="rounded bg-white/70 px-1 py-0.5">URL.createObjectURL</code>{" "}
              for preview only. Files are never uploaded or stored on a server.
            </p>
          </section>
        </div>
      </div>

      {/* Preview */}
      <section
        id="scanner-preview"
        className={`mt-6 transition-all ${
          submitted ? "scroll-mt-24" : "pointer-events-none opacity-40"
        }`}
      >
        <div className="rounded-3xl border border-line bg-white shadow-card">
          <header className="flex flex-col gap-3 border-b border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                Capture preview
              </p>
              <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em] text-forest-950">
                Ready for review
              </h2>
            </div>
            <Badge tone="citron">No diagnosis generated</Badge>
          </header>

          <div className="grid gap-6 px-6 py-6 sm:px-7 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-2xl border border-line bg-forest-50">
              {captured ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={captured.url}
                  alt="Preview of captured plant photo"
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-paper p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                  Submission summary
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <dt className="text-[11px] text-ink-muted">Crop</dt>
                    <dd className="mt-1 font-bold text-forest-950">{crop}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-ink-muted">Growth stage</dt>
                    <dd className="mt-1 font-bold text-forest-950">{stage}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-[11px] text-ink-muted">Image</dt>
                    <dd className="mt-1 font-bold text-forest-950">
                      {captured?.name}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-clay-500/20 bg-clay-100/40 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    size={18}
                    className="mt-0.5 shrink-0 text-clay-600"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-extrabold text-clay-600">
                      Analysis not run
                    </p>
                    <p className="mt-1 text-[13px] leading-6 text-clay-600/90">
                      No AI model is connected in this build. No disease,
                      pest or deficiency diagnosis was produced. If you were
                      submitting to a real service, this is exactly where a
                      result would appear with evidence and confidence.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                  Next steps (suggested)
                </p>
                <ul className="mt-3 space-y-2 text-[13px] text-forest-900/80">
                  <li className="flex gap-2">
                    <CheckCircle2 size={15} className="mt-0.5 text-forest-600" aria-hidden="true" />
                    Scout 10–20 plants across the field for matching symptoms.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 size={15} className="mt-0.5 text-forest-600" aria-hidden="true" />
                    Take clear close-ups of both sides of affected leaves.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 size={15} className="mt-0.5 text-forest-600" aria-hidden="true" />
                    Submit a structured report with location and observations.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
