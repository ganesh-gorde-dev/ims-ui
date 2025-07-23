// permission.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { ApiService } from './api-interface.service';
import { Permission } from '../../shared/models/global.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private permissionsSubject = new BehaviorSubject<Permission[]>([]);
  permissions$ = this.permissionsSubject.asObservable();

  constructor(private _apiService: ApiService) {}

  async init() {
    const permissions = await this._apiService.get<Permission[]>('permission');

    const role_permissions = await this._apiService.get<Permission[]>(
      'role-permission'
    );

    // compare both object and filetr out permission which have permission_id in role permissions.
    const filteredPermissions = permissions.filter(permission => {
      return role_permissions.some(
        rolePermission =>
          rolePermission.permission_id === permission.permission_id
      );
    });

    this.permissionsSubject.next(filteredPermissions);
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

  checkAuth(module: string) {
    return this.permissionsSubject.value.some(
      permission => permission.module === module
    );
  }
}
