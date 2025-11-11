import { useCallback, useEffect, useMemo, useState } from "react";

export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);

  // Khi danh sách thay đổi, đảm bảo page hợp lệ
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    setPage((p) => Math.min(p, totalPages));
  }, [items, pageSize]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / pageSize)),
    [items.length, pageSize]
  );
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const pageItems = useMemo(() => items.slice(start, end), [items, start, end]);

  const next = useCallback(
    () => setPage((p) => Math.min(p + 1, totalPages)),
    [totalPages]
  );
  const prev = useCallback(() => setPage((p) => Math.max(p - 1, 1)), []);
  const go = useCallback(
    (p: number) => setPage(() => Math.min(Math.max(p, 1), totalPages)),
    [totalPages]
  );

  return {
    page,
    totalPages,
    pageItems,
    pageSize,
    setPage: go,
    next,
    prev,
    canNext: page < totalPages,
    canPrev: page > 1,
  };
}
