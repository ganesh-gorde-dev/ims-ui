import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { ResolverService } from './core/services/resolver.service';

export const routes: Routes = [
  {
    path: 'home',
    component: MainLayoutComponent,
    children: [
      {
        path: 'tenant',
        loadChildren: () =>
          import('./features/tenant/tenant.routes').then(m => m.TENANT_ROUTES),
        resolve: { masterData: ResolverService },
        data: { title: 'Tenant' },
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./features/products/product.routes').then(
            m => m.PRODUCT_ROUTES
          ),
        data: { title: 'Product' },
      },
      {
        path: 'category',
        loadChildren: () =>
          import('./features/category/category.routes').then(
            m => m.CATEGORY_ROUTES
          ),
        data: { title: 'Category' },
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
