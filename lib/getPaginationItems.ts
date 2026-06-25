type PaginationItem = number | "ellipsis";

export const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): PaginationItem[] => {
  const items: PaginationItem[] = [];

  // Always show first page
  items.push(1);

  // Left ellipsis
  if (currentPage > 3) {
    items.push("ellipsis");
  }

  // Pages around current page
  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(totalPages - 1, currentPage + 1);
    i++
  ) {
    items.push(i);
  }

  // Right ellipsis
  if (currentPage < totalPages - 2) {
    items.push("ellipsis");
  }

  // Always show last page
  if (totalPages > 1) {
    items.push(totalPages);
  }

  return items;
};
