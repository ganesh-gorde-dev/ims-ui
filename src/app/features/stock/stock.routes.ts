import { Routes } from '@angular/router';
import { StocksComponent } from './components/stocks/stocks.component';

export const STOCK_ROUTES: Routes = [
  {
    path: '',
    component: StocksComponent,
    data: { title: 'Stock' },
  },
];
