export interface PaginatedResult {
  total: number;
  totalPages: number;
}

export function paginate(total: number, limit: number): PaginatedResult {
  return {
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function offsetOf(page: number, limit: number): number {
  return (page - 1) * limit;
}
