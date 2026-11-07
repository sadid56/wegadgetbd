import { eq } from "drizzle-orm";
import { product, type ProductStatus } from "@/db/schema";
import { normalizeVideoInput } from "@/lib/video-links";
import type { Context } from "@/server/context";
import type { CreateProductInput } from "@/server/schemas/products.schema";
import { formatProduct } from "./_shared";
import { writeAudit } from "@/server/lib/orm";

const DEFAULT_STATUS: ProductStatus = "PENDING";
const DEFAULT_SOLD_COUNT = 360;

export class CreateProductUseCase {
  constructor(
    private readonly db: Context["db"],
    private readonly actorId: string,
  ) {}

  async execute(input: CreateProductInput) {
    const [created] = await this.persistCreate(input);

    const [full] = await Promise.all([this.findWithCategory(created.id), this.recordAudit(created.id, created.title)]);

    return formatProduct(full);
  }

  private persistCreate(input: CreateProductInput) {
    return this.db
      .insert(product)
      .values({
        title: input.title,
        slug: input.slug,
        markdown_description: input.markdown_description,
        price: String(input.price),
        discountPrice: input.discountPrice != null ? String(input.discountPrice) : null,
        images: input.images || [],
        categoryId: input.categoryId,
        status: (input.status as ProductStatus) || DEFAULT_STATUS,
        isFeatured: input.isFeatured ?? false,
        inStock: input.inStock ?? true,
        tags: input.tags || [],
        packagingDelivery: input.packagingDelivery,
        specifications: input.specifications,
        soldCount: input.soldCount ?? DEFAULT_SOLD_COUNT,
        videoLinks: this.normalizeVideoLinks(input.videoLinks),
      })
      .returning();
  }

  private normalizeVideoLinks(links: CreateProductInput["videoLinks"]) {
    if (!Array.isArray(links)) return links || [];
    return links.map((l) => normalizeVideoInput(l)).filter(Boolean);
  }

  private findWithCategory(id: string) {
    return this.db.query.product.findFirst({
      where: eq(product.id, id),
      with: { category: true },
    });
  }

  private async recordAudit(productId: string, title: string) {
    return writeAudit(this.db, {
      action: "CREATE_PRODUCT",
      actorId: this.actorId,
      metadata: { productId, title },
    });
  }
}
