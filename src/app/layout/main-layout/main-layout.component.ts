import { NAV_LINKS, PERMISSION } from './../../shared/constant/db.constants';
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
import { Subject, Subscription, filter, map, mergeMap, takeUntil } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { TenantConfigService } from '../../core/services/tenant-config.service';
import {
  NotificationItem,
  Permission,
  RolePermission,
} from '../../shared/models/global.model';
import { NotificationService } from '../../core/services/notification.service';
import { PermissionService } from '../../core/services/permission.service';

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
export class MainLayoutComponent implements OnInit, OnDestroy {
  title = '';
  private destroy$ = new Subject<void>();
  isAdminLogin = true;
  navLinks: { label: string; icon: string; path: string; module: string }[];

  notifications: NotificationItem[] = [];
  unreadCount = 0;
  private sub!: Subscription;
  isAdmin: boolean = false;
  PERMISSION = PERMISSION;
  constructor(
    public _themeService: ThemeService,
    public _router: Router,
    private _apiService: ApiService,
    private _route: ActivatedRoute,
    private _spinnerService: SpinnerService,
    private _tenantConfigService: TenantConfigService,
    private _notificationService: NotificationService,
    private _permissionService: PermissionService
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

    const allpermissions = _permissionService.getPermissions();
    console.log(allpermissions);
    const permissions = (
      this._permissionService.getRolePermissions() as RolePermission[]
    ).map(permission => {
      return allpermissions.filter(
        perm => perm.permission_id === permission.permission_id
      )[0].module;
    });
    if (
      _tenantConfigService.isAdmin() ||
      _permissionService.getUserDetails().role_id === 'COMPANY_ADMIN' ||
      _permissionService.getUserDetails().role_id === 'SUPER_ADMIN'
    )
      this.navLinks = NAV_LINKS;
    else
      this.navLinks = NAV_LINKS.filter(nav => {
        return permissions.includes(nav.module);
      });
    console.log(this.navLinks);
    this.isAdmin = this._tenantConfigService.isAdmin();
  }

  ngOnInit(): void {
    if (this.hasPermission(PERMISSION.GET_NOTIFICATION))
      this.initializeNotifications();
  }

  initializeNotifications() {
    const notifications: any = this._notificationService.getNotifications();

    this.notifications = notifications;

    this.sub = this._notificationService.notifications$.subscribe(latest => {
      this.notifications = latest;
    });
  }

  async onNotificationClick(notif: NotificationItem): Promise<void> {
    await this._notificationService.markAsRead(
      notif.notification.notification_id
    );
    // Example: navigate to stock detail
    if (notif.notification.notification_type === 'STOCK_IN') {
      const stockId = notif.notification.notification_data?.stock_id;
      this._router.navigate(['/stock/detail', stockId]);
    }
  }

  private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  hasPermission(id: string) {
    return this._permissionService.hasPermission(id);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.sub?.unsubscribe();
    this._notificationService.disconnectSocket();
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
