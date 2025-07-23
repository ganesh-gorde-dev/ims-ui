import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { Supplier, SupplierResponse } from '../../models/supplier.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../../core/services/api-interface.service';
import { StockQueryParams } from '../../../stock/models/stock.model';

@Component({
  selector: 'app-supplier-list',
  imports: [SharedModule],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.css',
})
export class SupplierListComponent {
  displayedColumns: string[] = ['supplier_code', 'supplier_name', 'actions'];
  dataSource = new MatTableDataSource<Supplier>();
  totalCount: number = 0;
  pageSize: number = 10;
  pageChangeSubscription: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() emitEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _apiService: ApiService) {
    // Initialization logic can go here
    this.loadSuppliers();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    // Any additional initialization logic can go here
    // Pagination setup can be done here if needed
    this.dataSource.paginator = this.paginator;
    this.pageChangeSubscription = this.paginator?.page.subscribe(pageEvent => {
      this.pageSize = pageEvent.pageSize;
      this.loadSuppliers(pageEvent.pageIndex + 1, pageEvent.pageSize);
    });
  }

  async loadSuppliers(
    pageNumber: number = 1,
    pageSize: number = this.pageSize,
    params?: { supplier_name: string; supplier_code: string } | null
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
    const supplierData = await this._apiService.get<SupplierResponse>(
      'supplier',
      queryParams
    );

    this.dataSource = new MatTableDataSource<Supplier>(supplierData.list);
    this.totalCount = supplierData.pagination.count;
  }

  handleAction(action: string, supplier: Supplier) {
    // Logic to handle edit action
    this.emitEvent.emit({ action: action, supplier });
  }
}
