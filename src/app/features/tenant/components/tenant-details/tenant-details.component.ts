import {
  TenantConfiguration,
  TenantDetails,
  User,
} from './../../models/tenant.model';
import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api-interface.service';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MasterData } from '../../../../shared/models/global.model';
import { MASTER_DATA } from '../../../../shared/constant/db.constants';
import { SharedModule } from '../../../../shared/shared.module';
import { PermissionListComponent } from '../permission-list/permission-list.component';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-tenant-details',
  imports: [SharedModule, PermissionListComponent, UserListComponent],
  templateUrl: './tenant-details.component.html',
  styleUrl: './tenant-details.component.css',
})
export class TenantDetailsComponent implements OnInit, AfterViewInit {
  tenantData: any; // This will hold the tenant details fetched by the resolver
  masterData: { [key: string]: MasterData[] };
  isAddPermission = true;
  constructor(
    private route: ActivatedRoute,
    private _apiService: ApiService,
    private _fb: FormBuilder,
    private _dialog: MatDialog
  ) {
    this.tenantData = this.route.snapshot.data['tenantDetails'];
    const parentRouteWithData = this.route.pathFromRoot.find(
      r => r.snapshot.data['masterData']
    );

    this.masterData = parentRouteWithData?.snapshot.data['masterData'].choices;
    this.arrDatabaseStrategyTypes =
      this.masterData[MASTER_DATA.DATABASE_STRATEGY_TYPES];
    this.arrAuthenticationTypes =
      this.masterData[MASTER_DATA.AUTHENTICATION_TYPES];
    this.arrDatabaseServer = this.masterData[MASTER_DATA.DB_SERVER];
    this.arrRoles = this.masterData[MASTER_DATA.ROLE_TYPES];
  }
  @ViewChild('addConfigurationDialog')
  addConfigurationDialog!: TemplateRef<any>;
  @ViewChild('addUserDialog')
  addUserDialog!: TemplateRef<any>;

  @ViewChild(PermissionListComponent)
  permissionListComponent!: PermissionListComponent;

  @ViewChild(UserListComponent)
  userListComponent!: UserListComponent;

  configurationForm!: FormGroup;
  userForm!: FormGroup;
  tenantDetails: TenantDetails | null = null;
  tenantConfiguration: TenantConfiguration | null = null;
  arrDatabaseStrategyTypes: MasterData[];
  arrAuthenticationTypes: MasterData[];
  arrDatabaseServer: MasterData[];
  arrRoles: MasterData[];

  ngOnInit(): void {
    // Any additional initialization logic can go here
    this.getTenantConfiguration();
    this.getTenantDetails();
    this.initializeForm();
  }

  ngAfterViewInit(): void {}

  onBack() {
    window.history.back();
  }

  onTabChange(event: MatTabChangeEvent) {
    switch (event.tab.textLabel) {
      case 'Configuration':
        this.getTenantConfiguration();
        break;
      case 'Permission':
        this.permissionListComponent.loadPermissions();
        break;
      case 'User':
        this.userListComponent.loadUsers();
        break;
      default:
        console.warn('Unknown tab index:', event.index);
    }
  }

  onEmitEvent(event: any) {
    console.log(event);
    switch (event.action) {
      case 'add_permission':
        this.isAddPermission = event.value;
        break;
      case 'edit':
        this.handleEditUser(event.user);
        break;
      case 'delete':
        this.handleDeleteUser(event.user);
        break;
      default:
        console.warn('Unknown event action:', event.action);
    }
  }

  initializeForm() {
    this.configurationForm = this._fb.group({
      databaseStrategy: ['', Validators.required],
      authenticationType: ['', Validators.required],
      databaseServer: ['', Validators.required],
      // Add other form controls as needed
    });
    this.configurationForm
      .get('databaseServer')
      ?.valueChanges.subscribe(value => {
        if (value === 'POSTGRES') {
          this.addPostgresControls();
        } else {
          this.removePostgresControls();
        }
      });

    this.userForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone_number: [
        null,
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      role_id: ['', Validators.required],
      last_name: ['', Validators.required],
      first_name: ['', Validators.required],
      profile_photo: [''],
      password: ['', Validators.required],
    });
  }

  addPostgresControls() {
    const controls = this.configurationForm.controls;
    if (!controls['username']) {
      this.configurationForm.addControl(
        'username',
        this._fb.control('', Validators.required)
      );
    }
    if (!controls['password']) {
      this.configurationForm.addControl(
        'password',
        this._fb.control('', Validators.required)
      );
    }
    if (!controls['host']) {
      this.configurationForm.addControl(
        'host',
        this._fb.control('', Validators.required)
      );
    }
    if (!controls['port']) {
      this.configurationForm.addControl(
        'port',
        this._fb.control('', [Validators.required, Validators.min(0)])
      );
    }
    if (!controls['options']) {
      this.configurationForm.addControl('options', this._fb.control(''));
    }
    if (!controls['database_name']) {
      this.configurationForm.addControl(
        'database_name',
        this._fb.control('', Validators.required)
      );
    }
  }

  removePostgresControls() {
    [
      'username',
      'password',
      'host',
      'port',
      'options',
      'database_name',
    ].forEach(ctrl => {
      if (this.configurationForm.contains(ctrl)) {
        this.configurationForm.removeControl(ctrl);
      }
    });
  }

  async getTenantConfiguration() {
    // Logic to fetch tenant configuration
    // This could be a service call to get the configuration details
    const tenantId = this.tenantData.tenant_id; // Assuming tenant_code is used to fetch configuration
    const tenantConfig = await this._apiService.get<TenantConfiguration>(
      `tenant/${tenantId}/configuration`
    );

    if (tenantConfig) {
      this.tenantConfiguration = tenantConfig;
      this.editMode = true;
    }
  }

  editMode = false;
  async getTenantDetails() {
    // Logic to fetch tenant details
    // This could be a service call to get the tenant details
    const tenantCode = this.tenantData.tenant_code; // Assuming tenant_code is used to fetch details
    const tenantDetails = await this._apiService.get<TenantDetails>(
      `tenant/${tenantCode}/details`
    );

    if (tenantDetails) {
      this.tenantDetails = tenantDetails;
    }
  }

  onAddUser() {
    // Open a dialog or form to add user
    const dialogRef = this._dialog.open(this.addUserDialog, {
      width: '800px',
      autoFocus: false,
      restoreFocus: false,
      id: 'addUserDialog',
    });
  }

  async onAddUserSave() {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      // Logic to handle form submission
      const formValue = this.userForm.value;
      const payload = {
        email: formValue.email,
        phone_number: formValue.phone_number,
        role_id: formValue.role_id,
        last_name: formValue.last_name,
        first_name: formValue.first_name,
        password: formValue.password,
        tenant_id: this.tenantData.tenant_id,
      };

      await this._apiService.post<User>(`user/company-admin`, payload);
      this._dialog.closeAll();
      this.userListComponent.loadUsers();
    }
  }

  onAddConfiguration() {
    // Open a dialog or form to add configuration
    this.initializeForm();
    const dialogRef = this._dialog.open(this.addConfigurationDialog, {
      width: '600px',
      autoFocus: false,
      restoreFocus: false,
      id: 'addConfigurationDialog',
    });
    if (this.editMode) {
      this.configurationForm.patchValue({
        databaseStrategy: this.tenantConfiguration?.database_strategy,
        authenticationType: this.tenantConfiguration?.authentication_type,
        databaseServer: this.tenantConfiguration?.database_server,
        username: this.tenantConfiguration?.database_config?.username,
        password: this.tenantConfiguration?.database_config?.password,
        host: this.tenantConfiguration?.database_config?.host,
        port: this.tenantConfiguration?.database_config?.port,
        options: this.tenantConfiguration?.database_config?.options,
        database_name: this.tenantConfiguration?.database_config,
      });
    }
  }

  async onAddConfigurationSave() {
    this.configurationForm.markAllAsTouched();
    if (this.configurationForm.valid) {
      // Logic to handle form submission
      const formValue = this.configurationForm.value;
      const configurationData: TenantConfiguration = {
        database_strategy: formValue.databaseStrategy,
        authentication_type: formValue.authenticationType,
        database_server: formValue.databaseServer,
        database_config:
          formValue.databaseServer === 'POSTGRES'
            ? {
                username: formValue.username,
                password: formValue.password,
                host: formValue.host,
                port: formValue.port,
                options: formValue.options,
                database_name: formValue.database_name,
              }
            : undefined,
      };
      await this._apiService.post<TenantConfiguration>(
        `tenant/${this.tenantData.tenant_id}/configuration`,
        configurationData
      );

      this._dialog.closeAll();
      this.getTenantConfiguration();
    }
  }

  async onAddPermission() {
    const payload = {
      tenant_id: this.tenantData.tenant_id,
    };
    await this._apiService.post<any>(`admin/permission`, payload);

    this.permissionListComponent.loadPermissions();
  }

  handleEditUser(user: any) {
    // Logic to handle edit user
    this.userForm.patchValue({
      email: user.email,
      phone_number: user.phone_number,
      role_id: user.role_id,
      last_name: user.last_name,
      first_name: user.first_name,
      profile_photo: user.profile_photo,
    });

    const dialogRef = this._dialog.open(this.addUserDialog, {
      width: '800px',
      data: { isEdit: true, user },
      id: 'editUserDialog',
      autoFocus: false,
      restoreFocus: false,
    });
  }

  selectedUser!: User;
  @ViewChild('deleteUserDialog') deleteUserDialog!: TemplateRef<any>;
  handleDeleteUser(user: User) {
    this.selectedUser = user;
    // Logic to handle delete user
    this._dialog.open(this.deleteUserDialog, {
      width: '400px',
      id: 'deleteUserDialog',
      autoFocus: false,
      restoreFocus: false,
    });
  }

  async onDeleteUser() {
    // Logic to delete the selected user
    const userId = this.selectedUser.user_id; // Assuming user_id is part of the form
    await this._apiService.delete(`user/${userId}`);
    this._dialog.closeAll();
    this.userListComponent.loadUsers();
  }

  async onAddPermissionSave() {
    // Logic to save the new permission
    const payload = {
      tenant_id: this.tenantData.tenant_id,
    };
    await this._apiService.post('admin/permission', payload);

    this.permissionListComponent.loadPermissions();
    this._dialog.closeAll();
  }
}
