export interface Product {
  product_id: string;
  product_code: string;
  product_name: string;
  category_id: string;
  sell_price: number;
  purchase_price: number;
}

export interface ProductResponse {
  list: Product[];
  pagination: {
    count: number;
    page_size: number;
    current_page: number;
    total_pages: number;
  };
}

export interface ProductPayload {
  category_id: string;
  product_code: string;
  product_name: string;
  sell_price: number;
  purchase_price: number;
}

export interface ProductDialog {
  isEdit: boolean;
  product?: Product;
}

export interface ProductQueryParams {
  ispagination: boolean;
  page: number;
  pagesize: number;
  product_name?: string;
  product_code?: string;
}
