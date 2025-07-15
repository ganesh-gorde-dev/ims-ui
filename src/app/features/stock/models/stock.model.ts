export interface Stock {
  stock_id: string;
  product_id: string;
  supplier_id: string;
  quantity: number;
  price: number;
  movement_type: 'IN' | 'OUT';
}

export interface StockResponse {
  list: Stock[];
  pagination: {
    count: number;
    page: number;
    pageSize: number;
  };
}

export interface StockPayload {
  product_id: string;
  supplier_id: string;
  quantity: number;
  price: number;
  movement_type: 'IN' | 'OUT';
}

export interface StockQueryParams {
  ispagination: boolean;
  page: number;
  pagesize: number;
  movement_type?: 'IN' | 'OUT';
  product_id?: string;
  supplier_id?: string;
  reference_number?: string;
}
