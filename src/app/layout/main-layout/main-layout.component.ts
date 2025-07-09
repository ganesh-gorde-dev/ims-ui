import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api-interface.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { Subject, filter, map, mergeMap, takeUntil } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { TenantConfigService } from '../../core/services/tenant-config.service';

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
  standalone: true,
})
export class MainLayoutComponent implements OnDestroy {
  title = '';
  private destroy$ = new Subject<void>();
  isAdminLogin = true;
  navLinks = [
    {
      label: 'Product',
      path: '/tenant/product',
      icon: 'shopping_cart',
    },
    {
      label: 'Category',
      path: '/tenant/category',
      icon: 'category',
    },
  ];

  constructor(
    public _themeService: ThemeService,
    public _router: Router,
    private _apiService: ApiService,
    private _route: ActivatedRoute,
    private _spinnerService: SpinnerService,
    private _tenantConfigService: TenantConfigService
  ) {
    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.getDeepestChild(this._route);
        this.title = child.snapshot.data['title'] ?? 'IMS';
      });
    const subdomain = window.location.hostname.split('.')[0];
    if (subdomain === 'localhost') {
      this.isAdminLogin = true;
    } else {
      this.isAdminLogin = false;
    }
  }

  private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  redirectToPage() {
    this._tenantConfigService.isAdmin()
      ? this._router.navigate(['/admin/tenants'])
      : this._router.navigate(['/tenant/product']);
  }

  async logout() {
    this._spinnerService.show();
    await this._apiService.delete('auth/admin/logout');
    console.log('LOGOUT');

    localStorage.removeItem('authToken');
    this._router.navigate(['/']);
  }
}
