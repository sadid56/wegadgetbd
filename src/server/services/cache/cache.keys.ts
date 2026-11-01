export const CACHE_TTL = {
  THIRTY_SECONDS: 30,
  ONE_MINUTE: 60,
  FIVE_MINUTES: 300,
  TEN_MINUTES: 600,
  FIFTEEN_MINUTES: 900,
  THIRTY_MINUTES: 1800,
  ONE_HOUR: 3600,
  FOUR_HOURS: 14400,
  TWELVE_HOURS: 43200,
  ONE_DAY: 86400,
  ONE_WEEK: 604800,
  ONE_MONTH: 2592000,
} as const;

type CacheKeyParams = string | Record<string, unknown>;

const serializeParams = (params: CacheKeyParams): string => (typeof params === "string" ? params : JSON.stringify(params));

export const CACHE_KEYS = {
  product: (idOrSlug: string) => `product:${idOrSlug}`,
  productsList: (params: CacheKeyParams = "") => `products:list:${serializeParams(params)}`,
  productsPattern: "products:*",
  featuredProducts: "products:featured",
  latestProducts: "products:latest",

  category: (idOrSlug: string) => `category:${idOrSlug}`,
  categoriesList: "categories:all",
  categoriesPattern: "categories:*",

  systemSettings: "system:settings",

  cart: (userIdOrSession: string) => `cart:${userIdOrSession}`,
  userProfile: (userId: string) => `user:profile:${userId}`,

  reviews: (productId: string) => `reviews:${productId}`,
  reviewsPattern: "reviews:*",
} as const;

export type CacheTTL = typeof CACHE_TTL;
export type CacheKeys = typeof CACHE_KEYS;
