"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatIQD, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import {
  buildVariantLabel,
  type PurchaseProduct,
} from "@/lib/product-utils";

type Props = {
  product: PurchaseProduct;
};

export function ProductPurchasePanel({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  const defaultVariant =
    product.variants.find((v) => v.isDefault) ?? product.variants[0];

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      if (!defaultVariant) return initial;
      for (const ov of defaultVariant.optionValues) {
        initial[ov.optionValue.option.name] = ov.optionValue.value;
      }
      return initial;
    },
  );

  const selectedVariant = useMemo(() => {
    if (!product.hasVariants) {
      return defaultVariant ?? null;
    }

    return (
      product.variants.find((variant) =>
        product.options.every((option) => {
          const selected = selectedOptions[option.name];
          if (!selected) return false;
          return variant.optionValues.some(
            (ov) =>
              ov.optionValue.option.name === option.name &&
              ov.optionValue.value === selected,
          );
        }),
      ) ?? null
    );
  }, [product, selectedOptions, defaultVariant]);

  const price = selectedVariant?.price ?? product.basePrice;
  const compareAt =
    selectedVariant?.compareAtPrice ?? product.compareAtPrice ?? null;
  const onSale = !!compareAt && compareAt > price;
  const saveAmount = onSale ? compareAt - price : 0;
  const stock = selectedVariant?.stock ?? 0;
  const inStock = !!selectedVariant && stock > 0;
  const lowStock = inStock && stock <= 5;
  const canAdd = !!selectedVariant && inStock;
  const lineTotal = formatIQD(price * quantity);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setShowSticky(!entry.isIntersecting);
      },
      { rootMargin: "-8px 0px 0px 0px", threshold: 0 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  function selectOption(optionName: string, value: string) {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
    setAdded(false);
  }

  function handleAddToCart() {
    if (!selectedVariant || !inStock) return;

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      variantLabel: buildVariantLabel(selectedVariant),
      imageUrl: product.images[0]?.url,
      unitPrice: selectedVariant.price,
      quantity,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
          {product.category.name}
        </span>
        {onSale && (
          <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-accent-foreground uppercase">
            Sale
          </span>
        )}
        {product.hasVariants && (
          <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Options available
          </span>
        )}
      </div>

      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {product.name}
      </h1>

      <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1">
        <span className="text-3xl font-semibold tracking-tight text-primary">
          {formatIQD(price)}
        </span>
        {onSale && (
          <span className="pb-1 text-base text-muted-foreground line-through">
            {formatIQD(compareAt!)}
          </span>
        )}
        {saveAmount > 0 && (
          <span className="pb-1 text-sm font-medium text-accent-brown">
            Save {formatIQD(saveAmount)}
          </span>
        )}
      </div>

      <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
        {product.description}
      </p>

      <div className="mt-8 space-y-6 border-t border-border/80 pt-7">
        {product.hasVariants &&
          product.options.map((option) => (
            <div key={option.id}>
              <p className="mb-3 text-sm font-semibold">
                {option.name}
                {selectedOptions[option.name] && (
                  <span className="ml-2 font-normal text-muted-foreground">
                    — {selectedOptions[option.name]}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const active = selectedOptions[option.name] === value.value;
                  const available = product.variants.some(
                    (variant) =>
                      variant.stock > 0 &&
                      variant.optionValues.some(
                        (ov) => ov.optionValue.id === value.id,
                      ) &&
                      product.options.every((otherOption) => {
                        if (otherOption.name === option.name) return true;
                        const selected = selectedOptions[otherOption.name];
                        if (!selected) return true;
                        return variant.optionValues.some(
                          (ov) =>
                            ov.optionValue.option.name === otherOption.name &&
                            ov.optionValue.value === selected,
                        );
                      }),
                  );

                  return (
                    <button
                      key={value.id}
                      type="button"
                      disabled={!available && !active}
                      onClick={() => selectOption(option.name, value.value)}
                      className={cn(
                        "min-w-[3rem] rounded-xl border px-4 py-2.5 text-sm transition-all duration-200",
                        active
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : available
                            ? "border-border bg-white hover:border-primary/40 hover:bg-primary/5"
                            : "cursor-not-allowed border-border/60 text-muted-foreground/45 line-through",
                      )}
                    >
                      {value.value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Quantity</p>
            <p
              className={cn(
                "text-xs font-medium",
                !selectedVariant
                  ? "text-muted-foreground"
                  : inStock
                    ? lowStock
                      ? "text-accent-brown"
                      : "text-muted-foreground"
                    : "text-destructive",
              )}
            >
              {selectedVariant
                ? inStock
                  ? lowStock
                    ? `Only ${stock} left`
                    : `${stock} in stock`
                  : "Out of stock"
                : "Select available options"}
            </p>
          </div>
          <div className="inline-flex items-center overflow-hidden rounded-xl border border-border bg-white">
            <button
              type="button"
              className="flex size-11 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:opacity-40"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
            >
              <Minus className="size-4" />
            </button>
            <span className="w-12 text-center text-sm font-semibold tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              className="flex size-11 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:opacity-40"
              onClick={() => setQuantity((q) => Math.min(stock || 1, q + 1))}
              aria-label="Increase quantity"
              disabled={!inStock || quantity >= stock}
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <div ref={ctaRef} className="space-y-3">
          <Button
            size="lg"
            className="h-12 w-full text-base shadow-md shadow-primary/20"
            disabled={!canAdd}
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <Check className="size-4" />
                Added to cart
              </>
            ) : (
              <>
                <ShoppingBag className="size-4" />
                Add to cart · {lineTotal}
              </>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Cash on delivery available across all Iraqi governorates.
          </p>
        </div>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        <TrustItem
          icon={<Banknote className="size-4" />}
          title="Cash on delivery"
          text="Pay when it arrives"
        />
        <TrustItem
          icon={<Truck className="size-4" />}
          title="Nationwide"
          text="All 18 governorates"
        />
        <TrustItem
          icon={<ShieldCheck className="size-4" />}
          title="Secure checkout"
          text="Protected order flow"
        />
      </ul>

      {/* Mobile sticky buy bar — only when main CTA is off-screen */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_-24px_rgba(15,23,42,0.35)] backdrop-blur-md transition-transform duration-300 md:hidden",
          showSticky ? "translate-y-0" : "translate-y-full pointer-events-none",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {product.name}
            </p>
            <p className="text-sm font-semibold text-primary">{lineTotal}</p>
          </div>
          <Button
            size="lg"
            className="h-11 shrink-0 px-5 shadow-md shadow-primary/20"
            disabled={!canAdd}
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <Check className="size-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="size-4" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function TrustItem({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <li className="rounded-2xl bg-[#f3f5f8] px-3.5 py-3.5">
      <div className="flex size-8 items-center justify-center rounded-full bg-white text-primary shadow-sm">
        {icon}
      </div>
      <p className="mt-2.5 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{text}</p>
    </li>
  );
}
