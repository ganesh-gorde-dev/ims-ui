import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import {
  Stock,
  StockQueryParams,
  StockResponse,
} from '../../models/stock.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../../core/services/api-interface.service';
import {
  Product,
  ProductResponse,
} from '../../../products/models/product.model';

@Component({
  selector: 'app-stock-list',
  imports: [SharedModule],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.css',
})
export class StockListComponent {
  displayedColumns: string[] = [
    'product_name',
    'price',
    'movement_type',
    'quantity',
    'actions',
  ];
  dataSource = new MatTableDataSource<Stock>();
  totalCount: number = 0;
  pageSize: number = 10;
  pageChangeSubscription: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() emitEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _apiService: ApiService) {
    // Initialization logic can go here
    this.loadStocks();
  }

  products: Product[] = [];
  async getProducts() {
    const products = await this._apiService.get<ProductResponse>('product', {
      ispagination: false,
    });

    this.products = products.list;
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    // Any additional initialization logic can go here
    // Pagination setup can be done here if needed
    this.dataSource.paginator = this.paginator;
    this.pageChangeSubscription = this.paginator?.page.subscribe(pageEvent => {
      this.pageSize = pageEvent.pageSize;
      this.loadStocks(pageEvent.pageIndex + 1, pageEvent.pageSize);
    });
  }

  async loadStocks(
    pageNumber: number = 1,
    pageSize: number = this.pageSize,
    params?: {
      // supplier_id: string;
      // product_id: string;
      movement_type: 'IN' | 'OUT';
      reference_number: string;
    } | null
  ) {
    const queryParams: StockQueryParams = {
      ispagination: true,
      page: pageNumber,
      pagesize: pageSize,
    };
    if (params) {
      // Filter out null key value from params
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== null)
      );
      Object.assign(queryParams, filteredParams);
    }
    await this.getProducts();
    const productData = await this._apiService.get<StockResponse>(
      'stock',
      queryParams
    );

    this.dataSource = new MatTableDataSource<Stock>(
      productData.list.map(stock => {
        return {
          ...stock,
          product_name:
            this.products.find(p => p.product_id === stock.product_id)
              ?.product_name || '',
        };
      })
    );
    this.totalCount = productData.pagination.count;
  }

  handleAction(action: string, stock: Stock) {
    // Logic to handle edit action
    this.emitEvent.emit({ action: action, stock });
  }
}
