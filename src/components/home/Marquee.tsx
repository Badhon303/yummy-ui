const items = [
  "Freshly Baked Daily",
  "Chicken Puffs",
  "Soft Dinner Rolls",
  "Cream Buns",
  "Swiss Rolls",
  "Pizza Bread",
  "Happiness in Every Bite",
];

export default function Marquee() {
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-choco/10 bg-caramel py-4 text-white">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-lg">
            {item}
            <span className="text-2xl leading-none">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
