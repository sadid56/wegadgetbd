import { getCacheService } from "../../container";

export * from "./cache.keys";
export * from "./cache.types";
export * from "./cache.service";

/**
 * Resolved singleton instance from tsyringe container
 */
export const cacheService = getCacheService();
