import type { Metadata } from "next";
import { ThreatMapClient } from "@/components/threat-map/threat-map-client";

export const metadata: Metadata = {
  title: "Crop threat map",
  description:
    "Leaflet and OpenStreetMap demo with filterable threat zones. Illustrative data only.",
};

export default function ThreatMapPage() {
  return <ThreatMapClient />;
}
