import Link from "next/link";
import { Brand } from "@/components/brand";

const productLinks = [
  { href: "/dashboard", label: "Farmer dashboard" },
  { href: "/scanner", label: "Crop health scanner" },
  { href: "/threat-map", label: "Crop threat map" },
  { href: "/risk-assessment", label: "Risk assessment" },
  { href: "/field-reports", label: "Field reports" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-forest-950 text-forest-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Brand variant="light" withTagline />
            <p className="mt-5 text-sm leading-6 text-forest-200/75">
              A farmer-first threat monitoring workspace, designed for clearer
              decisions in the field. Built as a hackathon demonstration with
              sample data.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-forest-800 bg-forest-900/70 px-3 py-1.5 text-[11px] font-semibold text-citron-200">
              <span className="size-1.5 rounded-full bg-citron-400" aria-hidden="true" />
              Demo build · not a production service
            </p>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-300">
              Explore the demo
            </h2>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-forest-200/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-300">
              Scope &amp; honesty
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-forest-200/75">
              <li>All farm, field and threat data is illustrative.</li>
              <li>No AI diagnosis, live weather or outbreak prediction is active.</li>
              <li>Map tiles are served by OpenStreetMap when online.</li>
              <li>Field reports stay in this browser only.</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-forest-800/80 pt-6 text-xs text-forest-300/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 CropShield AI. Hackathon prototype.</p>
          <p>Predict. Protect. Prevent.</p>
        </div>
      </div>
    </footer>
  );
}
