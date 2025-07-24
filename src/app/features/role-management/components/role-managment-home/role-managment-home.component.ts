import { Component, OnDestroy, OnInit } from '@angular/core';
import { PermissionService } from '../../../../core/services/permission.service';
import { ApiService } from '../../../../core/services/api-interface.service';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../../../../shared/shared.module';
import { forkJoin, from, Observable, of } from 'rxjs';

@Component({
  selector: 'app-role-managment-home',
  imports: [SharedModule],
  templateUrl: './role-managment-home.component.html',
  styleUrl: './role-managment-home.component.css',
})
export class RoleManagmentHomeComponent implements OnInit, OnDestroy {
  permissions: any[] = [];
  mappings: any[] = [];
  roles: any[] = [];
  checkboxModel: { [permissionId: string]: { [role: string]: boolean } } = {};
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource();
  constructor(
    private _permissionService: PermissionService,
    private apiService: ApiService
  ) {
    this.roles = [
      { value: 'MANAGER', label: 'Manager' },
      { value: 'OPERATOR', label: 'Operator' },
    ];
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.permissions = this._permissionService.getPermissions();

    this.mappings = this._permissionService.getRolePermissions();

    this.displayedColumns = ['permission', ...this.roles.map(r => r.value)];

    this.buildCheckboxModel();
  }

  initialMappings: Set<string> = new Set(); // key: permission_id|role_id

  buildCheckboxModel() {
    this.checkboxModel = {};

    for (const perm of this.permissions) {
      this.checkboxModel[perm.permission_id] = {};
      for (const role of this.roles) {
        this.checkboxModel[perm.permission_id][role.value] = false;
      }
    }

    for (const map of this.mappings) {
      const key = `${map.permission_id}|${map.role_id}`;
      this.initialMappings.add(key);

      if (this.checkboxModel[map.permission_id]) {
        this.checkboxModel[map.permission_id][map.role_id] = true;
      }
    }
  }

  onCheckboxChange(permissionId: string, role: string, checked: boolean) {
    this.checkboxModel[permissionId][role] = checked;
  }

  saveChanges() {
    const additions: { permission_id: string; role_id: string }[] = [];
    const deleteRequests: Observable<any>[] = [];

    for (const perm of this.permissions) {
      for (const role of this.roles) {
        const checked = this.checkboxModel[perm.permission_id][role.value];
        const key = `${perm.permission_id}|${role.value}`;
        const originallyHad = this.initialMappings.has(key);

        if (checked && !originallyHad) {
          additions.push({
            permission_id: perm.permission_id,
            role_id: role.value,
          });
        }

        if (!checked && originallyHad) {
          const delete$ = from(
            this.deleteRolePermission(role.value, perm.permission_id)
          );
          deleteRequests.push(delete$);
        }
      }
    }

    const add$ =
      additions.length > 0 ? this.addRolePermissions(additions) : of(null);

    const delete$ =
      deleteRequests.length > 0 ? forkJoin(deleteRequests) : of(null);

    forkJoin([add$, delete$]).subscribe(() => {
      this.initialMappings.clear();
      this.loadData();
    });
  }

  addRolePermissions(payload: any) {
    return this.apiService.post('role-permission', payload);
  }

  deleteRolePermission(role_id: any, permission_id: any) {
    return this.apiService.delete<Observable<any>>(
      `role-permission/${role_id}/${permission_id}`
    );
  }

  ngOnDestroy(): void {
    this.initialMappings.clear();
  }
}
