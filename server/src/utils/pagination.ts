export type PaginationQuery = {
  page?: unknown;
  limit?: unknown;
};

export type PaginationParams = {
  page: number;
  limit: number;
  skip: number;
};

export type PaginatedResult<T> = {
  data: T;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const parsePagination = (query: PaginationQuery): PaginationParams => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  return { page, limit, skip: (page - 1) * limit };
};

export const paginated = <T>(
  data: T,
  total: number,
  { page, limit }: Pick<PaginationParams, "page" | "limit">
): PaginatedResult<T> => ({
  data,
  meta: {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  },
});
