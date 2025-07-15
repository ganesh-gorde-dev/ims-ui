import {
  Component,
  Inject,
  TemplateRef,
  viewChild,
  ViewChild,
} from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { SupplierListComponent } from '../supplier-list/supplier-list.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../../core/services/api-interface.service';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-supplier-home',
  imports: [SharedModule, SupplierListComponent],
  templateUrl: './supplier-home.component.html',
  styleUrl: './supplier-home.component.css',
})
export class SupplierHomeComponent {
  addSupplierForm!: FormGroup;

  @ViewChild('addSupplierDialog') addSupplierDialog!: TemplateRef<any>;

  @ViewChild('deleteSupplierDialog') deleteSupplierDialog!: TemplateRef<any>;

  @ViewChild(SupplierListComponent)
  supplierListComponent!: SupplierListComponent;

  constructor(
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _apiService: ApiService
  ) {
    this.initializeForm();
  }

  initializeForm() {
    this.addSupplierForm = this._fb.group({
      supplierName: ['', Validators.required],
      supplierCode: ['', Validators.required],
    });
  }

  onAddSupplier() {
    this.addSupplierForm.reset();
    this.addSupplierForm.markAsUntouched();
    const dialogRef = this._dialog.open(this.addSupplierDialog, {
      width: '400px',
      data: { isEdit: false },
      autoFocus: false,
      restoreFocus: false,
      id: 'addSupplierDialog',
    });
  }

  onEmitEvent(event: any) {
    console.log('Event emitted from tenant list:', event);

    switch (event.action) {
      case 'edit':
        this.handleEditSupplier(event.supplier);
        break;
      case 'delete':
        this.handleDeleteSupplier(event.supplier);
        break;
      default:
        console.warn('Unknown event action:', event.action);
    }
  }

  closeDialog() {
    this._dialog.closeAll();
  }

  async onAddSupplierSave() {
    this.addSupplierForm.markAllAsTouched();
    if (this.addSupplierForm.valid) {
      // Handle form submission
      const payload = {
        supplier_name: this.addSupplierForm.value.supplierName,
        supplier_code: this.addSupplierForm.value.supplierCode,
      };

      const supplier = await this._apiService.post('supplier', payload);
      this.addSupplierForm.reset();
      this.closeDialog();
      this.supplierListComponent.loadSuppliers();
    }
  }

  async onEditSupplier() {
    this.addSupplierForm.markAllAsTouched();
    if (this.addSupplierForm.valid) {
      // Handle form submission

      const payload = {
        supplier_name: this.addSupplierForm.value.supplierName,
        supplier_code: this.addSupplierForm.value.supplierCode,
      };
      const supplierId = this.dialogData.supplier.supplier_id;

      const supplier = await this._apiService.put(
        `supplier/${supplierId}`,
        payload
      );
      this.addSupplierForm.reset();
      this.supplierListComponent.loadSuppliers();
      this.closeDialog();
    }
  }

  dialogData: any;
  handleEditSupplier(supplier: any) {
    this.dialogData = { isEdit: true, supplier };
    // Handle edit supplier logic
    this.addSupplierForm.patchValue({
      supplierName: supplier.supplier_name,
      supplierCode: supplier.supplier_code,
    });

    const dialogRef = this._dialog.open(this.addSupplierDialog, {
      width: '600px',
      data: this.dialogData,
      id: 'editSupplierDialog',
      autoFocus: false,
      restoreFocus: false,
    });
  }

  selectedSupplier!: Supplier;
  handleDeleteSupplier(supplier: any) {
    // Handle delete supplier logic
    this.selectedSupplier = supplier;
    this._dialog.open(this.deleteSupplierDialog, {
      width: '400px',
      id: 'deleteSupplierDialog',
      autoFocus: false,
      restoreFocus: false,
    });
    console.log('Deleting supplier:', supplier);
  }

  async onDeleteSupplier() {
    // Handle delete supplier logic
    await this._apiService.delete(
      `supplier/${this.selectedSupplier.supplier_id}`
    );
    this.closeDialog();
  }
}
