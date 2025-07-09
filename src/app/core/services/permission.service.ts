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
    this.permissionsSubject.next(permissions);
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

  getPermissions(): string[] {
    return this.permissionsSubject.value.map(
      permission => permission.permission_id
    );
  }

  checkAuth(module: string) {
    return this.permissionsSubject.value.some(
      permission => permission.module === module
    );
  }
}
