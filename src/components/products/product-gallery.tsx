"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
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
  const [hoverOrigin, setHoverOrigin] = useState({ x: 50, y: 50 });
  const [imageSettled, setImageSettled] = useState(true);

  const active = images[activeIndex] ?? images[0];
  const hasMultiple = images.length > 1;
  const lastActiveRef = useRef(active);
  const [previousImage, setPreviousImage] = useState<GalleryImage | null>(null);

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
    if (lastActiveRef.current.id !== active.id) {
      setPreviousImage(lastActiveRef.current);
      setImageSettled(false);
      setHoverOrigin({ x: 50, y: 50 });
      lastActiveRef.current = active;

      const raf = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setImageSettled(true);
        });
      });

      const timeout = window.setTimeout(() => {
        setPreviousImage(null);
      }, 260);

      return () => {
        window.cancelAnimationFrame(raf);
        window.clearTimeout(timeout);
      };
    }
  }, [active.id]);

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
              <div
                className="relative block aspect-[4/5] w-full sm:aspect-[5/6]"
                onMouseMove={(event) => {
                  if (!imageSettled || previousImage) return;
                  const rect = event.currentTarget.getBoundingClientRect();
                  const x = ((event.clientX - rect.left) / rect.width) * 100;
                  const y = ((event.clientY - rect.top) / rect.height) * 100;
                  setHoverOrigin({
                    x: Math.min(100, Math.max(0, x)),
                    y: Math.min(100, Math.max(0, y)),
                  });
                }}
              >
                {previousImage ? (
                  <Image
                    src={previousImage.url}
                    alt={previousImage.alt ?? productName}
                    fill
                    priority
                    quality={70}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="gallery-image-previous object-cover"
                  />
                ) : null}
                <Image
                  key={active.id}
                  src={active.url}
                  alt={active.alt ?? productName}
                  fill
                  priority
                  quality={70}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={cn(
                    "object-cover",
                    imageSettled && !previousImage && "gallery-hover-zoom",
                    imageSettled ? "gallery-image-settled" : "gallery-image-entering",
                  )}
                  style={{
                    transformOrigin: `${hoverOrigin.x}% ${hoverOrigin.y}%`,
                  }}
                />
              </div>

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
                  Hover to zoom
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white md:hidden">
                  <Search className="size-3.5" />
                  Smooth zoom
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
    </>
  );
}
