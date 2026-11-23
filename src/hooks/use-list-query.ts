"use client";

import { useCallback } from "react";
import { useQueryStates, parseAsInteger, parseAsString, type UseQueryStatesKeysMap } from "nuqs";

const baseListParsers = {
  search: parseAsString.withDefault("").withOptions({ shallow: false }),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
};

export function useListQuery<TExtra extends UseQueryStatesKeysMap = Record<string, never>>(extraParsers?: TExtra) {
  const parsers = (extraParsers ? { ...baseListParsers, ...extraParsers } : baseListParsers) as typeof baseListParsers & TExtra;

  const [values, setValues] = useQueryStates(parsers);

  const setSearch = useCallback(
    (search: string | null) => {
      void setValues({ search: search || null, page: 1 } as Parameters<typeof setValues>[0]);
    },
    [setValues],
  );

  const setPage = useCallback(
    (page: number) => {
      void setValues({ page } as Parameters<typeof setValues>[0]);
    },
    [setValues],
  );

  const setRowsPerPage = useCallback(
    (limit: number) => {
      void setValues({ limit, page: 1 } as Parameters<typeof setValues>[0]);
    },
    [setValues],
  );

  return {
    ...values,
    search: values.search,
    page: values.page,
    limit: values.limit,
    rowsPerPage: values.limit,
    setSearch,
    setPage,
    setLimit: setRowsPerPage,
    setRowsPerPage,
    setQuery: setValues,
  };
}
