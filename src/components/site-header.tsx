"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { Brand } from "@/components/brand";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/scan-assess", label: "Scan & Assess" },
  { href: "/field-activity", label: "Field Activity" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Brand />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  isActive
                    ? "bg-forest-100 text-forest-900"
                    : "text-ink-muted hover:bg-forest-50 hover:text-forest-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/scan-assess"
            className="hidden items-center gap-2 rounded-full bg-forest-900 px-4 py-2.5 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-forest-800 sm:inline-flex"
          >
            Scan a crop
            <ArrowRight size={15} aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className="grid size-10 place-items-center rounded-xl border border-line bg-white text-forest-900 transition-colors hover:bg-forest-50 lg:hidden"
          >
            {open ? (
              <X size={19} aria-hidden="true" />
            ) : (
              <Menu size={19} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`border-t border-line bg-paper px-4 pb-5 pt-3 lg:hidden ${open ? "block" : "hidden"}`}
      >
        <nav aria-label="Mobile primary" className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold ${
                  isActive
                    ? "bg-forest-100 text-forest-900"
                    : "text-ink hover:bg-white"
                }`}
              >
                {item.label}
                <ArrowRight
                  size={16}
                  className="text-forest-500"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>
        <Link
          href="/scan-assess"
          onClick={() => setOpen(false)}
          className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-forest-900 px-4 py-3 text-sm font-bold text-white"
        >
          Scan a crop
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
