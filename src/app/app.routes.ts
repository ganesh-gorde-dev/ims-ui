import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { ResolverService } from './core/services/resolver.service';
import { PermissionGuard } from './core/guard/permission-guard';
import { PERMISSION_MODULE } from './shared/constant/db.constants';

export const routes: Routes = [
  {
    path: 'admin',
    component: MainLayoutComponent,
    resolve: { masterData: ResolverService },
    children: [
      {
        path: 'tenants',
        loadChildren: () =>
          import('./features/tenant/tenant.routes').then(m => m.TENANT_ROUTES),
        data: { title: 'Tenant' },
      },
    ],
  },
  {
    path: 'tenant',
    component: MainLayoutComponent,
    resolve: { masterData: ResolverService },
    children: [
      {
        path: 'product',
        loadChildren: () =>
          import('./features/products/product.routes').then(
            m => m.PRODUCT_ROUTES
          ),
        data: { title: 'Product', permission: PERMISSION_MODULE.PRODUCT },
        canActivate: [PermissionGuard],
      },
      {
        path: 'category',
        loadChildren: () =>
          import('./features/category/category.routes').then(
            m => m.CATEGORY_ROUTES
          ),
        data: { title: 'Category', permission: PERMISSION_MODULE.CATEGORY },
        canActivate: [PermissionGuard],
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('./features/user-management/user-management.routes').then(
            m => m.USER_MANAGEMENT_ROUTE
          ),
        data: { title: 'Category', permission: PERMISSION_MODULE.USER },
        canActivate: [PermissionGuard],
      },
      {
        path: 'stock',
        loadChildren: () =>
          import('./features/stock/stock.routes').then(m => m.STOCK_ROUTES),
        data: { title: 'Stock', permission: PERMISSION_MODULE.STOCK },
        canActivate: [PermissionGuard],
      },
      {
        path: 'supplier',
        loadChildren: () =>
          import('./features/supplier/supplier.routes').then(
            m => m.SUPPLIER_ROUTES
          ),
        data: { title: 'Stock', permission: PERMISSION_MODULE.SUPPLIER },
        canActivate: [PermissionGuard],
      },
      {
        path: 'role',
        loadChildren: () =>
          import('./features/role-management/role-management.routes').then(
            m => m.ROLE_MANAGEMENT_ROUTES
          ),
        data: {
          title: 'Role',
          permission: PERMISSION_MODULE.ROLE_PERMISSION,
        },
        canActivate: [PermissionGuard],
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./core/auth/auth.routes').then(m => m.AUTH_ROUTES),
        data: { title: 'Login' },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
