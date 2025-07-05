import { Routes } from '@angular/router';
import { ProductHomeComponent } from './components/product-home/product-home.component';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    component: ProductHomeComponent,
    data: { title: 'Product Home' },
  },
];
