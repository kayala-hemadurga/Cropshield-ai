"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CircleMarker, LayerGroup, Map as LeafletMap } from "leaflet";
import {
  CheckCircle2,
  ClipboardList,
  Filter,
  Layers,
  MapPin,
  Plus,
} from "lucide-react";
import { Badge, DemoNote, SampleTag, ThreatBadge } from "@/components/ui";
import {
  cropOptions,
  issueTypeOptions,
  recentReports,
  threatZones,
  type RecentReport,
  type ThreatLevel,
} from "@/lib/demo-data";

const levelColors: Record<ThreatLevel, string> = {
  high: "#c25a22",
  moderate: "#b7791f",
  watch: "#2f6842",
};

type LeafletGlobal = typeof import("leaflet");

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
  field: string;
  crop: string;
  issueType: string;
  severity: string;
  date: string;
  description: string;
};

const initialForm: FormState = {
  reporter: "",
  field: "",
  crop: "Tomato",
  issueType: "Disease",
  severity: "Moderate",
  date: new Date().toISOString().slice(0, 10),
  description: "",
};

export default function FieldActivityPage() {
  // Map
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<LeafletGlobal | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const layerGroupRef = useRef<LayerGroup | null>(null);
  const markersRef = useRef<Record<string, CircleMarker>>({});
  const [mapFilter, setMapFilter] = useState<ThreatLevel | "all">("all");
  const [selectedZoneId, setSelectedZoneId] = useState<string>(threatZones[0].id);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const filteredZones = useMemo(
    () => threatZones.filter((z) => mapFilter === "all" || z.level === mapFilter),
    [mapFilter],
  );

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    let mounted = true;
    const init = async () => {
      try {
        const L = await import("leaflet");
        if (!mounted || !mapRef.current) return;
        leafletRef.current = L;
        const map = L.map(mapRef.current, { center: [-0.0236, 37.9062], zoom: 6, zoomControl: false, attributionControl: true });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors", maxZoom: 18 }).addTo(map);
        L.control.zoom({ position: "topright" }).addTo(map);
        const layerGroup = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
        layerGroupRef.current = layerGroup;
        setMapReady(true);
      } catch (e) {
        console.error(e);
        if (mounted) setMapError("Map failed to load.");
      }
    };
    init();
    return () => {
      mounted = false;
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
      layerGroupRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = leafletRef.current;
    const layerGroup = layerGroupRef.current;
    if (!mapReady || !map || !L || !layerGroup) return;
    layerGroup.clearLayers();
    markersRef.current = {};
    filteredZones.forEach((zone) => {
      const marker = L.circleMarker(zone.coords, { radius: 7, color: "#ffffff", weight: 2, fillColor: levelColors[zone.level], fillOpacity: 0.95 });
      marker.bindPopup(`<div style="font-family:Manrope,sans-serif"><div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#5b6b61">Demo signal</div><div style="margin-top:4px;font-weight:800;font-size:14px;color:#14231b">${zone.threat}</div><div style="margin-top:2px;font-size:12px;color:#5b6b61">${zone.crop} · ${zone.location}</div></div>`, { maxWidth: 220 });
      marker.on("click", () => setSelectedZoneId(zone.id));
      marker.addTo(layerGroup);
      markersRef.current[zone.id] = marker;
    });
  }, [filteredZones, mapReady]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!mapReady || !map) return;
    Object.entries(markersRef.current).forEach(([id, marker]) => marker.setStyle({ radius: id === selectedZoneId ? 9 : 7 }));
    const selected = threatZones.find((z) => z.id === selectedZoneId);
    if (selected) map.flyTo(selected.coords, 7, { duration: 0.6 });
  }, [selectedZoneId, mapReady]);

  const selectedZone = threatZones.find((z) => z.id === selectedZoneId);

  // Reports
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [reports, setReports] = useState<RecentReport[]>(recentReports);
  const [reportFilter, setReportFilter] = useState<"All" | "Disease" | "Pest" | "Other">("All");
  const [storageNotice, setStorageNotice] = useState(false);
  const skipNextSaveRef = useRef(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cropshield-field-reports");
      if (stored) {
        const parsed = JSON.parse(stored) as RecentReport[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setReports([...parsed, ...recentReports]);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (skipNextSaveRef.current) { skipNextSaveRef.current = false; return; }
    try {
      const savedOnly = reports.filter((r) => !r.sample);
      localStorage.setItem("cropshield-field-reports", JSON.stringify(savedOnly));
    } catch {}
  }, [reports]);

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.reporter.trim()) next.reporter = "Enter a name.";
    if (!form.field.trim()) next.field = "Enter the field or location.";
    if (!form.date) next.date = "Select the date observed.";
    if (form.description.trim().length < 15) next.description = "Add a short description (at least 15 characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
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
    setReports((cur) => [newReport, ...cur]);
    setForm({ ...initialForm, date: new Date().toISOString().slice(0, 10) });
    setErrors({});
    setStorageNotice(true);
    setTimeout(() => setStorageNotice(false), 6000);
  };

  const filteredReports = reports.filter((r) => {
    if (reportFilter === "All") return true;
    if (reportFilter === "Other") return !["Disease", "Pest"].includes(r.issueType);
    return r.issueType === reportFilter;
  });

  const reportChips = [
    { id: "All" as const, label: "All" },
    { id: "Disease" as const, label: "Disease" },
    { id: "Pest" as const, label: "Pest" },
    { id: "Other" as const, label: "Other" },
  ];

  const mapChips = [
    { id: "all" as const, label: "All" },
    { id: "high" as const, label: "High" },
    { id: "moderate" as const, label: "Moderate" },
    { id: "watch" as const, label: "Watch" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge tone="forest"><Layers size={12} aria-hidden="true" />Field Activity</Badge>
          <SampleTag label="Threat map + reports" />
        </div>
        <h1 className="font-display text-[clamp(2rem,4.2vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-forest-950">Threat map & field reports</h1>
        <p className="text-[14px] text-ink-muted">Filters and clear status labels. No live data connected.</p>
      </div>

      <div className="mt-6"><DemoNote title="Demo scope">All map markers, risk levels, and reports are sample data. No AI diagnosis, live weather, or real outbreak prediction is connected.</DemoNote></div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <header className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2"><MapPin size={16} className="text-forest-600" aria-hidden="true" /><h2 className="text-[15px] font-extrabold text-forest-950">Threat map (demo)</h2></div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-muted"><Filter size={12} aria-hidden="true" />Filter</span>
            {mapChips.map((c) => (
              <button key={c.id} type="button" onClick={() => setMapFilter(c.id)} aria-pressed={mapFilter === c.id} className={`rounded-full px-3 py-1 text-[11px] font-bold ${mapFilter === c.id ? "bg-forest-900 text-white" : "border border-line bg-white text-ink-muted"}`}>{c.label}</button>
            ))}
          </div>
        </header>
        <div className="grid gap-4 p-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="relative overflow-hidden rounded-xl border border-line">
            <div ref={mapRef} className="h-[420px] w-full" />
            {!mapReady && !mapError ? <div className="absolute inset-0 flex items-center justify-center bg-paper-deep/60"><span className="text-[12px] text-ink-muted">Loading map...</span></div> : null}
            {mapError ? <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white/95 px-3 py-2 text-[12px] text-clay-600">{mapError}</div> : null}
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-line">
              <header className="flex items-center justify-between border-b border-line px-4 py-2"><span className="text-sm font-bold text-forest-950">Signals ({filteredZones.length})</span><span className="text-[11px] text-ink-muted">Click to select</span></header>
              <div className="max-h-[380px] divide-y divide-line overflow-y-auto">
                {filteredZones.map((z) => (
                  <button key={z.id} type="button" onClick={() => setSelectedZoneId(z.id)} className={`flex w-full flex-col gap-1 px-4 py-2 text-left ${z.id === selectedZoneId ? "bg-forest-50" : ""}`}>
                    <div className="flex items-center justify-between"><p className="font-semibold text-forest-950">{z.threat}</p><ThreatBadge level={z.level} /></div>
                    <p className="text-[12px] text-ink-muted">{z.crop} · {z.location}</p>
                  </button>
                ))}
              </div>
            </div>
            {selectedZone ? (
              <div className="rounded-xl border border-line bg-forest-950 p-4 text-white">
                <div className="flex items-center justify-between"><p className="font-bold">{selectedZone.threat}</p><ThreatBadge level={selectedZone.level} /></div>
                <p className="mt-1 text-[12px] text-forest-200/80">{selectedZone.crop} · {selectedZone.location}, {selectedZone.county}</p>
                <p className="mt-2 text-[12px] leading-5 text-forest-200/80">{selectedZone.note}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-forest-300">Sample data · {selectedZone.reports} sample reports · Updated {selectedZone.updated}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-white shadow-card">
        <header className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2"><ClipboardList size={16} className="text-forest-600" aria-hidden="true" /><h2 className="text-[15px] font-extrabold text-forest-950">Field reports</h2></div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-muted"><Filter size={12} aria-hidden="true" />Filter</span>
            {reportChips.map((c) => (
              <button key={c.id} type="button" onClick={() => setReportFilter(c.id)} aria-pressed={reportFilter === c.id} className={`rounded-full px-3 py-1 text-[11px] font-bold ${reportFilter === c.id ? "bg-forest-900 text-white" : "border border-line bg-white text-ink-muted"}`}>{c.label}</button>
            ))}
          </div>
        </header>
        {storageNotice ? <div className="mx-5 mt-4 flex items-start gap-2 rounded-xl border border-forest-200 bg-forest-50 px-3 py-2 text-[12px] text-forest-900"><CheckCircle2 size={14} className="mt-0.5" aria-hidden="true" /><p>Report saved locally with Pending review status.</p></div> : null}
        <div className="grid gap-4 p-4 lg:grid-cols-[1.05fr_0.95fr]">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 rounded-xl border border-line p-4">
            <p className="text-sm font-bold text-forest-950">New report</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1"><span className="text-[12px] font-bold text-forest-950">Reporter *</span><input value={form.reporter} onChange={(e) => setForm({ ...form, reporter: e.target.value })} className={`h-10 rounded-lg border px-2 text-sm ${errors.reporter ? "border-clay-500" : "border-line"}`} />{errors.reporter ? <span className="text-[11px] text-clay-600" data-error="true">{errors.reporter}</span> : null}</label>
              <label className="flex flex-col gap-1"><span className="text-[12px] font-bold text-forest-950">Field/location *</span><input value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} className={`h-10 rounded-lg border px-2 text-sm ${errors.field ? "border-clay-500" : "border-line"}`} />{errors.field ? <span className="text-[11px] text-clay-600" data-error="true">{errors.field}</span> : null}</label>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1"><span className="text-[12px] font-bold text-forest-950">Crop</span><select value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} className="h-10 rounded-lg border border-line px-2 text-sm">{cropOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>
              <label className="flex flex-col gap-1"><span className="text-[12px] font-bold text-forest-950">Issue</span><select value={form.issueType} onChange={(e) => setForm({ ...form, issueType: e.target.value })} className="h-10 rounded-lg border border-line px-2 text-sm">{issueTypeOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>
              <label className="flex flex-col gap-1"><span className="text-[12px] font-bold text-forest-950">Severity</span><select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} className="h-10 rounded-lg border border-line px-2 text-sm"><option value="Low">Low</option><option value="Moderate">Moderate</option><option value="High">High</option></select></label>
            </div>
            <label className="flex flex-col gap-1"><span className="text-[12px] font-bold text-forest-950">Date observed *</span><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={`h-10 rounded-lg border px-2 text-sm ${errors.date ? "border-clay-500" : "border-line"}`} />{errors.date ? <span className="text-[11px] text-clay-600" data-error="true">{errors.date}</span> : null}</label>
            <label className="flex flex-col gap-1"><span className="text-[12px] font-bold text-forest-950">Description *</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`rounded-lg border px-2 py-1 text-sm ${errors.description ? "border-clay-500" : "border-line"}`} placeholder="Symptoms, location details..." />{errors.description ? <span className="text-[11px] text-clay-600" data-error="true">{errors.description}</span> : null}</label>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-900 px-4 py-2 text-sm font-bold text-white"><Plus size={14} aria-hidden="true" />Submit report</button>
          </form>
          <div className="divide-y divide-line rounded-xl border border-line">
            {filteredReports.slice(0, 6).map((r) => (
              <article key={r.id} className="flex flex-col gap-2 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-forest-950">{r.issueType} · {r.crop}</p>
                  <div className="flex items-center gap-2">
                    {r.sample ? <SampleTag /> : <Badge tone="citron">Saved</Badge>}
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${severityStyles[r.severity]}`}>{r.severity}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[12px] text-ink-muted">{r.field} · {r.date}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${statusStyles[r.status]}`}>{r.status}</span>
                </div>
                <p className="line-clamp-2 text-[12px] leading-5 text-ink-muted">{r.description}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="border-t border-line px-5 py-2 text-center text-[11px] text-ink-muted">Reports saved locally. Status labels shown clearly.</div>
      </section>
    </div>
  );
}
