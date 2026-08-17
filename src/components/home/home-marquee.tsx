const ITEMS = [
  "Cash on delivery",
  "Baghdad",
  "Erbil",
  "Basra",
  "Mosul",
  "Sulaymaniyah",
  "Najaf",
  "Karbala",
  "Kirkuk",
  "Duhok",
  "Pay when it arrives",
  "18 governorates",
] as const;

export function HomeMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-[#1a2744] bg-[#0f1f4d]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0f1f4d] to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0f1f4d] to-transparent sm:w-28" />
      <div className="marquee flex w-max items-center gap-10 py-3.5 pr-10">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex items-center gap-10"
            aria-hidden={copy === 1}
          >
            {ITEMS.map((item) => (
              <li
                key={`${copy}-${item}`}
                className="flex items-center gap-10 text-[11px] font-semibold tracking-[0.22em] text-white/75 uppercase"
              >
                <span>{item}</span>
                <span
                  aria-hidden
                  className="size-1 shrink-0 rounded-full bg-[#c4a574]"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
