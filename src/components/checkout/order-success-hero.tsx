"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

export function OrderSuccessHero({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="rounded-xl border border-border bg-white p-8 text-center shadow-sm">
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

  return (
    <motion.div
      className="rounded-xl border border-border bg-white p-8 text-center shadow-sm"
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.12, type: "spring", stiffness: 260, damping: 18 }}
      >
        <CheckCircle2 className="size-7" />
      </motion.div>
      <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      {children}
    </motion.div>
  );
}
