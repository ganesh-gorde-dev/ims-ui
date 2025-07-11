import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {
  NotificationItem,
  NotificationResponse,
} from '../../shared/models/global.model';
import { ApiService } from './api-interface.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = 'notification';
  private markAsReadUrl = 'notification';
  private socket$!: WebSocketSubject<any>;
  private notificationSubject = new BehaviorSubject<NotificationItem[]>([]);
  public notifications$ = this.notificationSubject.asObservable();

  constructor(private http: HttpClient, private _apiService: ApiService) {
    this.connectToSocket();
  }

  getNotifications(
    page: number = 1,
    size: number = 10
  ): Promise<NotificationResponse> {
    return this._apiService.get<NotificationResponse>(
      `${this.apiUrl}?is_pagination=true&page=${page}&page_size=${size}`
    );
  }

  markAsRead(notificationId: string): Promise<any> {
    return this._apiService.put(this.markAsReadUrl, {
      list_notification_id: notificationId,
    });
  }

  private connectToSocket(): void {
    this.socket$ = webSocket('wss://localhost/ws/notifications');

    this.socket$.subscribe({
      next: (msg: any) => {
        const item: NotificationItem = msg?.data;
        if (item) {
          const current = this.notificationSubject.value;
          this.notificationSubject.next([item, ...current]);
        }
      },
      error: err => console.error('WebSocket Error:', err),
      complete: () => console.warn('WebSocket connection closed'),
    });
  }

  disconnectSocket(): void {
    this.socket$.complete();
  }
}
