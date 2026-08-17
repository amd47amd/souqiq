"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryImage = {
  id: string;
  url: string;
  alt: string | null;
};

export function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const active = images[activeIndex] ?? images[0];
  const hasMultiple = images.length > 1;

  const goTo = useCallback(
    (index: number) => {
      if (!images.length) return;
      const next = (index + images.length) % images.length;
      setActiveIndex(next);
    },
    [images.length],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft" && hasMultiple) goPrev();
      if (event.key === "ArrowRight" && hasMultiple) goNext();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, hasMultiple, goPrev, goNext]);

  if (!images.length) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-[1.25rem] bg-[#eef0f4] text-muted-foreground">
        No image available
      </div>
    );
  }

  return (
    <>
      <div className="lg:sticky lg:top-24">
        <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
          <div className="relative min-w-0 flex-1">
            <div className="group relative overflow-hidden rounded-[1.25rem] bg-[#eef0f4]">
              <button
                type="button"
                className="relative block aspect-[4/5] w-full cursor-zoom-in sm:aspect-[5/6]"
                onClick={() => setLightboxOpen(true)}
                aria-label="Open image zoom"
              >
                <Image
                  key={active.id}
                  src={active.url}
                  alt={active.alt ?? productName}
                  fill
                  priority
                  quality={70}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="soft-zoom object-cover"
                />
              </button>

              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
                {hasMultiple ? (
                  <span className="rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white">
                    {activeIndex + 1} / {images.length}
                  </span>
                ) : (
                  <span />
                )}
                <span className="hidden items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white md:inline-flex">
                  <Search className="size-3.5" />
                  Click to zoom
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white md:hidden">
                  <Search className="size-3.5" />
                  Tap to zoom
                </span>
              </div>

              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      goPrev();
                    }}
                    className="absolute top-1/2 left-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-foreground hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      goNext();
                    }}
                    className="absolute top-1/2 right-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-foreground hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {hasMultiple && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 lg:w-[72px] lg:flex-col lg:gap-3 lg:overflow-y-auto lg:overflow-x-visible lg:pb-0">
              {images.map((image, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "group/thumb relative size-[64px] shrink-0 overflow-hidden rounded-2xl lg:size-[72px] lg:w-full",
                      isActive
                        ? "opacity-100 shadow-[0_10px_24px_-14px_rgba(18,21,26,0.55)]"
                        : "opacity-45 hover:opacity-85",
                    )}
                    aria-label={`View image ${index + 1} of ${images.length}`}
                    aria-current={isActive}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt ?? `${productName} ${index + 1}`}
                      fill
                      sizes="72px"
                      className={cn(
                        "object-cover transition-transform duration-500",
                        isActive ? "scale-100" : "scale-105 group-hover/thumb:scale-100",
                      )}
                    />
                    {/* Soft active cue — bottom bar, no blue box */}
                    <span
                      className={cn(
                        "absolute inset-x-2 bottom-2 h-1 rounded-full transition-all duration-300",
                        isActive
                          ? "bg-white/95 shadow-sm"
                          : "bg-transparent",
                      )}
                    />
                    {!isActive && (
                      <span className="absolute inset-0 bg-black/10 transition-colors group-hover/thumb:bg-transparent" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          productName={productName}
          activeIndex={activeIndex}
          onClose={() => setLightboxOpen(false)}
          onChange={setActiveIndex}
        />
      )}
    </>
  );
}

function Lightbox({
  images,
  productName,
  activeIndex,
  onClose,
  onChange,
}: {
  images: GalleryImage[];
  productName: string;
  activeIndex: number;
  onClose: () => void;
  onChange: (index: number) => void;
}) {
  const [scale, setScale] = useState(1);
  const active = images[activeIndex] ?? images[0];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    setScale(1);
  }, [activeIndex]);

  function goPrev() {
    onChange((activeIndex - 1 + images.length) % images.length);
  }

  function goNext() {
    onChange((activeIndex + 1) % images.length);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${productName} gallery`}
      className="fixed inset-0 z-[80] flex flex-col bg-black/92"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white sm:px-6">
        <div>
          <p className="font-display text-sm font-semibold sm:text-base">
            {productName}
          </p>
          {hasMultiple && (
            <p className="mt-0.5 text-xs text-white/60">
              Image {activeIndex + 1} of {images.length}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(1, Number((s - 0.5).toFixed(1))))}
            className="flex size-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Zoom out"
          >
            <ZoomOut className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(3, Number((s + 0.5).toFixed(1))))}
            className="flex size-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Zoom in"
          >
            <ZoomIn className="size-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Close gallery"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-8">
        {hasMultiple && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-6" />
          </button>
        )}

        <div className="relative h-full w-full max-w-5xl overflow-auto">
          <div className="flex min-h-full items-center justify-center py-4">
            <div
              className="relative h-[min(72vh,820px)] w-full max-w-4xl transition-transform duration-200"
              style={{ transform: `scale(${scale})` }}
            >
              <Image
                src={active.url}
                alt={active.alt ?? productName}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {hasMultiple && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="size-6" />
          </button>
        )}
      </div>

      {hasMultiple && (
        <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-5">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => onChange(index)}
              className={cn(
                "relative size-14 shrink-0 overflow-hidden rounded-xl transition",
                index === activeIndex
                  ? "opacity-100"
                  : "opacity-45 hover:opacity-80",
              )}
              aria-label={`Go to image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt ?? `${productName} ${index + 1}`}
                fill
                sizes="56px"
                className="object-cover"
              />
              {index === activeIndex && (
                <span className="absolute inset-x-2 bottom-1.5 h-0.5 rounded-full bg-white" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
