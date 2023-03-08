export interface Status {
  code: number;
  message: string;
  success: boolean;
}

export interface Error {}

export interface Pagination {
  count: number;
  page: number;
  pageCount: number;
  pageSize: number;
}
export interface ResponseEntry<T> {
  data: T;
  status: Status;
  meta?: {
    pagination?: Pagination;
  };
}

export interface JwtPayload {
  userId: number;
  roleId: number;
  iat: number;
  exp: number;
}

export type RoleType = "admin" | "user" | "projecter";
