import Image from "next/image";
import type { Category } from "@/lib/types";
import { CATEGORY_COLOR, CATEGORY_ICON, CATEGORY_LABEL } from "@/lib/types";

// Renders the brand category icon on a white tile so the (transparent,
// single-color) artwork stays legible on any surface — colored home tiles,
// white cards, or the cream filter bar. Falls back to a colored monogram for
// the "Other" category, which has no artwork.
export default function CategoryIcon({
  category,
  size = 28,
  rounded = "full",
  className = "",
}: {
  category: Category;
  size?: number;
  rounded?: "full" | "xl" | "lg";
  className?: string;
}) {
  const icon = CATEGORY_ICON[category];
  const radius =
    rounded === "full"
      ? "rounded-full"
      : rounded === "xl"
        ? "rounded-xl"
        : "rounded-lg";

  if (!icon) {
    return (
      <span
        className={`grid shrink-0 place-items-center ${radius} font-bold text-white ${className}`}
        style={{
          width: size,
          height: size,
          background: CATEGORY_COLOR[category],
          fontSize: size * 0.4,
        }}
        aria-hidden
      >
        {category[0]}
      </span>
    );
  }

  const inset = Math.max(2, Math.round(size * 0.16));
  const inner = size - inset * 2;

  return (
    <span
      className={`inline-grid shrink-0 place-items-center bg-white ${radius} ${className}`}
      style={{
        width: size,
        height: size,
        // Inset ring in the category color — gives the tile definition on
        // white cards and a crisp edge on colored backgrounds.
        boxShadow: `inset 0 0 0 1.5px ${CATEGORY_COLOR[category]}`,
      }}
    >
      <Image
        src={icon}
        alt={`${CATEGORY_LABEL[category]} icon`}
        width={inner}
        height={inner}
        style={{ width: inner, height: inner }}
      />
    </span>
  );
}
