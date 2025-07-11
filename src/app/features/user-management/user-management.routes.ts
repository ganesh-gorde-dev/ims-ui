import { Routes } from '@angular/router';
import { UserManagementComponent } from './components/user-management/user-management.component';

export const USER_MANAGEMENT_ROUTE: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    data: { title: 'User Management' },
  },
];
