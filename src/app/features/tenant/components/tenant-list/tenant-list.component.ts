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
import { MatTableModule } from '@angular/material/table';
import {
  ApiResponse,
  ApiService,
} from '../../../../core/services/api-interface.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Tenant, TenantResponse } from '../../models/tenant.model';

@Component({
  selector: 'app-tenant-list',
  imports: [MatTableModule, CommonModule, MatIconModule, MatPaginatorModule],
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
  dataSource: Tenant[] = [];
  totalCount: number = 0;
  pageSize: number = 10;
  pageChangeSubscription: any;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @Output() emitEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _apiService: ApiService) {
    // Initialization logic can go here
    this.loadTenants();
  }

  ngOnInit() {
    this.pageChangeSubscription = this.paginator?.page.subscribe(pageEvent => {
      this.pageSize = pageEvent.pageSize;
      this.loadTenants();
    });
  }

  ngAfterViewInit(): void {
    // Any additional initialization logic can go here
    // Pagination setup can be done here if needed
  }

  async loadTenants() {
    const tenantData = await this._apiService.get<TenantResponse>('tenant');

    this.dataSource = tenantData.list;
    this.totalCount = tenantData.pagination.count;
  }

  handleAction(action: string, tenant: Tenant) {
    // Logic to handle edit action
    this.emitEvent.emit({ action: action, tenant });
  }
}
