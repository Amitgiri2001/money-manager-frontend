export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorDto {
  status?: number;
  message: string;
  fieldErrors?: Record<string, string>;
}

export interface SpringPage<T> {
  content: T[];
  pageable?: unknown;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort?: unknown;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PageRequestDto {
  page: number;
  size: number;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}
