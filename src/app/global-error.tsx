"use client";

import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const display = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full`}>
      <body className="flex min-h-full flex-col items-center justify-center bg-[#f7f8fa] px-4 text-center">
        <p className="text-xs font-semibold tracking-widest text-[#1a56db] uppercase">
          Critical error
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-jakarta)] text-2xl font-semibold tracking-tight text-[#111827]">
          SouqIQ could not load
        </h1>
        <p className="mt-2 max-w-md text-sm text-[#6b7280]">
          A critical error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-[11px] text-[#6b7280]">
            Ref: {error.digest}
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-lg bg-[#1a56db] px-4 py-2.5 text-sm font-medium text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
