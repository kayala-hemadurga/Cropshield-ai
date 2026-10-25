"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CircleMarker, LayerGroup, Map as LeafletMap } from "leaflet";
import {
  Filter,
  Layers,
  List,
  MapPin,
  Plus,
  Minus,
  Navigation,
} from "lucide-react";
import { Badge, DemoNote, SampleTag, ThreatBadge } from "@/components/ui";
import { threatZones, type ThreatLevel } from "@/lib/demo-data";

const levelColors: Record<ThreatLevel, string> = {
  high: "#c25a22",
  moderate: "#b7791f",
  watch: "#2f6842",
};

const filters: { id: ThreatLevel | "all"; label: string }[] = [
  { id: "all", label: "All demo signals" },
  { id: "high", label: "High" },
  { id: "moderate", label: "Moderate" },
  { id: "watch", label: "Watch" },
];

type LeafletGlobal = typeof import("leaflet");

export function ThreatMapClient() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<LeafletGlobal | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const layerGroupRef = useRef<LayerGroup | null>(null);
  const markersRef = useRef<Record<string, CircleMarker>>({});
  const [activeFilter, setActiveFilter] = useState<ThreatLevel | "all">("all");
  const [selectedId, setSelectedId] = useState<string>(threatZones[0].id);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredZones = useMemo(
    () =>
      threatZones.filter(
        (zone) => activeFilter === "all" || zone.level === activeFilter,
      ),
    [activeFilter],
  );

  const handleFilterChange = (filter: ThreatLevel | "all") => {
    setActiveFilter(filter);
    const nextZones =
      filter === "all"
        ? threatZones
        : threatZones.filter((zone) => zone.level === filter);

    if (
      nextZones.length > 0 &&
      !nextZones.some((zone) => zone.id === selectedId)
    ) {
      setSelectedId(nextZones[0].id);
    }
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let mounted = true;

    const init = async () => {
      try {
        const L = await import("leaflet");
        if (!mounted || !mapRef.current) return;

        leafletRef.current = L;

        const map = L.map(mapRef.current, {
          center: [-0.0236, 37.9062],
          zoom: 6,
          zoomControl: false,
          attributionControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 18,
        }).addTo(map);

        L.control.zoom({ position: "topright" }).addTo(map);

        const layerGroup = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
        layerGroupRef.current = layerGroup;

        setReady(true);
      } catch (err) {
        console.error(err);
        if (mounted) {
          setError(
            "Map failed to load. Leaflet assets are present, but the browser could not initialize the map shell.",
          );
        }
      }
    };

    init();

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      layerGroupRef.current = null;
    };
  }, []);

  // Create markers only when the filtered set changes. Selection is handled
  // separately so clicking a marker does not rebuild the layer and close its popup.
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = leafletRef.current;
    const layerGroup = layerGroupRef.current;

    if (!ready || !map || !L || !layerGroup) return;

    layerGroup.clearLayers();
    markersRef.current = {};

    filteredZones.forEach((zone) => {
      const marker = L.circleMarker(zone.coords, {
        radius: 7,
        color: "#ffffff",
        weight: 2,
        fillColor: levelColors[zone.level],
        fillOpacity: 0.95,
      });

      marker.bindPopup(
        `<div style="font-family: Manrope, sans-serif;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #5b6b61;">Demo signal</div>
          <div style="margin-top: 4px; font-weight: 800; font-size: 14px; color: #14231b;">${zone.threat}</div>
          <div style="margin-top: 2px; font-size: 12px; color: #5b6b61;">${zone.crop} · ${zone.location}, ${zone.county}</div>
          <div style="margin-top: 6px; font-size: 11px; color: #5b6b61;">Updated ${zone.updated} · ${zone.reports} sample reports</div>
        </div>`,
        { maxWidth: 240 },
      );

      marker.on("click", () => {
        setSelectedId(zone.id);
      });

      marker.addTo(layerGroup);
      markersRef.current[zone.id] = marker;
    });
  }, [filteredZones, ready]);

  // Highlight the selected marker and pan to it without closing open popups.
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!ready || !map) return;

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      marker.setStyle({ radius: id === selectedId ? 9 : 7 });
    });

    const selected = threatZones.find((zone) => zone.id === selectedId);
    if (selected) {
      map.flyTo(selected.coords, 8, { duration: 0.8 });
    }
  }, [selectedId, ready]);

  const selected = threatZones.find((zone) => zone.id === selectedId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="forest">
              <MapPin size={12} aria-hidden="true" />
              Crop threat map
            </Badge>
            <SampleTag label="Illustrative demo data" />
          </div>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold leading-[1.01] tracking-[-0.038em] text-forest-950">
            Nearby signals, clearly labelled.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-ink-muted">
            A Leaflet and OpenStreetMap shell with filterable demo threat
            zones. Markers and popups show context, but no live outbreak
            detection or prediction is connected.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <DemoNote title="Map prepared for integration">
          Base map tiles come from OpenStreetMap when online. All threat
          markers, counts and notes are static sample data. Clustered
          outbreaks and automated alerts are not active in this build.
        </DemoNote>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Map */}
        <section className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
          <header className="flex flex-col gap-4 border-b border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                Interactive map
              </p>
              <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em] text-forest-950">
                Demo threat zones
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-ink-muted">
                <Filter size={13} aria-hidden="true" />
                Filter by level
              </div>
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => handleFilterChange(filter.id)}
                  aria-pressed={activeFilter === filter.id}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${
                    activeFilter === filter.id
                      ? "bg-forest-900 text-white"
                      : "border border-line bg-white text-ink-muted hover:text-forest-900"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </header>

          <div className="relative">
            <div ref={mapRef} className="h-[520px] w-full" />
            {!ready && !error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-paper-deep/60">
                <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-ink-muted shadow-card">
                  <div className="size-2 animate-pulse rounded-full bg-forest-500" />
                  Loading Leaflet map shell...
                </div>
              </div>
            ) : null}
            {error ? (
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-clay-500/20 bg-white/95 p-4 text-sm text-clay-600 shadow-card">
                {error}
              </div>
            ) : null}

            <div className="pointer-events-none absolute left-4 top-4 hidden flex-col gap-1.5 sm:flex">
              <div className="rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold text-ink-muted shadow-card backdrop-blur">
                Center: Kenya · Zoom {ready ? "6+" : "—"}
              </div>
              <div className="rounded-full bg-forest-950/90 px-3 py-1.5 text-[10px] font-bold text-citron-300 shadow-card backdrop-blur">
                Tiles: OpenStreetMap
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-4 left-4 hidden items-center gap-3 rounded-full bg-white/95 px-3.5 py-2 text-[10px] font-semibold text-ink-muted shadow-card backdrop-blur sm:flex">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-clay-500" />
                High
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-sun-500" />
                Moderate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-forest-500" />
                Watch
              </span>
            </div>
          </div>
        </section>

        {/* Side panel */}
        <div className="space-y-6">
          <section className="rounded-3xl border border-line bg-white shadow-card">
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                  Demo alerts
                </p>
                <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em] text-forest-950">
                  {filteredZones.length} signals
                </h2>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[10px] font-bold text-ink-muted">
                <List size={12} aria-hidden="true" />
                Click a row or marker
              </div>
            </header>
            <div className="max-h-[520px] divide-y divide-line overflow-y-auto">
              {filteredZones.map((zone) => {
                const isSelected = zone.id === selectedId;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedId(zone.id)}
                    className={`flex w-full flex-col gap-2 px-6 py-4 text-left transition-colors ${
                      isSelected ? "bg-forest-50" : "hover:bg-paper"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="mt-0.5 size-2.5 rounded-full"
                          style={{ backgroundColor: levelColors[zone.level] }}
                          aria-hidden="true"
                        />
                        <div>
                          <p className="font-bold text-forest-950">
                            {zone.threat}
                          </p>
                          <p className="text-[12px] text-ink-muted">
                            {zone.crop} · {zone.location}
                          </p>
                        </div>
                      </div>
                      <ThreatBadge level={zone.level} />
                    </div>
                    <p className="text-[12px] leading-5 text-ink-muted">
                      {zone.note}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">
                      <span>
                        {zone.county} · {zone.reports} sample reports
                      </span>
                      <span>Updated {zone.updated}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {selected ? (
            <section className="rounded-3xl border border-line bg-forest-950 p-6 text-white shadow-lift">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-300">
                    Selected signal
                  </p>
                  <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.01em]">
                    {selected.threat}
                  </h2>
                  <p className="text-[12px] text-forest-200/75">
                    {selected.crop} · {selected.location}, {selected.county}
                  </p>
                </div>
                <ThreatBadge level={selected.level} />
              </div>
              <p className="mt-4 text-[13px] leading-6 text-forest-200/80">
                {selected.note}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-forest-900/70 p-3.5">
                  <div className="flex items-center gap-2 text-forest-300">
                    <Navigation size={14} aria-hidden="true" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em]">
                      Location
                    </p>
                  </div>
                  <p className="mt-1.5 text-sm font-bold">
                    {selected.location}
                  </p>
                </div>
                <div className="rounded-2xl bg-forest-900/70 p-3.5">
                  <div className="flex items-center gap-2 text-forest-300">
                    <Layers size={14} aria-hidden="true" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em]">
                      Sample reports
                    </p>
                  </div>
                  <p className="mt-1.5 text-sm font-bold">
                    {selected.reports}
                  </p>
                </div>
              </div>
              <p className="mt-4 flex items-center gap-2 text-[11px] text-forest-300/80">
                <Plus size={13} aria-hidden="true" />
                <Minus size={13} aria-hidden="true" />
                Use map controls top-right to zoom in for more detail.
              </p>
            </section>
          ) : null}

          <section className="rounded-3xl border border-line bg-white p-6 shadow-card">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-forest-100 text-forest-700">
                <List size={16} aria-hidden="true" />
              </span>
              <h2 className="text-[15px] font-extrabold text-forest-950">
                Integration notes
              </h2>
            </div>
            <ul className="mt-3 space-y-2 text-[13px] leading-5 text-ink-muted">
              <li>Replace demo markers with a real threat feed or alerts API.</li>
              <li>Cluster markers and add time filtering when data is live.</li>
              <li>Respect tile usage policy and consider offline caching.</li>
              <li>Keep attribution visible (already shown).</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
