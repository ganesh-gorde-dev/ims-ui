import { Routes } from '@angular/router';
import { SupplierHomeComponent } from './components/supplier-home/supplier-home.component';

export const SUPPLIER_ROUTES: Routes = [
  {
    path: '',
    component: SupplierHomeComponent,
    data: { title: 'Supplier' },
  },
];
