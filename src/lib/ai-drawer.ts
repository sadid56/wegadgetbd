export interface AiProductCardData {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  thumbnail: string | null;
  inStock: boolean;
  categoryName?: string | null;
}

export interface AiProductContext {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  inStock: boolean;
  categoryName?: string | null;
  specifications?: unknown;
  packagingDelivery?: unknown;
  description?: string;
}

export const AI_DRAWER_EVENT = "wegadget:open-ai-drawer";

export interface OpenAiDrawerDetail {
  prompt?: string;
  productContext?: AiProductContext;
}

/** Opens the global AI Shopping Drawer, optionally pre-sending a prompt and product context. */
export function openAiShoppingDrawer(prompt?: string, productContext?: AiProductContext) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<OpenAiDrawerDetail>(AI_DRAWER_EVENT, {
      detail: {
        prompt: prompt?.trim() || undefined,
        productContext,
      },
    }),
  );
}
