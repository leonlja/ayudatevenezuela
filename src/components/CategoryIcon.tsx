import { CATEGORIES } from "@/lib/categories";

export default function CategoryIcon({ category }: { category: string }) {
  const match = CATEGORIES.find((item) => item.value === category);
  return <span aria-hidden>{match?.icon ?? "[*]"}</span>;
}

// authored-by: gpt-5.3-codex
