"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

interface Props {
  images: string[];
  alt: string;
  primarySizes?: string;
  primaryPriority?: boolean;
}

// Clickable thumbnail strip + a full-resolution overlay viewer.
// The overlay supports 1× (fit) and 2× (zoom) modes; in zoom mode the
// image is pannable on touch/scroll because it overflows the container.
export function ArtworkLightbox({ images, alt, primarySizes, primaryPriority }: Props) {
  const t = useTranslations("artwork");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const open = useCallback((i: number) => {
    setOpenIndex(i);
    setZoomed(false);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    setZoomed(false);
  }, []);

  const next = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
    setZoomed(false);
  }, [images.length]);

  const prev = useCallback(() => {
    setOpenIndex((i) =>
      i === null ? null : (i - 1 + images.length) % images.length,
    );
    setZoomed(false);
  }, [images.length]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, next, prev]);

  if (images.length === 0) return null;
  const [primary, ...rest] = images;

  return (
    <>
      <button
        type="button"
        onClick={() => open(0)}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-line group cursor-zoom-in"
        aria-label={t("view_full_resolution")}
      >
        <Image
          src={primary}
          alt={alt}
          fill
          sizes={primarySizes ?? "(min-width: 768px) 50vw, 100vw"}
          className="object-cover transition duration-700 group-hover:scale-[1.01]"
          priority={primaryPriority}
        />
        <span className="pointer-events-none absolute end-3 bottom-3 bg-ink/80 text-bone px-2.5 py-1 text-[10px] uppercase tracking-widest opacity-0 transition group-hover:opacity-100">
          {t("view_full_resolution")}
        </span>
      </button>

      {rest.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {rest.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => open(i + 1)}
              className="relative aspect-square overflow-hidden bg-line cursor-zoom-in"
              aria-label={`${alt} ${i + 2}`}
            >
              <Image src={src} alt={`${alt} ${i + 2}`} fill className="object-cover" sizes="200px" />
            </button>
          ))}
        </div>
      )}

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center"
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label={t("close_viewer")}
            className="absolute top-4 end-4 z-10 text-bone/80 hover:text-bone bg-ink/60 border border-bone/20 rounded-full w-10 h-10 flex items-center justify-center text-xl"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous"
                className="absolute start-4 top-1/2 -translate-y-1/2 z-10 text-bone/80 hover:text-bone bg-ink/60 border border-bone/20 rounded-full w-10 h-10 flex items-center justify-center text-xl"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next"
                className="absolute end-4 top-1/2 -translate-y-1/2 z-10 text-bone/80 hover:text-bone bg-ink/60 border border-bone/20 rounded-full w-10 h-10 flex items-center justify-center text-xl"
              >
                ›
              </button>
            </>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoomed((z) => !z);
            }}
            aria-label={zoomed ? t("zoom_out") : t("zoom_in")}
            className="absolute bottom-4 end-4 z-10 text-bone/80 hover:text-bone bg-ink/60 border border-bone/20 rounded-full px-4 h-10 flex items-center text-xs uppercase tracking-widest"
          >
            {zoomed ? t("zoom_out") : t("zoom_in")}
          </button>

          <div
            className={`relative ${zoomed ? "h-full w-full overflow-auto" : "max-h-[92vh] max-w-[94vw]"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Use a plain <img> so we can serve the source at its native
                resolution without Next.js downscaling. The whole point of
                "full resolution" is to bypass the optimizer. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[openIndex]}
              alt={alt}
              className={
                zoomed
                  ? "max-w-none cursor-zoom-out"
                  : "max-h-[92vh] max-w-[94vw] object-contain cursor-zoom-in"
              }
              onClick={(e) => {
                e.stopPropagation();
                setZoomed((z) => !z);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
