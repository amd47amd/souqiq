import { cn } from "@/lib/utils";

export function PageIntro({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 sm:mb-10", className)}>
      {eyebrow ? (
        <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "font-display text-3xl font-semibold tracking-tight sm:text-4xl",
          eyebrow && "mt-3",
        )}
      >
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-[17px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
