import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiNotification } from '../models/global.model';
import { ApiNotificationService } from '../../core/services/api-notification.service';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-notification-banner',
  imports: [CommonModule],
  templateUrl: './notification-banner.component.html',
  styleUrl: './notification-banner.component.css',
  // animations: [
  //   trigger('slideIn', [
  //     transition(':enter', [
  //       style({ transform: 'translateX(100%)', opacity: 0 }),
  //       animate(
  //         '300ms ease-out',
  //         style({ transform: 'translateX(0)', opacity: 1 })
  //       ),
  //     ]),
  //     transition(':leave', [
  //       animate(
  //         '300ms ease-in',
  //         style({ transform: 'translateX(100%)', opacity: 0 })
  //       ),
  //     ]),
  //   ]),
  // ],
})
export class NotificationBannerComponent implements OnInit, OnDestroy {
  notifications: ApiNotification[] = [];
  private destroy$ = new Subject<void>();

  constructor(private notificationService: ApiNotificationService) {}

  ngOnInit(): void {
    this.notificationService
      .getNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        console.log(notifications);
        this.notifications = notifications;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByFn(index: number, item: ApiNotification): string {
    return item.id;
  }

  getNotificationClass(notification: ApiNotification): string {
    return `notification-${notification.type}`;
  }

  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }

  executeAction(notification: ApiNotification): void {
    if (notification.action) {
      notification.action.callback();
      this.dismiss(notification.id);
    }
  }
}
