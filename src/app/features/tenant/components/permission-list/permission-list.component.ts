import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {
  Permission,
  PermissionResponse,
  Tenant,
} from '../../models/tenant.model';
import { ApiService } from '../../../../core/services/api-interface.service';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-permission-list',
  imports: [SharedModule],
  templateUrl: './permission-list.component.html',
  styleUrl: './permission-list.component.css',
})
export class PermissionListComponent {
  displayedColumns: string[] = ['name', 'module', 'actions'];
  dataSource: Permission[] = [];
  tenantData: Tenant;
  constructor(private _apiService: ApiService, private route: ActivatedRoute) {
    this.tenantData = this.route.snapshot.data['tenantDetails'];
    this.loadPermissions();
  }

  async loadPermissions() {
    const tenantData = await this._apiService.get<Permission[]>(
      'admin/permission',
      {
        tenant_id: this.tenantData.tenant_id,
      }
    );
    this.dataSource = tenantData;
  }
}
