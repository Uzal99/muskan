export default function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  // Repeat so the -50% translate loop is seamless on wide screens.
  const row = [...items, ...items, ...items, ...items];
  const loop = [...row, ...row];

  return (
    <div className="overflow-hidden border-y border-white/10 bg-brand py-4" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-2xl uppercase tracking-wide text-white">
            {item}
            <span className="text-black/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
