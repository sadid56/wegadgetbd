export function formatProduct(p: any) {
  if (!p) return null;
  return {
    ...p,
    description: p.description ?? p.markdown_description ?? "",
    price: Number(p.price),
    discountPrice: p.discountPrice != null ? Number(p.discountPrice) : null,
    rating: Number(p.rating ?? 5),
    stockCount: p.stockCount ?? 0,
    ratingCount: p.ratingCount ?? 0,
    soldCount: p.soldCount ?? 360,
    isFeatured: p.isFeatured ?? false,
    tags: p.tags || [],
    images: p.images || [],
    videoLinks: p.videoLinks || [],
  };
}

