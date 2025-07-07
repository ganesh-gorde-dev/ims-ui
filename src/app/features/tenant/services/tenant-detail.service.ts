import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api-interface.service';

@Injectable({
  providedIn: 'root',
})
export class TenantDetailService implements Resolve<any> {
  constructor(private _apiService: ApiService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    const id = route.params['id'];
    return this.getTenantById(id);
  }

  getTenantById(id: string): Promise<any> {
    return this._apiService.get(`tenant/${id}`);
  }
}
