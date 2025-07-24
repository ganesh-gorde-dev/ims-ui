import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ApiService } from '../../../../core/services/api-interface.service';
import { Tenant, User, UserResponse } from '../../models/tenant.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-user-list',
  imports: [SharedModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'phone_number',
    'role',
    // 'actions',
  ];
  dataSource = new MatTableDataSource<User>();
  totalCount: number = 0;
  pageSize: number = 10;
  pageChangeSubscription: any;
  tenantData: Tenant;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() emitEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _apiService: ApiService, private route: ActivatedRoute) {
    this.tenantData = this.route.snapshot.data['tenantDetails'];
    // Initialization logic can go here
    this.loadUsers();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    // Any additional initialization logic can go here
    // Pagination setup can be done here if needed
    this.dataSource.paginator = this.paginator;
    this.pageChangeSubscription = this.paginator?.page.subscribe(pageEvent => {
      this.pageSize = pageEvent.pageSize;
      this.loadUsers(pageEvent.pageIndex + 1, pageEvent.pageSize);
    });
  }

  async loadUsers(pageNumber: number = 1, pageSize: number = this.pageSize) {
    const tenantData = await this._apiService.get<UserResponse>(
      'user/company-admin',
      {
        ispagination: true,
        page: pageNumber,
        pagesize: pageSize,
        tenant_id: this.tenantData.tenant_id,
      }
    );

    this.dataSource = new MatTableDataSource<User>(tenantData.list);
    this.emitEvent.emit({ action: 'add_permission', value: false });
    this.totalCount = tenantData.pagination.count;
  }

  handleAction(action: string, user: User) {
    // Logic to handle edit action
    this.emitEvent.emit({ action: action, user });
  }
}
