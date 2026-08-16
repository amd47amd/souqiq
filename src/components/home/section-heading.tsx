import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SectionHeading({
  title,
  description,
  href,
  linkLabel = "View all",
  className,
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-xl">
        <div className="mb-3 h-1 w-10 rounded-full bg-primary/80" />
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-[2rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {description}
          </p>
        ) : null}
      </div>
      {href ? (
        <Button
          asChild
          variant="ghost"
          className="self-start text-primary hover:bg-primary/5 hover:text-primary sm:self-auto"
        >
          <Link href={href}>
            {linkLabel}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
