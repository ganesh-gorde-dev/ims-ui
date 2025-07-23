import { Component, TemplateRef, ViewChild } from '@angular/core';
import { UserListComponent } from '../user-list/user-list.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { MasterData } from '../../../../shared/models/global.model';
import {
  MASTER_DATA,
  PERMISSION,
} from '../../../../shared/constant/db.constants';
import { ApiService } from '../../../../core/services/api-interface.service';
import { MatButtonModule } from '@angular/material/button';
import { DialogData, User } from '../../models/user-management.model';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../../../../shared/shared.module';
import { UserCardComponent } from '../user-card/user-card.component';
import { PermissionService } from '../../../../core/services/permission.service';

@Component({
  selector: 'app-user-management',
  imports: [SharedModule, UserCardComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent {
  userForm!: FormGroup;
  dialogData: DialogData = { isEdit: false };

  @ViewChild('addUserDialog') addUserDialog!: TemplateRef<any>;
  masterData: { [key: string]: MasterData[] };
  arrRoles: MasterData[];

  @ViewChild(UserListComponent)
  userListComponent!: UserListComponent;

  @ViewChild(UserCardComponent)
  userCardComponent!: UserCardComponent;

  PERMISSION = PERMISSION;

  constructor(
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private _apiService: ApiService,
    private _permissionService: PermissionService
  ) {
    const parentRouteWithData = this.route.pathFromRoot.find(
      r => r.snapshot.data['masterData']
    );

    this.masterData = parentRouteWithData?.snapshot.data['masterData'].choices;
    this.arrRoles = this.masterData[MASTER_DATA.ROLE_TYPES];
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
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
      password: [''],
    });
  }

  onAdduser() {
    this._dialog.open(this.addUserDialog, {
      width: '600px',
      data: this.dialogData,
      id: 'addUserDialog',
      autoFocus: false,
      restoreFocus: false,
    });

    this.userForm.reset();
    this.userForm.markAsUntouched();
  }

  async onAddUserSave() {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const payload = {
        email: formValue.email,
        phone_number: formValue.phone_number,
        role_id: formValue.role_id,
        last_name: formValue.last_name,
        first_name: formValue.first_name,
        password: formValue.password,
      };

      await this._apiService.post<User>(`user/company-admin`, payload);
      this._dialog.closeAll();
      this.userCardComponent.loadUsers();
      // this.userListComponent.loadUsers();
    }
  }

  onEmitEvent(event: any) {
    switch (event.action) {
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

  async handleEditUser(user: User) {
    this.dialogData = { isEdit: true, user };
    const values = await this._apiService.get<User>(`user/${user.user_id}`);
    this.userForm.patchValue({
      email: values.email,
      phone_number: values.phone_number,
      role_id: values.role_id,
      last_name: values.last_name,
      first_name: values.first_name,
      profile_photo: values.profile_photo,
      password: values.password,
    });

    const dialogRef = this._dialog.open(this.addUserDialog, {
      width: '600px',
      data: this.dialogData,
      id: 'addUserDialog',
      autoFocus: false,
      restoreFocus: false,
    });
  }

  selectedUser!: User;
  @ViewChild('deleteUserDialog') deleteUserDialog!: TemplateRef<any>;
  handleDeleteUser(user: User) {
    this.selectedUser = user;
    const dialogRef = this._dialog.open(this.deleteUserDialog, {
      width: '400px',
      autoFocus: false,
      restoreFocus: false,
      id: 'deleteUserDialog',
    });
  }

  async onEditUser() {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const payload = {
        email: formValue.email,
        phone_number: formValue.phone_number,
        role_id: formValue.role_id,
        last_name: formValue.last_name,
        first_name: formValue.first_name,
      };

      await this._apiService.patch<User>(
        `user/${this.dialogData.user?.user_id}`,
        payload
      );
      this._dialog.closeAll();
      this.userCardComponent.loadUsers();
      // this.userListComponent.loadUsers();
    }
  }

  async onDeleteUser() {
    await this._apiService.delete(`user/${this.selectedUser.user_id}`);
    this._dialog.closeAll();
    this.userCardComponent.loadUsers();
    // this.userListComponent.loadUsers();
  }

  hasPermission(id: string) {
    return this._permissionService.hasPermission(id);
  }
}
