export type ThreatLevel = "high" | "moderate" | "watch";

export type CropField = {
  id: string;
  name: string;
  crop: string;
  variety: string;
  stage: string;
  area: string;
  health: number;
  trend: number;
  status: "Healthy" | "Needs attention" | "Monitor";
  lastScouted: string;
};

export type ThreatSignal = {
  id: string;
  title: string;
  crop: string;
  field: string;
  level: ThreatLevel;
  summary: string;
  updated: string;
};

export type RecentReport = {
  id: string;
  reporter: string;
  crop: string;
  field: string;
  issueType: string;
  severity: "Low" | "Moderate" | "High";
  date: string;
  description: string;
  status: "Pending review" | "Triaged" | "Closed";
  sample: boolean;
};

export type ThreatZone = {
  id: string;
  crop: string;
  threat: string;
  level: ThreatLevel;
  location: string;
  county: string;
  coords: [number, number];
  updated: string;
  reports: number;
  note: string;
};

export type RiskFactor = {
  id: string;
  name: string;
  weight: number;
  contribution: number;
  level: "Elevated" | "Moderate" | "Low";
  description: string;
  evidence: string;
};

export const farmProfile = {
  name: "Mwangaza Farm",
  farmer: "Wanjiku",
  location: "Nakuru County, Kenya",
  fields: 3,
  area: "4.3 ha",
  health: 78,
  trend: 6,
  openReports: 2,
  threatSignals: 3,
};

export const cropFields: CropField[] = [
  {
    id: "field-a",
    name: "Rift Valley Field A",
    crop: "Maize",
    variety: "DK 8031",
    stage: "Tasselling",
    area: "2.4 ha",
    health: 82,
    trend: 4,
    status: "Healthy",
    lastScouted: "Today",
  },
  {
    id: "field-b",
    name: "Karura Block B",
    crop: "Beans",
    variety: "Rosecoco",
    stage: "Flowering",
    area: "1.1 ha",
    health: 74,
    trend: -3,
    status: "Monitor",
    lastScouted: "Yesterday",
  },
  {
    id: "field-c",
    name: "Athi River Plot C",
    crop: "Tomato",
    variety: "Kilele F1",
    stage: "Fruiting",
    area: "0.8 ha",
    health: 68,
    trend: 1,
    status: "Needs attention",
    lastScouted: "2 days ago",
  },
];

export const healthTrend = [62, 66, 64, 70, 69, 73, 75, 78];
export const healthTrendLabels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

export const threatSignals: ThreatSignal[] = [
  {
    id: "signal-1",
    title: "Late blight watch",
    crop: "Tomato",
    field: "Athi River Plot C",
    level: "high",
    summary: "Cool, humid conditions in the sample snapshot favour blight development.",
    updated: "2 h ago",
  },
  {
    id: "signal-2",
    title: "Bean fly pressure",
    crop: "Beans",
    field: "Karura Block B",
    level: "moderate",
    summary: "Two demo reports mention yellowing and stem damage in nearby plots.",
    updated: "5 h ago",
  },
  {
    id: "signal-3",
    title: "Fall armyworm scouting",
    crop: "Maize",
    field: "Rift Valley Field A",
    level: "watch",
    summary: "Seasonal scouting reminder for whorl-stage maize in the area.",
    updated: "1 day ago",
  },
];

export const recentReports: RecentReport[] = [
  {
    id: "report-1",
    reporter: "Wanjiku Kamau",
    crop: "Tomato",
    field: "Athi River Plot C",
    issueType: "Disease",
    severity: "High",
    date: "2026-10-23",
    description:
      "Dark water-soaked patches on lower leaves after two days of rain. Affected plants are clustered near the eastern edge.",
    status: "Triaged",
    sample: true,
  },
  {
    id: "report-2",
    reporter: "Peter Otieno",
    crop: "Maize",
    field: "Rift Valley Field A",
    issueType: "Pest",
    severity: "Moderate",
    date: "2026-10-22",
    description:
      "Small ragged holes in younger leaves. Larvae not yet found, but fresh feeding damage is visible on about 10 plants.",
    status: "Pending review",
    sample: true,
  },
  {
    id: "report-3",
    reporter: "Grace Muthoni",
    crop: "Beans",
    field: "Karura Block B",
    issueType: "Pest",
    severity: "Moderate",
    date: "2026-10-21",
    description:
      "Yellowing leaves with thin stems near the fence line. Damage appears to be spreading slowly across the block.",
    status: "Pending review",
    sample: true,
  },
  {
    id: "report-4",
    reporter: "Wanjiku Kamau",
    crop: "Tomato",
    field: "Athi River Plot C",
    issueType: "Water / drainage",
    severity: "Low",
    date: "2026-10-19",
    description:
      "Standing water in the low corner of the plot after heavy rain. No wilting observed yet.",
    status: "Closed",
    sample: true,
  },
];

export const weatherSnapshot = {
  temperature: "24°C",
  condition: "Partly cloudy",
  humidity: "68%",
  rainfall: "2 mm / 24 h",
  wind: "9 km/h",
  observed: "Sample snapshot · not live",
};

export const threatZones: ThreatZone[] = [
  {
    id: "zone-1",
    crop: "Tomato",
    threat: "Late blight watch",
    level: "high",
    location: "Kiambu",
    county: "Kiambu County",
    coords: [-1.1714, 36.8356],
    updated: "2 h ago",
    reports: 4,
    note: "Cool, humid sample conditions. Verify symptoms in the field before acting.",
  },
  {
    id: "zone-2",
    crop: "Maize",
    threat: "Fall armyworm reports",
    level: "high",
    location: "Nakuru",
    county: "Nakuru County",
    coords: [-0.3031, 36.08],
    updated: "6 h ago",
    reports: 3,
    note: "Clustered demo reports from three scouting notes in the same ward.",
  },
  {
    id: "zone-3",
    crop: "Wheat",
    threat: "Leaf rust watch",
    level: "moderate",
    location: "Eldoret",
    county: "Uasin Gishu County",
    coords: [0.5143, 35.2698],
    updated: "1 day ago",
    reports: 2,
    note: "Illustrative disease-conducive weather window for the demo.",
  },
  {
    id: "zone-4",
    crop: "Potato",
    threat: "Late blight watch",
    level: "moderate",
    location: "Meru",
    county: "Meru County",
    coords: [0.0463, 37.6559],
    updated: "1 day ago",
    reports: 2,
    note: "Demo field report describes dark lesions after rainfall.",
  },
  {
    id: "zone-5",
    crop: "Maize",
    threat: "Maize streak monitoring",
    level: "watch",
    location: "Kitale",
    county: "Trans Nzoia County",
    coords: [1.0157, 35.0062],
    updated: "2 days ago",
    reports: 1,
    note: "Single sample report. Monitoring only — no outbreak conclusion.",
  },
  {
    id: "zone-6",
    crop: "Beans",
    threat: "Bean fly pressure",
    level: "watch",
    location: "Machakos",
    county: "Machakos County",
    coords: [-1.5177, 37.2634],
    updated: "3 days ago",
    reports: 2,
    note: "Two demo reports of yellowing; cause not confirmed.",
  },
];

export const riskAssessment = {
  score: 72,
  band: "Elevated",
  field: "Athi River Plot C",
  crop: "Tomato",
  variety: "Kilele F1",
  stage: "Fruiting",
  assessed: "Sample assessment · 23 Oct 2026, 08:40",
  summary:
    "The demo field profile combines a susceptible growth stage, humid sample conditions and two nearby reports. The score is illustrative and has not been produced by a trained model.",
  factors: [
    {
      id: "factor-weather",
      name: "Weather suitability",
      weight: 28,
      contribution: 22,
      level: "Elevated",
      description: "Humidity and recent rainfall in the sample snapshot favour foliar disease.",
      evidence: "68% humidity · 2 mm rain · sample snapshot",
    },
    {
      id: "factor-stage",
      name: "Crop & growth stage",
      weight: 22,
      contribution: 16,
      level: "Moderate",
      description: "Fruiting tomatoes are a sensitive stage for blight and fruit damage.",
      evidence: "Tomato · Kilele F1 · Fruiting",
    },
    {
      id: "factor-reports",
      name: "Nearby field reports",
      weight: 20,
      contribution: 16,
      level: "Elevated",
      description: "Two demo reports from adjacent plots describe similar leaf symptoms.",
      evidence: "2 sample reports within 5 km",
    },
    {
      id: "factor-history",
      name: "Field history",
      weight: 15,
      contribution: 10,
      level: "Moderate",
      description: "The demo field record shows a previous late-blight note last season.",
      evidence: "1 prior note · sample record",
    },
    {
      id: "factor-scouting",
      name: "Scouting coverage",
      weight: 15,
      contribution: 8,
      level: "Elevated",
      description: "The field has not been scouted since the last rain event.",
      evidence: "Last sample scouting: 2 days ago",
    },
  ] satisfies RiskFactor[],
  steps: [
    {
      title: "Scout 20 plants across 5 points",
      detail:
        "Check upper and lower leaf surfaces for water-soaked patches, grey mould or wilting. Record what you see with photos.",
      timeframe: "Today",
      priority: "high",
    },
    {
      title: "Photograph and submit a field report",
      detail:
        "Capture close-ups in daylight, note the location in the field, and submit the report so a field officer can review it.",
      timeframe: "Today",
      priority: "high",
    },
    {
      title: "Improve airflow and reduce leaf wetness",
      detail:
        "Review plant spacing, remove heavily affected lower leaves away from the field, and avoid overhead irrigation late in the day.",
      timeframe: "Within 24–48 hours",
      priority: "moderate",
    },
    {
      title: "Re-check and update the report",
      detail:
        "Return to the same 20 plants in 48 hours. If symptoms have spread, escalate the report and contact an extension officer.",
      timeframe: "In 48 hours",
      priority: "moderate",
    },
  ],
};

export const cropOptions = [
  "Maize",
  "Beans",
  "Tomato",
  "Potato",
  "Kale",
  "Sorghum",
  "Wheat",
  "Rice",
  "Other",
];

export const growthStageOptions = [
  "Seedling",
  "Vegetative",
  "Flowering",
  "Fruiting / grain fill",
  "Maturity",
  "Not sure",
];

export const issueTypeOptions = [
  "Disease",
  "Pest",
  "Water / drainage",
  "Nutrient / soil",
  "Weather damage",
  "Other",
];
