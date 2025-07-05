import { Routes } from '@angular/router';
import { CategoryHomeComponent } from './components/category-home/category-home.component';

export const CATEGORY_ROUTES: Routes = [
  {
    path: '',
    component: CategoryHomeComponent,
    data: { title: 'Category Home' },
  },
];
