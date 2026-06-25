import { Star } from "lucide-react";

export default function StarRating({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={
            n <= Math.round(rating)
              ? "fill-caramel text-caramel"
              : "text-choco/20"
          }
        />
      ))}
    </span>
  );
}
