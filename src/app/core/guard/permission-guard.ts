import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { PermissionService } from '../services/permission.service';
import { TenantConfigService } from '../services/tenant-config.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(
    private permissionService: PermissionService,
    private _tenantConfigService: TenantConfigService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const requiredPermission = route.data['permission'];
    await this.permissionService.init();
    return this._tenantConfigService.isAdmin()
      ? true
      : this.permissionService.checkAuth(requiredPermission);
  }
}
