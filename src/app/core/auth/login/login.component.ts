import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiResponse, ApiService } from '../../services/api-interface.service';
import { SpinnerService } from '../../services/spinner.service';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { LoginPayload, LoginResponse, TenantApiConfig } from './login.model';
import { Router } from '@angular/router';
import { LOGIN_TYPE } from '../../../shared/constant/db.constants';
import { TenantConfigService } from '../../services/tenant-config.service';
import { Environment } from '../../../../environments/environment.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Permission } from '../../../shared/models/global.model';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup<any>;
  hide = signal(true);
  isAdminLogin = true;
  LOGIN_TYPE = LOGIN_TYPE;
  tenantCodeInput = new FormControl(null, [Validators.required]);
  @ViewChild('tenantCodeDialog') tenantCodeDialog!: TemplateRef<any>;
  constructor(
    private _fb: FormBuilder,
    private _apiService: ApiService,
    private _spinnerService: SpinnerService,
    private _router: Router,
    private _tenantConfigService: TenantConfigService,
    private _dialog: MatDialog,
    private _permissionService: PermissionService
  ) {
    // Initialization logic can go here
    const subdomain = window.location.hostname.split('.')[0];
    if (subdomain === 'localhost') {
      this.isAdminLogin = true;
    } else {
      this.isAdminLogin = false;
    }
    this.initializeForm();
  }

  ngOnInit(): void {
    // Any additional initialization logic can go here
    console.log('LoginComponent initialized');
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onTenantLogin() {
    // Provide dialog to add tenant code
    const dialogRef = this._dialog.open(this.tenantCodeDialog, {
      width: '350px',
      disableClose: true,
    });
  }

  async onTenantChange() {
    const tenantConfig = await this._apiService.get<TenantApiConfig>(
      `tenant/${this.tenantCodeInput?.value}/details`
    );

    if (tenantConfig) {
      this.tenantCodeInput.reset();
      this._tenantConfigService.switchTenant(tenantConfig);
      this._dialog.closeAll(); // Explicitly close dialog only on success
    }
    // If tenantConfig is undefined (error), dialog remains open
  }

  initializeForm() {
    // Logic to initialize the login form
    this.loginForm = this._fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  onUserChange() {
    if (this.isAdminLogin) {
      this.onTenantLogin();
    } else {
      this.onAdminLogin();
    }
  }

  onAdminLogin() {
    this._tenantConfigService.switchAdmin();
  }

  // Add methods for handling login, form submission, etc.
  async onLogin() {
    // Logic for handling login
    this._spinnerService.show();
    const loginPayload: LoginPayload = this.loginForm.value;
    if (this.isAdminLogin) {
      const login: LoginResponse = await this._apiService.post<LoginResponse>(
        'auth/admin/login',
        loginPayload
      );

      localStorage.setItem('authToken', login.token);
      this._router.navigate(['/admin/tenants']);
    } else {
      //  Change subdomain
      const login: LoginResponse = await this._apiService.post<LoginResponse>(
        'auth/login',
        loginPayload
      );
      localStorage.setItem('authToken', login.token);
      this._router.navigate(['/tenant/product']);
    }
  }

  // Add remember me functionality
  onRememberMeChange(event: MatCheckboxChange) {
    if (event.checked) {
      // Logic to handle "Remember Me" checked state
      const loginPayload: LoginPayload = this.loginForm.value;
      localStorage.setItem('rememberedUser', JSON.stringify(loginPayload));
    } else {
      // Logic to handle "Remember Me" unchecked state
      localStorage.removeItem('rememberedUser');
      this.loginForm.patchValue({
        username: '',
        password: '',
      });
    }
  }
}
