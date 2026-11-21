"use client";

import { useEffect } from "react";

/** Route-level error boundary — never shows stack traces or internal details to visitors. */
export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface for debugging in the browser console only (digest is an opaque id).
    console.error("Unexpected portfolio error", error.digest ?? "");
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-bg px-6 text-center text-fg">
      <p className="font-mono text-xs tracking-[0.16em] text-subtle uppercase">Something went wrong</p>
      <h1 className="max-w-lg text-3xl font-semibold tracking-tight">This page hit an unexpected problem.</h1>
      <p className="max-w-md text-muted">Please try again. If it keeps happening, you can still reach me by email.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center rounded-full bg-primary px-5 font-medium text-primary-fg transition-colors hover:bg-primary-hover"
        >
          Try again
        </button>
        <a
          href="mailto:prathmeshmore655@gmail.com"
          className="inline-flex h-11 items-center rounded-full border border-line-strong bg-surface px-5 font-medium transition-colors hover:bg-surface-2"
        >
          Email me
        </a>
      </div>
    </main>
  );
}
