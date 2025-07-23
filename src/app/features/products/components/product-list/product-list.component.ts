import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import {
  Product,
  ProductQueryParams,
  ProductResponse,
} from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../../../core/services/api-interface.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SharedModule } from '../../../../shared/shared.module';
import { PermissionService } from '../../../../core/services/permission.service';
import { PERMISSION } from '../../../../shared/constant/db.constants';

@Component({
  selector: 'app-product-list',
  imports: [SharedModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  displayedColumns: string[] = [
    'product_code',
    'product_name',
    'sell_price',
    'purchase_price',
    'actions',
  ];
  dataSource = new MatTableDataSource<Product>();
  totalCount: number = 0;
  pageSize: number = 10;
  pageChangeSubscription: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() emitEvent: EventEmitter<any> = new EventEmitter<any>();
  PERMISSION = PERMISSION;
  constructor(
    private _apiService: ApiService,
    private _permisionService: PermissionService
  ) {
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
    params?: { product_name: string; product_code: string } | null
  ) {
    const queryParams: ProductQueryParams = {
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
    const productData = await this._apiService.get<ProductResponse>(
      'product',
      queryParams
    );

    this.dataSource = new MatTableDataSource<Product>(productData.list);
    this.totalCount = productData.pagination.count;
  }

  handleAction(action: string, product: Product) {
    // Logic to handle edit action
    this.emitEvent.emit({ action: action, product });
  }

  hasPermission(id: string) {
    return this._permisionService.hasPermission(id);
  }
}
