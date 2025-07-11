import { Product, ProductDialog } from './../../models/product.model';
import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProductListComponent } from '../product-list/product-list.component';
import { ApiService } from '../../../../core/services/api-interface.service';
import { ProductPayload } from '../../models/product.model';
import {
  Category,
  CategoryResponse,
} from '../../../category/models/category.model';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-product-home',
  imports: [SharedModule, ProductListComponent],
  templateUrl: './product-home.component.html',
  styleUrl: './product-home.component.css',
})
export class ProductHomeComponent {
  @ViewChild(ProductListComponent)
  productListComponent!: ProductListComponent;

  @ViewChild('addProductDialog') addProductDialog!: TemplateRef<any>;

  addProductForm!: FormGroup;
  arrCategories!: Category[];
  constructor(
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    private _apiService: ApiService
  ) {
    this.initializeForm();
    this.getCategories();
  }

  initializeForm() {
    this.addProductForm = this._fb.group({
      categoryId: ['', Validators.required],
      productCode: ['', Validators.required],
      productName: ['', Validators.required],
      sellPrice: ['', Validators.required],
      purchasePrice: ['', Validators.required],
    });
  }

  async getCategories() {
    const categories = await this._apiService.get<CategoryResponse>(
      'category',
      { pagination: false }
    );
    this.arrCategories = categories.list;
  }

  dialogData: ProductDialog = { isEdit: false };
  onAddProduct() {
    this.dialogData = { isEdit: false };
    const dialogRef = this._dialog.open(this.addProductDialog, {
      width: '600px',
      id: 'addProductDialog',
      autoFocus: false,
      restoreFocus: false,
    });

    this.addProductForm.reset();
    this.addProductForm.markAsUntouched();
  }

  async onAddProductSave() {
    this.addProductForm.markAllAsTouched();
    if (this.addProductForm.valid) {
      const formValues = this.addProductForm.value;

      const productPayload: ProductPayload = {
        category_id: formValues.categoryId,
        product_code: formValues.productCode,
        product_name: formValues.productName,
        sell_price: formValues.sellPrice,
        purchase_price: formValues.purchasePrice,
      };

      await this._apiService.post(`product`, productPayload);
      this.addProductForm.reset();
      this._dialog.closeAll();
      this.productListComponent.loadProducts();
    }
  }

  async onEditProduct() {
    this.addProductForm.markAllAsTouched();
    if (this.addProductForm.valid) {
      const formValues = this.addProductForm.value;
      const productPayload: ProductPayload = {
        category_id: formValues.categoryId,
        product_code: formValues.productCode,
        product_name: formValues.productName,
        sell_price: formValues.sellPrice,
        purchase_price: formValues.purchasePrice,
      };

      // Update existing tenant
      await this._apiService.put<Product>(
        `product/${this.dialogData.product!.product_id}`,
        productPayload
      );
      this.addProductForm.reset();
      this._dialog.closeAll();
      this.productListComponent.loadProducts();
    }
  }

  async onDeleteProduct() {
    await this._apiService.delete(`product/${this.selectedProduct.product_id}`);
    this._dialog.closeAll();
    this.productListComponent.loadProducts();
  }

  onEmitEvent(event: any) {
    console.log('Event emitted from tenant list:', event);

    switch (event.action) {
      case 'edit':
        this.handleEditProduct(event.product);
        break;
      case 'delete':
        this.handleDeleteProduct(event.product);
        break;
      default:
        console.warn('Unknown event action:', event.action);
    }
  }

  handleEditProduct(product: Product) {
    this.dialogData = { isEdit: true, product };

    this.addProductForm.patchValue({
      categoryId: product.category_id,
      productCode: product.product_code,
      productName: product.product_name,
      sellPrice: product.sell_price,
      purchasePrice: product.purchase_price,
    });

    const dialogRef = this._dialog.open(this.addProductDialog, {
      width: '600px',
      data: this.dialogData,
      id: 'addTenantDialog',
      autoFocus: false,
      restoreFocus: false,
    });
  }

  selectedProduct!: Product;
  @ViewChild('deleteProductDialog') deleteProductDialog!: TemplateRef<any>;
  handleDeleteProduct(product: Product) {
    this.selectedProduct = product;
    const dialogRef = this._dialog.open(this.deleteProductDialog, {
      width: '400px',
      autoFocus: false,
      restoreFocus: false,
      id: 'deleteProductDialog',
    });
  }
}
