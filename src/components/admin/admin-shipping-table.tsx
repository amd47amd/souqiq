"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, MapPin, Search } from "lucide-react";
import {
  toggleGovernorateActiveAction,
  updateGovernorateFeeAction,
} from "@/actions/admin";
import type { AdminShippingRow } from "@/lib/admin-data";
import { formatIQD } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminPanel, Pill } from "@/components/admin/admin-ui";

type Filter = "all" | "live" | "paused" | "free" | "paid";

const FILTER_CARDS: {
  id: Exclude<Filter, "all">;
  label: string;
  hint: string;
  accent: string;
}[] = [
  {
    id: "live",
    label: "Available",
    hint: "Shown at checkout",
    accent: "bg-emerald-400",
  },
  {
    id: "paused",
    label: "Paused",
    hint: "Customers cannot pick",
    accent: "bg-slate-400",
  },
  {
    id: "free",
    label: "Free",
    hint: "No delivery fee",
    accent: "bg-primary",
  },
  {
    id: "paid",
    label: "Paid",
    hint: "Fee added on COD",
    accent: "bg-amber-400",
  },
];

function matchesFilter(row: AdminShippingRow, filter: Filter) {
  switch (filter) {
    case "live":
      return row.isActive;
    case "paused":
      return !row.isActive;
    case "free":
      return row.shippingFee === 0;
    case "paid":
      return row.shippingFee > 0;
    default:
      return true;
  }
}

export function AdminShippingTable({
  governorates,
}: {
  governorates: AdminShippingRow[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      live: governorates.filter((item) => item.isActive).length,
      paused: governorates.filter((item) => !item.isActive).length,
      free: governorates.filter((item) => item.shippingFee === 0).length,
      paid: governorates.filter((item) => item.shippingFee > 0).length,
    }),
    [governorates],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return governorates.filter((row) => {
      if (!matchesFilter(row, filter)) return false;
      if (!q) return true;
      return row.name.toLowerCase().includes(q);
    });
  }, [filter, governorates, query]);

  function selectFilter(next: Exclude<Filter, "all">) {
    setFilter((current) => (current === next ? "all" : next));
  }

  const activeCard = FILTER_CARDS.find((item) => item.id === filter);
  const listTitle = activeCard ? `${activeCard.label} zones` : "Delivery zones";

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {FILTER_CARDS.map((item) => {
          const selected = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectFilter(item.id)}
              className={`rounded-2xl border bg-white p-4 text-left shadow-[0_1px_2px_rgb(16_24_40_/_0.04)] transition-colors ${
                selected
                  ? "border-primary/40 ring-2 ring-primary/15"
                  : "border-border/80 hover:border-primary/25"
              }`}
            >
              <span className={`mb-3 block h-1 w-8 rounded-full ${item.accent}`} />
              <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                {item.label}
              </p>
              <p className="mt-1 font-display text-2xl font-semibold">
                {counts[item.id]}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
            </button>
          );
        })}
      </div>

      <AdminPanel>
        <div className="flex flex-col gap-3 border-b border-border/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <p className="font-display text-base font-semibold">{listTitle}</p>
            <p className="text-sm text-muted-foreground">
              {visible.length} {visible.length === 1 ? "governorate" : "governorates"}
              {filter !== "all" ? (
                <>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className="font-medium text-primary hover:underline"
                  >
                    Show all
                  </button>
                </>
              ) : null}
            </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Baghdad, Erbil…"
              className="h-10 w-full rounded-xl border border-input bg-[#f8f9fb] pr-3 pl-9 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <MapPin className="mx-auto size-8 text-muted-foreground/70" />
            <p className="mt-3 font-display text-lg font-semibold">
              No zones here
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {query
                ? "Try another governorate name."
                : "No governorates match this filter."}
            </p>
          </div>
        ) : (
          <ul>
            {visible.map((row) => (
              <li
                key={row.id}
                className="border-b border-border/70 last:border-0"
              >
                {editingId === row.id ? (
                  <FeeEditor
                    row={row}
                    onCancel={() => setEditingId(null)}
                    onSaved={() => {
                      setEditingId(null);
                      router.refresh();
                    }}
                  />
                ) : (
                  <article
                    role="button"
                    tabIndex={0}
                    onClick={() => setEditingId(row.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setEditingId(row.id);
                      }
                    }}
                    className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-[#fafbff] sm:gap-4 sm:px-5"
                  >
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#eef1f6] text-muted-foreground ring-1 ring-border/60 sm:size-16">
                      <MapPin className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">{row.name}</p>
                        <Pill tone={row.isActive ? "success" : "muted"}>
                          {row.isActive ? "Available" : "Paused"}
                        </Pill>
                        {row.shippingFee === 0 ? (
                          <Pill tone="warning">Free</Pill>
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {row.orderCount} {row.orderCount === 1 ? "order" : "orders"}
                      </p>
                    </div>
                    <div className="hidden shrink-0 text-right sm:block">
                      <p className="font-display font-semibold tabular-nums">
                        {formatIQD(row.shippingFee)}
                      </p>
                      <p className="text-xs text-muted-foreground">COD fee</p>
                    </div>
                    <div
                      className="flex shrink-0"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <form action={toggleGovernorateActiveAction}>
                        <input type="hidden" name="id" value={row.id} />
                        <input
                          type="hidden"
                          name="isActive"
                          value={String(row.isActive)}
                        />
                        <button
                          type="submit"
                          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label={row.isActive ? "Pause" : "Make available"}
                        >
                          {row.isActive ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </form>
                    </div>
                  </article>
                )}
              </li>
            ))}
          </ul>
        )}
      </AdminPanel>
    </div>
  );
}

function FeeEditor({
  row,
  onCancel,
  onSaved,
}: {
  row: AdminShippingRow;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fee, setFee] = useState(String(row.shippingFee));

  function onSubmit(formData: FormData) {
    setError(null);
    formData.set("shippingFee", fee);
    startTransition(async () => {
      const result = await updateGovernorateFeeAction(formData);
      if (result && "ok" in result && !result.ok) {
        setError(result.message ?? "Could not save fee.");
        return;
      }
      onSaved();
    });
  }

  return (
    <form
      action={onSubmit}
      className="bg-[#fafbff] px-4 py-4 sm:px-5"
    >
      <input type="hidden" name="id" value={row.id} />
      <p className="font-display text-base font-semibold">{row.name}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">
        This fee is added at checkout for cash on delivery.
      </p>

      {error ? (
        <p className="mt-3 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,180px)_1fr]">
        <div className="space-y-1.5">
          <Label htmlFor={`fee-${row.id}`}>Fee (IQD)</Label>
          <Input
            id={`fee-${row.id}`}
            name="shippingFee"
            type="number"
            min={0}
            step={500}
            required
            value={fee}
            onChange={(event) => setFee(event.target.value)}
          />
        </div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/80 bg-white p-3 has-[:checked]:border-primary/30 has-[:checked]:bg-[#eef3ff] sm:self-end">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={row.isActive}
            className="mt-0.5 size-4 accent-primary"
          />
          <span>
            <span className="block text-sm font-medium">Available</span>
            <span className="block text-xs text-muted-foreground">
              Customers can choose this zone
            </span>
          </span>
        </label>
      </div>

      <div className="mt-4 flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save fee"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
