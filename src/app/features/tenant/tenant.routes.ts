import { Routes } from '@angular/router';
import { TenantHomeComponent } from './components/tenant-home/tenant-home.component';
import { TenantDetailsComponent } from './components/tenant-details/tenant-details.component';
import { TenantDetailService } from './services/tenant-detail.service';

export const TENANT_ROUTES: Routes = [
  {
    path: '',
    component: TenantHomeComponent,
    data: { title: 'Tenant Home' },
  },
  {
    path: ':id',
    component: TenantDetailsComponent,
    resolve: { tenantDetails: TenantDetailService },
    data: { title: 'Tenant Details' },
  },
];
