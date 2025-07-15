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
    this.loadProducts();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    // Any additional initialization logic can go here
    // Pagination setup can be done here if needed
    this.dataSource.paginator = this.paginator;
    this.pageChangeSubscription = this.paginator?.page.subscribe(pageEvent => {
      this.pageSize = pageEvent.pageSize;
      this.loadProducts(pageEvent.pageIndex + 1, pageEvent.pageSize);
    });
  }

  async loadProducts(
    pageNumber: number = 1,
    pageSize: number = this.pageSize,
    supplierId?: string
  ) {
    const queryParams: StockQueryParams = {
      ispagination: true,
      page: pageNumber,
      pagesize: pageSize,
    };
    if (supplierId) {
      queryParams.supplier_id = supplierId;
    }
    const productData = await this._apiService.get<StockResponse>(
      'stock',
      queryParams
    );

    this.dataSource = new MatTableDataSource<Stock>(productData.list);
    this.totalCount = productData.pagination.count;
  }

  handleAction(action: string, stock: Stock) {
    // Logic to handle edit action
    this.emitEvent.emit({ action: action, stock });
  }
}
