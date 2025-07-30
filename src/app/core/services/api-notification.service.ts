import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { ApiNotification } from '../../shared/models/global.model';

@Injectable({
  providedIn: 'root',
})
export class ApiNotificationService {
  private notifications$ = new BehaviorSubject<ApiNotification[]>([]);
  private maxNotifications = 5;
  private defaultDuration = 5000; // 5 seconds

  constructor() {}

  getNotifications(): Observable<ApiNotification[]> {
    return this.notifications$.asObservable();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private addNotification(
    notification: Omit<ApiNotification, 'id' | 'timestamp'>
  ): void {
    const newNotification: ApiNotification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      dismissible: notification.dismissible ?? true,
      duration: notification.duration ?? this.defaultDuration,
    };

    const currentNotifications = this.notifications$.value;
    const updatedNotifications = [
      newNotification,
      ...currentNotifications,
    ].slice(0, this.maxNotifications);

    this.notifications$.next(updatedNotifications);

    // Auto-dismiss if duration is set and > 0
    if (newNotification.duration && newNotification.duration > 0) {
      timer(newNotification.duration).subscribe(() => {
        this.dismiss(newNotification.id);
      });
    }
  }

  success(
    message: string,
    title?: string,
    options?: Partial<ApiNotification>
  ): void {
    this.addNotification({
      type: 'success',
      message,
      title,
      ...options,
    });
  }

  error(
    message: string,
    title?: string,
    options?: Partial<ApiNotification>
  ): void {
    this.addNotification({
      type: 'error',
      message,
      title,
      duration: options?.duration ?? 0, // Errors are persistent by default
      ...options,
    });
  }

  warning(
    message: string,
    title?: string,
    options?: Partial<ApiNotification>
  ): void {
    this.addNotification({
      type: 'warning',
      message,
      title,
      duration: options?.duration ?? 8000, // Warnings last longer
      ...options,
    });
  }

  info(
    message: string,
    title?: string,
    options?: Partial<ApiNotification>
  ): void {
    this.addNotification({
      type: 'info',
      message,
      title,
      ...options,
    });
  }

  dismiss(id: string): void {
    const currentNotifications = this.notifications$.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notifications$.next(updatedNotifications);
  }

  dismissAll(): void {
    this.notifications$.next([]);
  }

  // Utility methods for API integration
  handleApiSuccess(message: string = 'Operation completed successfully'): void {
    this.success(message);
  }

  handleApiError(error: any, customMessage?: string): void {
    let message = customMessage || 'An error occurred';

    if (error?.error?.message) {
      message = error.error.message;
    } else if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    this.error(message, 'Error');
  }
}
