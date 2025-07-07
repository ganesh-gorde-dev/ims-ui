import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TenantListComponent } from '../tenant-list/tenant-list.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from '../../../../core/services/api-interface.service';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { DialogData, Tenant, TenantPayload } from '../../models/tenant.model';

@Component({
  selector: 'app-tenant-home',
  imports: [
    TenantListComponent,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './tenant-home.component.html',
  styleUrl: './tenant-home.component.css',
  standalone: true,
})
export class TenantHomeComponent {
  @ViewChild('addTenantDialog') addTenantDialog!: TemplateRef<any>;
  @ViewChild('deleteTenantDialog') deleteTenantDialog!: TemplateRef<any>;
  @ViewChild(TenantListComponent) tenantListComponent!: TenantListComponent;

  addTenantForm!: FormGroup;
  selectedTenant!: Tenant;
  dialogData: DialogData = { isEdit: false };

  constructor(
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    private _apiService: ApiService,
    private _router: Router
  ) {
    this.initializeForm();
  }

  initializeForm() {
    this.addTenantForm = this._fb.group({
      tenantCode: ['', [Validators.required]],
      tenantName: ['', [Validators.required]],
    });
  }

  onAddTenant() {
    this.dialogData = { isEdit: false };
    const dialogRef = this._dialog.open(this.addTenantDialog, {
      width: '600px',
      data: this.dialogData,
      id: 'addTenantDialog',
    });

    this.addTenantForm.reset();
    this.addTenantForm.markAsUntouched();

    dialogRef.afterClosed().subscribe(async result => {});
  }

  async onAddTenantSave() {
    this.addTenantForm.markAllAsTouched();
    if (this.addTenantForm.valid) {
      const tenantData: TenantPayload = {
        tenant_code: this.addTenantForm.value.tenantCode,
        tenant_name: this.addTenantForm.value.tenantName,
      };

      // if (this.dialogData.isEdit && this.dialogData.tenant) {
      //   // Update existing tenant
      //   await this._apiService.put(
      //     `tenant/${this.dialogData.tenant.tenant_id}`,
      //     tenantData
      //   );
      //   this.addTenantForm.reset();
      //   this._dialog.closeAll();
      //   this.tenantListComponent.loadTenants();
      // } else {
      // Add new tenant
      await this._apiService.post('tenant', tenantData);
      this.addTenantForm.reset();
      this._dialog.closeAll();
      this.tenantListComponent.loadTenants();
      // }
    }
  }

  handleEditTenant(tenant: Tenant) {
    this.dialogData = { isEdit: true, tenant };

    this.addTenantForm.patchValue({
      tenantCode: tenant.tenant_code,
      tenantName: tenant.tenant_name,
    });

    const dialogRef = this._dialog.open(this.addTenantDialog, {
      width: '600px',
      data: this.dialogData,
      id: 'addTenantDialog',
    });
  }

  async onEditTenant() {
    this.addTenantForm.markAllAsTouched();
    if (this.addTenantForm.valid) {
      const tenantData: TenantPayload = {
        tenant_code: this.addTenantForm.value.tenantCode,
        tenant_name: this.addTenantForm.value.tenantName,
      };

      // Update existing tenant
      await this._apiService.put<Tenant>(
        `tenant/${this.dialogData.tenant!.tenant_id}`,
        tenantData
      );
      this.addTenantForm.reset();
      this._dialog.closeAll();
      this.tenantListComponent.loadTenants();
    }
  }

  onSubmit() {}

  onEmitEvent(event: any) {
    console.log('Event emitted from tenant list:', event);

    switch (event.action) {
      case 'edit':
        this.handleEditTenant(event.tenant);
        break;
      case 'delete':
        this.handleDeleteTenant(event.tenant);
        break;
      case 'view':
        this.handleViewTenant(event.tenant);
        break;
      default:
        console.warn('Unknown event action:', event.action);
    }
  }

  handleDeleteTenant(tenant: Tenant) {
    this.selectedTenant = tenant;
    const dialogRef = this._dialog.open(this.deleteTenantDialog, {
      width: '400px',
    });
  }

  async onDeleteTenant() {
    await this._apiService.delete(`tenant/${this.selectedTenant.tenant_id}`);
    this.onDialogClose();
    this.tenantListComponent.loadTenants();
  }

  handleViewTenant(tenant: Tenant) {
    // Logic to handle view action
    this._router.navigate(['home/tenant', tenant.tenant_id]);
  }

  onDialogClose() {
    this._dialog.closeAll();
  }
}
