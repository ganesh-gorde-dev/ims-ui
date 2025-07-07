import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Product, ProductResponse } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../../../core/services/api-interface.service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-product-list',
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatIconModule],
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
  dataSource: Product[] = [];
  totalCount: number = 0;
  pageSize: number = 10;
  pageChangeSubscription: any;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @Output() emitEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _apiService: ApiService) {
    // Initialization logic can go here
    this.loadProducts();
  }

  ngOnInit() {
    this.pageChangeSubscription = this.paginator?.page.subscribe(pageEvent => {
      this.pageSize = pageEvent.pageSize;
      this.loadProducts();
    });
  }

  ngAfterViewInit(): void {
    // Any additional initialization logic can go here
    // Pagination setup can be done here if needed
  }

  async loadProducts() {
    const productData = await this._apiService.get<ProductResponse>('product');

    this.dataSource = productData.list;
    this.totalCount = productData.pagination.count;
  }

  handleAction(action: string, product: Product) {
    // Logic to handle edit action
    this.emitEvent.emit({ action: action, product });
  }
}
