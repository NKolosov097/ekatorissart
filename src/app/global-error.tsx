"use client";

// Last-resort boundary: renders only when the root layout itself crashes,
// so it must provide its own <html>/<body> and styles (English-only — no
// i18n context can exist here).

import { useEffect } from "react";
import "./globals.css";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <main className="min-h-screen flex items-center justify-center">
          <section className="container-prose py-32 text-center">
            <div className="eyebrow">500</div>
            <h1 className="font-serif text-4xl md:text-5xl mt-3">
              A quiet hiccup.
            </h1>
            <p className="mt-6 text-muted">
              Something went wrong on our side. Please try again, or return to
              the homepage.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button type="button" onClick={reset} className="btn-primary">
                Try again
              </button>
              <a href="/" className="btn-outline">
                Back to the studio
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
