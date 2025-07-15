import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import {
  ApiResponse,
  ApiService,
} from '../../../../core/services/api-interface.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Tenant, TenantResponse } from '../../models/tenant.model';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-tenant-list',
  imports: [SharedModule],
  templateUrl: './tenant-list.component.html',
  styleUrl: './tenant-list.component.css',
  standalone: true,
})
export class TenantListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'tenant_id',
    'tenant_code',
    'tenant_name',
    'actions',
  ];
  dataSource = new MatTableDataSource<Tenant>();
  totalCount: number = 0;
  pageSize: number = 10;
  pageChangeSubscription: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() emitEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _apiService: ApiService) {
    // Initialization logic can go here
    this.loadTenants();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    // Any additional initialization logic can go here
    // Pagination setup can be done here if needed
    this.dataSource.paginator = this.paginator;
    this.pageChangeSubscription = this.paginator?.page.subscribe(pageEvent => {
      this.pageSize = pageEvent.pageSize;
      this.loadTenants(pageEvent.pageIndex + 1, pageEvent.pageSize);
    });
  }

  async loadTenants(pageNumber: number = 1, pageSize: number = this.pageSize) {
    const tenantData = await this._apiService.get<TenantResponse>('tenant', {
      ispagination: true,
      page: pageNumber,
      pagesize: pageSize,
    });

    this.dataSource = new MatTableDataSource<Tenant>(tenantData.list);
    this.totalCount = tenantData.pagination.count;
  }

  handleAction(action: string, tenant: Tenant) {
    // Logic to handle edit action
    this.emitEvent.emit({ action: action, tenant });
  }
}
