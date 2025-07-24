// permission.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { ApiService } from './api-interface.service';
import { Permission, RolePermission } from '../../shared/models/global.model';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private permissionsSubject = new BehaviorSubject<Permission[]>([]);
  permissions$ = this.permissionsSubject.asObservable();

  private rolePermissionsSubject = new BehaviorSubject<RolePermission[]>([]);
  rolePermissions$ = this.rolePermissionsSubject.asObservable();

  constructor(
    private _apiService: ApiService,
    private _route: ActivatedRoute
  ) {}

  async init() {
    const permissions = await this._apiService.get<Permission[]>('permission');

    const role_permissions = await this._apiService.get<RolePermission[]>(
      'role-permission'
    );

    // compare both object and filetr out permission which have permission_id in role permissions.

    this.permissionsSubject.next(permissions);

    this.rolePermissionsSubject.next(role_permissions);
  }

  // Call this after login or from resolver
  setPermissions(permissions: Permission[]) {
    this.permissionsSubject.next(permissions);
  }

  hasPermission(permissionId: string): boolean {
    return this.permissionsSubject.value.some(
      permission => permission.permission_id === permissionId
    );
  }

  getPermissions(): Permission[] {
    return this.permissionsSubject.value;
  }

  getRolePermissions(): RolePermission[] {
    return this.rolePermissionsSubject.value;
  }

  getCurrentRolePermissions(): RolePermission[] {
    const role = 'MANAGER';
    return this.rolePermissionsSubject.value.filter(
      perm => perm.role_id === role
    );
  }

  checkAuth(module: string) {
    return this.permissionsSubject.value.some(
      permission => permission.module === module
    );
  }
}
