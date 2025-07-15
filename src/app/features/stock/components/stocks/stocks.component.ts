import { Stock, StockPayload } from './../../models/stock.model';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { StockListComponent } from '../stock-list/stock-list.component';
import { SharedModule } from '../../../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Product,
  ProductResponse,
} from '../../../products/models/product.model';
import {
  Supplier,
  SupplierResponse,
} from '../../../supplier/models/supplier.model';
import { ApiService } from '../../../../core/services/api-interface.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-stocks',
  imports: [SharedModule, StockListComponent],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css',
})
export class StocksComponent {
  addStockForm!: FormGroup;
  arrProducts: Product[] = [];
  arrSuppliers: Supplier[] = [];

  @ViewChild('addStockDialog') addStockDialog!: TemplateRef<any>;
  @ViewChild('deleteStockDialog') deleteStockDialog!: TemplateRef<any>;

  @ViewChild(StockListComponent)
  stockListComponent!: StockListComponent;

  constructor(
    private _fb: FormBuilder,
    private _apiService: ApiService,
    private _dialog: MatDialog
  ) {
    // Initialization logic can go here
    this.initializeForm();
    this.getFieldData();
  }

  async getFieldData() {
    // Logic to fetch products from the API
    const products = await this._apiService.get<ProductResponse>('product', {
      ispagination: false,
    });
    this.arrProducts = products.list;

    const suppliers = await this._apiService.get<SupplierResponse>('supplier', {
      ispagination: false,
    });
    this.arrSuppliers = suppliers.list;
  }
  initializeForm() {
    this.addStockForm = this._fb.group({
      productId: ['', Validators.required],
      supplierId: ['', Validators.required],
      movementType: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onAddStock() {
    this.addStockForm.reset();
    this.addStockForm.markAsUntouched();
    // Logic to open the add stock dialog or navigate to add stock page
    this._dialog.open(this.addStockDialog, {
      width: '400px',
      autoFocus: false,
      restoreFocus: false,
      id: 'addStockDialog',
    });
  }

  async onAddStockSave() {
    this.addStockForm.markAllAsTouched();
    if (this.addStockForm.valid) {
      // Logic to save the new stock
      const payload: StockPayload = {
        product_id: this.addStockForm.value.productId,
        supplier_id: this.addStockForm.value.supplierId,
        movement_type: this.addStockForm.value.movementType,
        price: this.addStockForm.value.price,
        quantity: this.addStockForm.value.quantity,
      };
      await this._apiService.post('stock', payload);

      this.addStockForm.reset();
      this.stockListComponent.loadStocks();
      this._dialog.closeAll();
    }
  }

  onEmitEvent(event: any) {
    console.log('Event emitted from tenant list:', event);

    switch (event.action) {
      case 'delete':
        this.handleDeleteStock(event.stock);
        break;
      default:
        console.warn('Unknown event action:', event.action);
    }
  }

  selectedStock!: Stock;
  handleDeleteStock(stock: Stock) {
    this.selectedStock = stock;
    // Logic to delete the selected stock
    this._dialog.open(this.deleteStockDialog, {
      width: '400px',
      id: 'deleteStockDialog',
      autoFocus: false,
      restoreFocus: false,
    });
  }

  async onDeleteStock() {
    // Logic to delete the selected stock
    await this._apiService.delete(`stock/${this.selectedStock.stock_id}`);
    this._dialog.closeAll();
    this.stockListComponent.loadStocks();
  }
}
