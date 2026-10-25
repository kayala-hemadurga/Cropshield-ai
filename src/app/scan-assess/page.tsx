"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Camera, ChevronDown, ChevronUp, Info, ScanLine } from "lucide-react";
import { Badge, DemoNote, SampleTag } from "@/components/ui";
import { cropOptions, growthStageOptions, riskAssessment } from "@/lib/demo-data";

type CapturedFile = {
  url: string;
  name: string;
  file?: File;
};

type CropHealthResult = {
  isDemo?: boolean;
  error?: string;
  crop?: { name?: string; scientific_name?: string };
  diseases?: Array<{ name?: string; scientific_name?: string; probability?: number; description?: string }>;
  suggestions?: Array<{ name?: string; probability?: number }>;
  [key: string]: unknown;
};

export default function ScanAssessPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [crop, setCrop] = useState("Tomato");
  const [stage, setStage] = useState("Fruiting / grain fill");
  const [symptoms, setSymptoms] = useState("");
  const [captured, setCaptured] = useState<CapturedFile | null>(null);
  const [showFactors, setShowFactors] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [apiResult, setApiResult] = useState<CropHealthResult | null>(null);
  const [demoMode, setDemoMode] = useState(true);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;
    if (captured?.url.startsWith("blob:")) URL.revokeObjectURL(captured.url);
    setCaptured({ url: URL.createObjectURL(file), name: file.name, file });
    setApiResult(null);
  };

  const useSample = () => {
    if (captured?.url.startsWith("blob:")) URL.revokeObjectURL(captured.url);
    setCaptured({ url: "/sample-leaf.svg", name: "sample-leaf.svg" });
    setApiResult(null);
  };

  useEffect(() => {
    return () => {
      if (captured?.url.startsWith("blob:")) URL.revokeObjectURL(captured.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canProceed = crop && stage;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="forest">
              <ScanLine size={12} aria-hidden="true" />
              Scan & Assess
            </Badge>
            <SampleTag label="Guided workflow" />
          </div>
          <h1 className="mt-3 font-display text-[clamp(2rem,4.2vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-forest-950">
            Crop scan and assessment
          </h1>
          <p className="mt-2 text-[14px] text-ink-muted">
            One flow: crop, growth stage, photo/symptoms, then results with risk factors and next steps.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <DemoNote title="No automated diagnosis">
          No AI diagnosis, live weather, or real outbreak prediction is connected. Results below are illustrative based on sample data.
        </DemoNote>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-white shadow-card">
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="text-[15px] font-extrabold text-forest-950">Step {step} of 3</p>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`h-1.5 w-10 rounded-full ${s <= step ? "bg-forest-600" : "bg-line"}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </header>

        {step === 1 ? (
          <div className="flex flex-col gap-4 px-5 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-forest-950">Crop</span>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="h-11 rounded-xl border border-line bg-white px-3 text-sm font-semibold text-forest-900"
                >
                  {cropOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-forest-950">Growth stage</span>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="h-11 rounded-xl border border-line bg-white px-3 text-sm font-semibold text-forest-900"
                >
                  {growthStageOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                disabled={!canProceed}
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                Next: Photo & symptoms
              </button>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="flex flex-col gap-4 px-5 py-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-forest-950">Photo (optional)</span>
                <button
                  type="button"
                  onClick={useSample}
                  className="text-[12px] font-bold text-forest-700"
                >
                  Use sample leaf
                </button>
              </div>
              <div className="mt-2 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-forest-300 bg-forest-50/40 px-4 py-6 text-center">
                <input ref={inputRef} type="file" accept="image/*" onChange={(e) => handleFiles(e.target.files)} className="sr-only" />
                {captured ? (
                  <div className="w-full max-w-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={captured.url} alt="Crop preview" className="aspect-[4/3] w-full rounded-xl object-cover" />
                    <p className="mt-2 text-[12px] text-ink-muted">{captured.name}</p>
                  </div>
                ) : (
                  <>
                    <Camera size={20} className="text-forest-600" aria-hidden="true" />
                    <p className="text-sm font-bold text-forest-950">Add a photo</p>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-forest-900"
                >
                  Choose image
                </button>
              </div>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-forest-950">Symptoms / notes (optional)</span>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={4}
                className="rounded-xl border border-line px-3 py-2 text-sm"
                placeholder="e.g. spots on lower leaves after rain..."
              />
            </label>

            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-forest-700">
                Back
              </button>
              <button
                type="button"
                onClick={async () => {
                  setApiResult(null);
                  setDemoMode(true);
                  if (captured?.file) {
                    setAnalyzing(true);
                    try {
                      const fd = new FormData();
                      fd.append("image", captured.file);
                      const res = await fetch("/api/crop-health", { method: "POST", body: fd });
                      const data = await res.json();
                      if (res.status === 503 || data?.error?.includes("Demo mode")) {
                        setDemoMode(true);
                        setApiResult({ isDemo: true, error: data?.error });
                      } else if (!res.ok) {
                        setDemoMode(true);
                        setApiResult({ isDemo: true, error: data?.error || "API request failed." });
                      } else {
                        setDemoMode(false);
                        setApiResult(data);
                      }
                    } catch {
                      setDemoMode(true);
                      setApiResult({ isDemo: true, error: "Network error calling crop.health API." });
                    } finally {
                      setAnalyzing(false);
                    }
                  } else {
                    setDemoMode(true);
                  }
                  setStep(3);
                }}
                disabled={analyzing}
                className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {analyzing ? "Analyzing..." : "See assessment"}
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="flex flex-col gap-4 px-5 py-5">
            {demoMode ? (
              <div className="rounded-xl border border-sun-500/30 bg-sun-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-sun-700">Demo Mode</p>
                  <Badge tone="citron">Sample data</Badge>
                </div>
                {apiResult?.error ? (
                  <p className="mt-2 text-[12px] text-sun-700">{apiResult.error}</p>
                ) : null}
                <p className="mt-1 text-[12px] text-ink-muted">No live crop.health analysis shown. Results below are illustrative.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-forest-200 bg-forest-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-forest-950">Crop.health results (possible matches)</p>
                  <Badge tone="forest">API</Badge>
                </div>
                <p className="mt-1 text-[11px] text-ink-muted">Results are possible matches, not guaranteed diagnoses.</p>
                {apiResult?.crop?.name ? (
                  <p className="mt-2 text-[13px] text-forest-900">Crop identified: {apiResult.crop.name} {apiResult.crop.scientific_name ? `(${apiResult.crop.scientific_name})` : ""}</p>
                ) : null}
                {(apiResult?.diseases && apiResult.diseases.length > 0) ? (
                  <div className="mt-2 space-y-1">
                    {apiResult.diseases.slice(0, 5).map((d, i) => (
                      <div key={i} className="flex items-center justify-between text-[12px]">
                        <span className="text-forest-900">{d.name || d.scientific_name || "Unknown"}</span>
                        {typeof d.probability === "number" ? <span className="text-ink-muted">{Math.round(d.probability * 100)}% confidence</span> : null}
                      </div>
                    ))}
                  </div>
                ) : (apiResult?.suggestions && apiResult.suggestions.length > 0) ? (
                  <div className="mt-2 space-y-1">
                    {apiResult.suggestions.slice(0, 5).map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-[12px]">
                        <span className="text-forest-900">{s.name || "Unknown"}</span>
                        {typeof s.probability === "number" ? <span className="text-ink-muted">{Math.round(s.probability * 100)}% confidence</span> : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-[12px] text-ink-muted">No specific diseases/pests returned.</p>
                )}
              </div>
            )}

            <div className="rounded-xl border border-line bg-paper p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted">Assessment (illustrative)</p>
                  <p className="mt-1 text-lg font-extrabold text-forest-950">
                    Risk: {riskAssessment.band} · {riskAssessment.score}/100
                  </p>
                  <p className="text-[12px] text-ink-muted">
                    {crop} · {stage} {captured ? "· Photo attached" : "· No photo"}
                  </p>
                </div>
                <Badge tone="citron">Sample</Badge>
              </div>
              <p className="mt-2 text-[13px] text-ink-muted">{riskAssessment.summary}</p>
            </div>

            <div className="rounded-xl border border-line">
              <button
                type="button"
                onClick={() => setShowFactors((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3"
                aria-expanded={showFactors}
              >
                <span className="text-sm font-bold text-forest-950">Risk factors</span>
                {showFactors ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showFactors ? (
                <div className="divide-y divide-line border-t border-line">
                  {riskAssessment.factors.map((f) => (
                    <div key={f.id} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-forest-950">{f.name}</p>
                        <span className="text-[11px] text-ink-muted">{f.contribution}/{f.weight}</span>
                      </div>
                      <p className="mt-1 text-[12px] text-ink-muted">{f.description}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-line">
              <button
                type="button"
                onClick={() => setShowSteps((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3"
                aria-expanded={showSteps}
              >
                <span className="text-sm font-bold text-forest-950">Recommended next steps</span>
                {showSteps ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showSteps ? (
                <div className="divide-y divide-line border-t border-line">
                  {riskAssessment.steps.map((s, i) => (
                    <div key={s.title} className="flex gap-3 px-4 py-3">
                      <span className="grid size-6 place-items-center rounded-full bg-forest-100 text-[11px] font-bold text-forest-800">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-forest-950">{s.title}</p>
                        <p className="text-[12px] text-ink-muted">{s.detail}</p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">
                          {s.timeframe}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-sun-500/20 bg-sun-100/60 px-3 py-2 text-[12px] text-sun-600">
              <AlertTriangle size={14} className="mt-0.5" aria-hidden="true" />
              <p>These are demo suggestions only, not agronomic advice. Verify with an extension officer.</p>
            </div>

            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setStep(2)} className="text-sm font-bold text-forest-700">
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  if (captured?.url.startsWith("blob:")) URL.revokeObjectURL(captured.url);
                  setCaptured(null);
                  setSymptoms("");
                  setApiResult(null);
                  setDemoMode(true);
                }}
                className="text-sm font-bold text-forest-700"
              >
                Start new scan
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[11px] text-ink-muted">
        <Info size={12} aria-hidden="true" />
        No image is uploaded in this demo. All processing is local to the interface.
      </p>
    </div>
  );
}
