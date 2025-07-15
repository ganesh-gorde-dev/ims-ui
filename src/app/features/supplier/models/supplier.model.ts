export interface Supplier {
  supplier_id: string;
  supplier_name: string;
  supplier_code: string;
}

export interface SupplierResponse {
  list: Supplier[];
  pagination: {
    count: number;
    page_size: number;
    current_page: number;
    total_pages: number;
  };
}

export interface SupplierPayload {
  supplier_name: string;
  supplier_code: string;
}

export interface SupplierQueryParams {
  ispagination: boolean;
  page: number;
  pagesize: number;
  supplier_name?: string;
  supplier_code?: string;
}
