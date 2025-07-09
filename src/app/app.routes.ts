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
