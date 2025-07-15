export interface Category {
  category_id: string;
  category_name: string;
  category_code: string;
}

export interface CategoryResponse {
  list: Category[];
  pagination: {
    count: number;
    page_size: number;
    current_page: number;
    total_pages: number;
  };
}

export interface CategoryPayload {
  category_code: 'string';
  category_name: 'string';
}

export interface CategoryQueryParams {
  ispagination: boolean;
  page: number;
  pagesize: number;
  category_name?: string;
  category_code?: string;
}
