import { Component } from '@angular/core';
import { StockListComponent } from '../stock-list/stock-list.component';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-stocks',
  imports: [SharedModule, StockListComponent],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css',
})
export class StocksComponent {
  onAddStock() {
    // Logic to open the add stock dialog or navigate to add stock page
  }
}
