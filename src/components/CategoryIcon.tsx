import { CATEGORIES } from "@/lib/categories";

export default function CategoryIcon({ category }: { category: string }) {
  const parts = category.split(",").map((c) => c.trim());
  const icons = parts.map((p) => CATEGORIES.find((item) => item.value === p)?.icon ?? "❓");
  return <span aria-hidden>{icons.join("")}</span>;
}

// authored-by: claude-opus-4-6
