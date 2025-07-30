import { NgModule } from '@angular/core';
// permission.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { ApiService } from './api-interface.service';
import {
  Permission,
  RolePermission,
  UserProfile,
} from '../../shared/models/global.model';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../features/tenant/models/tenant.model';
import { TenantConfigService } from './tenant-config.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private permissionsSubject = new BehaviorSubject<Permission[]>([]);
  permissions$ = this.permissionsSubject.asObservable();

  private rolePermissionsSubject = new BehaviorSubject<RolePermission[]>([]);
  rolePermissions$ = this.rolePermissionsSubject.asObservable();

  private userProfileSubject = new BehaviorSubject<UserProfile>(null as any);
  userProfile$ = this.userProfileSubject.asObservable();

  constructor(
    private _apiService: ApiService,
    private _tenantConfigService: TenantConfigService
  ) {}

  async init() {
    if (this.permissionsSubject.value.length === 0) {
      const permissions = await this._apiService.get<Permission[]>(
        'permission'
      );
      this.permissionsSubject.next(permissions);
    }
    if (
      !['SUPER_ADMIN', 'COMPANY_ADMIN'].includes(
        this.userProfileSubject.value.role_id
      )
    ) {
      const role_permissions = await this._apiService.get<RolePermission[]>(
        'role-permission'
      );
      this.rolePermissionsSubject.next(role_permissions);
    }
  }

  async user() {
    const userProfile = await this._apiService.get<UserProfile>('user/profile');
    this.userProfileSubject.next(userProfile);
    this.init();
  }

  // Call this after login or from resolver
  setPermissions(permissions: Permission[]) {
    this.permissionsSubject.next(permissions);
  }

  hasPermission(permissionId: string): boolean {
    if (
      this._tenantConfigService.isAdmin() ||
      this.userProfileSubject.value.role_id === 'COMPANY_ADMIN' ||
      this.userProfileSubject.value.role_id === 'SUPER_ADMIN'
    )
      return true;
    else
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
    const role = this.userProfileSubject.value.role_id;
    return this.rolePermissionsSubject.value.filter(
      perm => perm.role_id === role
    );
  }

  getUserDetails(): UserProfile {
    return this.userProfileSubject.value;
  }

  checkAuth(module: string): boolean {
    for (const permission of this.permissionsSubject.value) {
      if (permission.module === module) {
        return this.rolePermissionsSubject.value.some(
          rolePerm => rolePerm.permission_id === permission.permission_id
        );
      }
    }
    return false;
  }
}
