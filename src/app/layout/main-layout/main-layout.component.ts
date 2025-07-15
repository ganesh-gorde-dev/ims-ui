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
import { NotificationItem } from '../../shared/models/global.model';
import { NotificationService } from '../../core/services/notification.service';

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
    {
      label: 'User Management',
      path: '/tenant/user-management',
      icon: 'group',
    },
    {
      label: 'Stock',
      path: '/tenant/stock',
      icon: 'inventory_2',
    },
    {
      label: 'Supplier',
      path: '/tenant/supplier',
      icon: 'delivery_truck_bolt',
    },
    // {
    //   label: 'Roles & Permission',
    //   path: '/tenant/roles-permission',
    //   icon: 'passkey',
    // },
    // {
    //   label: 'Reports',
    //   path: '/tenant/reports',
    //   icon: 'finance_mode',
    // },
    // {
    //   label: 'Audit Logs',
    //   path: '/tenant/audit-logs',
    //   icon: 'deployed_code_history',
    // },
  ];

  notifications: NotificationItem[] = [];
  unreadCount = 0;
  private sub!: Subscription;

  constructor(
    public _themeService: ThemeService,
    public _router: Router,
    private _apiService: ApiService,
    private _route: ActivatedRoute,
    private _spinnerService: SpinnerService,
    private _tenantConfigService: TenantConfigService,
    private _notificationService: NotificationService
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

  ngOnInit(): void {
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
