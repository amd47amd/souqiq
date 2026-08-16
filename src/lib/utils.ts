import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format integer IQD amounts with thousand separators, e.g. 25000 → "25,000 IQD" */
export function formatIQD(amount: number): string {
  return `${new Intl.NumberFormat("en-US").format(amount)} IQD`;
}
