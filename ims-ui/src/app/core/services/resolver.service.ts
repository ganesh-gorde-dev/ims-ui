import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api-interface.service';

@Injectable({
  providedIn: 'root',
})
export class ResolverService implements Resolve<any> {
  constructor(private _apiService: ApiService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.fetchMasterData();
  }

  fetchMasterData() {
    return this._apiService.get('choices');
  }
}
