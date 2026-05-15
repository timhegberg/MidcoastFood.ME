import Image from "next/image";
import type { Category } from "@/lib/types";
import { CATEGORY_COLOR, CATEGORY_ICON, CATEGORY_LABEL } from "@/lib/types";

// Renders the brand category icon. Falls back to a colored monogram for the
// "Other" category, which has no artwork.
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
    rounded === "full" ? "rounded-full" : rounded === "xl" ? "rounded-xl" : "rounded-lg";

  if (!icon) {
    return (
      <span
        className={`grid place-items-center ${radius} font-bold text-white ${className}`}
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

  return (
    <Image
      src={icon}
      alt={`${CATEGORY_LABEL[category]} icon`}
      width={size}
      height={size}
      className={`${radius} object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
