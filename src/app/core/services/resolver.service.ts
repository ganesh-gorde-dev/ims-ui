import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ApiService } from './api-interface.service';
import { forkJoin } from 'rxjs';
import { MasterData, UserProfile } from '../../shared/models/global.model';
import { TenantConfigService } from './tenant-config.service';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class ResolverService implements Resolve<any> {
  constructor(
    private _apiService: ApiService,
    private tenantConfigService: TenantConfigService,
    private _permissionService: PermissionService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.fetchMasterData();
  }

  fetchMasterData() {
    // If get() returns Observables, use forkJoin to aggregate them
    // If get() returns Promises, use Promise.all instead
    // Here, assuming get() returns Observables:
    this.tenantConfigService.isAdmin()
      ? of(null)
      : this._permissionService.init();

    return forkJoin({
      choices: this._apiService.get<MasterData[]>('choices'),
      userProfile: this.tenantConfigService.isAdmin()
        ? of(null)
        : this._apiService.get<UserProfile>('user/profile'),
    });
  }
}
