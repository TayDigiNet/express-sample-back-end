export interface QueryOptions {
  limit: number;
  offset: number;
  search: string;
  sort: { sortColumn: string; sortType: "asc" | "desc" }[];
  populate: string | string[];
}

export interface QueryResponse<T> {
  count: number;
  rows: T[];
}
