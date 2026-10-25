import type { Metadata } from "next";
import { ScannerClient } from "@/components/scanner/scanner-client";

export const metadata: Metadata = {
  title: "Crop health scanner",
  description:
    "Guided image capture for crops with demo preview. No AI diagnosis is connected in this build.",
};

export default function ScannerPage() {
  return <ScannerClient />;
}
