import type { Metadata } from "next";
import Link from "next/link";
import { Monogram } from "@/components/shared/Monogram";

export const metadata: Metadata = {
  title: "Page not found — Prathmesh More",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main
      data-mode="recruiter"
      className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-bg px-6 text-center text-fg"
    >
      <Monogram className="size-12" />
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs tracking-[0.16em] text-subtle uppercase">Error 404</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          This page <em className="font-serif font-normal italic">doesn&rsquo;t exist.</em>
        </h1>
        <p className="mx-auto max-w-md text-muted">The link may be broken or the page may have moved.</p>
      </div>
      <nav aria-label="Go to" className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/?viewer=recruiter"
          className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-[0.9375rem] font-medium text-primary-fg transition-colors hover:bg-primary-hover"
        >
          Recruiter view
        </Link>
        <Link
          href="/?viewer=freelance"
          className="inline-flex h-11 items-center rounded-full border border-line-strong bg-surface px-5 text-[0.9375rem] font-medium transition-colors hover:bg-surface-2"
        >
          Freelance view
        </Link>
      </nav>
    </main>
  );
}
