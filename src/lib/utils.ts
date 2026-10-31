export function calculateDiscount(price: number | string, discountPrice: number | string): string | null {
  const p = typeof price === "string" ? parseFloat(price) : price;
  const d = typeof discountPrice === "string" ? parseFloat(discountPrice) : discountPrice;

  if (!d || d >= p) return null;

  const discount = ((p - d) / p) * 100;
  return Math.round(discount).toString();
}

export function formatBnNumber(value: number | string): string {
  const numericValue = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numericValue)) return "0";
  return new Intl.NumberFormat("bn-BD").format(numericValue);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
