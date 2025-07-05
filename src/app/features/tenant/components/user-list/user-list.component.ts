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
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [MatTableModule, CommonModule, MatIconModule, MatPaginatorModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'phone_number',
    'role',
    'actions',
  ];
  dataSource: User[] = [];
  totalCount: number = 0;
  pageSize: number = 10;
  pageChangeSubscription: any;
  tenantData: Tenant;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @Output() emitEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _apiService: ApiService, private route: ActivatedRoute) {
    this.tenantData = this.route.snapshot.data['tenantDetails'];
    // Initialization logic can go here
    this.loadUsers();
  }

  ngOnInit() {
    this.pageChangeSubscription = this.paginator?.page.subscribe(pageEvent => {
      this.pageSize = pageEvent.pageSize;
      this.loadUsers();
    });
  }

  ngAfterViewInit(): void {
    // Any additional initialization logic can go here
    // Pagination setup can be done here if needed
  }

  async loadUsers() {
    const tenantData = await this._apiService.get<UserResponse>(
      'user/company-admin',
      {
        tenant_id: this.tenantData.tenant_id,
      }
    );

    this.dataSource = tenantData.list;
    this.emitEvent.emit({ action: 'add_permission', value: false });
    this.totalCount = tenantData.pagination.count;
  }

  handleAction(action: string, user: User) {
    // Logic to handle edit action
    this.emitEvent.emit({ action: action, user });
  }
}
