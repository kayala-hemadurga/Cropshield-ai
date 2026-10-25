import type { Metadata } from "next";
import { FieldReportsClient } from "@/components/field-reports/reports-client";

export const metadata: Metadata = {
  title: "Field reports",
  description:
    "Working field report form with validation and clearly labelled sample data. Saved locally in this demo.",
};

export default function FieldReportsPage() {
  return <FieldReportsClient />;
}
