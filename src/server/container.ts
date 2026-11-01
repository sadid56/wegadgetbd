import "reflect-metadata";
import { container } from "tsyringe";
import { CacheService } from "./services/cache/cache.service";
import { CACHE_SERVICE_TOKEN, type ICacheService } from "./services/cache/cache.types";

/**
 * Register services in tsyringe container
 */
container.registerSingleton<ICacheService>(CACHE_SERVICE_TOKEN, CacheService);

/**
 * Helper to resolve the CacheService from the tsyringe container
 */
export function getCacheService(): ICacheService {
  return container.resolve<ICacheService>(CACHE_SERVICE_TOKEN);
}

export { container };
export default container;
