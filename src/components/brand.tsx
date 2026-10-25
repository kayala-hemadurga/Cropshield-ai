import Link from "next/link";

type BrandProps = {
  variant?: "dark" | "light";
  withTagline?: boolean;
};

export function Brand({ variant = "dark", withTagline = false }: BrandProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      aria-label="CropShield AI home"
      className="group inline-flex items-center gap-2.5 rounded-lg"
    >
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:-rotate-3 ${
          isLight
            ? "bg-citron-300 text-forest-950"
            : "bg-forest-900 text-citron-300"
        }`}
      >
        <svg
          viewBox="0 0 32 32"
          className="size-6"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M16 2.6 27 6.7v7.7c0 7.1-4.5 11.9-11 15.1C9.5 26.3 5 21.5 5 14.4V6.7L16 2.6Z"
            fill="currentColor"
            opacity="0.22"
          />
          <path
            d="M16 2.6 27 6.7v7.7c0 7.1-4.5 11.9-11 15.1C9.5 26.3 5 21.5 5 14.4V6.7L16 2.6Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M16 9.4c-4.1 2.1-6.3 4.9-6.3 8.2 0 2.8 2 4.9 4.7 4.9 3.2 0 5.9-3.3 7.4-9.5-2.4.4-4.5 1.3-6.2 2.8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col">
        <span
          className={`text-[17px] font-extrabold leading-none tracking-[-0.02em] ${
            isLight ? "text-white" : "text-forest-950"
          }`}
        >
          CropShield<span className={isLight ? "text-citron-300" : "text-forest-600"}> AI</span>
        </span>
        {withTagline ? (
          <span
            className={`mt-1 text-[9px] font-bold uppercase tracking-[0.22em] ${
              isLight ? "text-forest-200/70" : "text-ink-muted"
            }`}
          >
            Predict. Protect. Prevent.
          </span>
        ) : null}
      </span>
    </Link>
  );
}
