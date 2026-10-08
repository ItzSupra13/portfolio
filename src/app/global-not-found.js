// app/global-not-found.tsx
"use client"
import "./globals.css"; // required: global-not-found bypasses the root layout, so styles aren't loaded otherwise
import Link from "next/link";
import { Ascii } from "ascii.rest/react";
import { notFound } from "ascii.rest/pieces";

export default function GlobalNotFound() {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground m-0 antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
          <Ascii
            piece={notFound}
            options={{
              code: "404",
              title: "Page Not Found",
              message: "the page you asked for never existed :(",
            }}
          />
          <Link
            href="/"
            className="rounded-lg border border-dashed border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            Back home
          </Link>
        </main>
      </body>
    </html>
  );
}