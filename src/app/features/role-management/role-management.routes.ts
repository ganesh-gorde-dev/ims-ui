import { Routes } from '@angular/router';
import { RoleManagmentHomeComponent } from './components/role-managment-home/role-managment-home.component';

export const ROLE_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    component: RoleManagmentHomeComponent,
    data: { title: 'Role' },
  },
];
