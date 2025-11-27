export interface PaginatedResponse<T> {
  next: string | null;
  previous: string | null;
  count: number;
  pager: {
    current: number;
    total: number;
  };
  data: T[];
}
