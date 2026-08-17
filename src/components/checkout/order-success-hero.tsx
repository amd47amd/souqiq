import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

export function OrderSuccessHero({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-border/80 bg-white p-8 text-center shadow-[0_18px_50px_-36px_rgba(18,21,26,0.45)]">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="size-7" />
      </div>
      <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      {children}
    </div>
  );
}
