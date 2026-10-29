import { eq } from "drizzle-orm";
import { product, auditLog, type ProductStatus, type ProductLabel, type AuditAction } from "@/db/schema";
import { normalizeVideoInput } from "@/lib/video-links";
import type { Context } from "@/server/context";
import type { CreateProductInput } from "@/server/schemas/products.schema";
import { formatProduct } from "./_shared";

const DEFAULT_STATUS: ProductStatus = "PENDING";
const DEFAULT_LABEL: ProductLabel = "NONE";
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
        description: input.description,
        markdown_description: input.markdown_description,
        price: String(input.price),
        discountPrice: input.discountPrice != null ? String(input.discountPrice) : null,
        images: input.images || [],
        categoryId: input.categoryId,
        status: (input.status as ProductStatus) || DEFAULT_STATUS,
        label: (input.label as ProductLabel) || DEFAULT_LABEL,
        isFeatured: input.isFeatured ?? false,
        featuredBanner: input.featuredBanner,
        tags: input.tags || [],
        brand: input.brand,
        model: input.model,
        whyBuyText: input.whyBuyText,
        messengerUrl: input.messengerUrl,
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
    try {
      return await this.db.insert(auditLog).values({
        action: "CREATE_PRODUCT" as AuditAction,
        actorId: this.actorId,
        metadata: { productId, title },
      });
    } catch {
      return null;
    }
  }
}
