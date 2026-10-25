import Link from "next/link";
import { ArrowLeft, FileWarning } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-forest-100 text-forest-700">
        <FileWarning size={24} aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-4xl font-semibold tracking-[-0.03em] text-forest-950">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-7 text-ink-muted">
        This page doesn&apos;t exist in the CropShield demo. Head back to the
        landing page or explore a working section.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-forest-800"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to home
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-bold text-forest-900 transition-colors hover:bg-forest-50"
        >
          Open dashboard
        </Link>
      </div>
    </div>
  );
}
