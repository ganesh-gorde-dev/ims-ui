import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { ApiService } from '../../../../core/services/api-interface.service';
import {
  Tenant,
  User,
  UserResponse,
} from '../../../tenant/models/tenant.model';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-card',
  imports: [SharedModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent {
  @Output() emitEvent: EventEmitter<any> = new EventEmitter<any>();
  users: any[] = [];
  tenantData!: Tenant;
  constructor(private _apiService: ApiService, private route: ActivatedRoute) {
    this.tenantData = this.route.snapshot.data['tenantDetails'];
    // Initialization logic can go here
    this.loadUsers();
  }

  async loadUsers() {
    const user = await this._apiService.get<UserResponse>('user', {
      ispagination: false,
    });

    this.users = user.list;
  }

  getInitials(user: User): string {
    return (
      user.first_name.charAt(0).toUpperCase() +
      user.last_name.charAt(0).toUpperCase()
    );
  }

  handleAction(action: string, user: User) {
    // Logic to handle edit action
    this.emitEvent.emit({ action: action, user });
  }
}
