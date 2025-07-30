import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // Or use ToastrService
import { Router } from '@angular/router';
import { ApiNotificationService } from './api-notification.service';

export interface ErrorMessage {
  status: number;
  message: string;
  errors: { code: string; message: string; field: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(
    private snackBar: MatSnackBar,
    private notificationBannerService: ApiNotificationService,
    private router: Router
  ) {}

  handle(error: HttpErrorResponse): void {
    const status = error.status;
    console.log('ErrorHandlerService:', error);
    // Handle custom error structure
    const message = error.error?.errors;
    switch (status) {
      case 400:
        this.show(message || 'Bad Request');
        break;

      case 204:
        localStorage.removeItem('authToken');
        this.router.navigate(['/']);
        break;

      case 401:
        this.show(message || 'Unauthorized');
        localStorage.removeItem('authToken');
        this.router.navigate(['/']);
        break;

      case 403:
        this.show(message || 'Forbidden');
        break;

      case 404:
        this.show(message || 'Not Found');
        break;

      case 500:
        this.show(message || 'Internal Server Error');
        break;

      default:
        this.show(message || 'Unknown Error');
    }
  }

  private show(error: ErrorMessage | ErrorMessage[]): void {
    if (Array.isArray(error)) {
      error.forEach(
        msg =>
          this.snackBar.open(msg.message, 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          })

        // this.notificationBannerService.error(msg.message, 'Error', {
        //   duration: 3000,
        // })
      );
    } else {
      this.snackBar.open(error.message, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      // this.notificationBannerService.error(error.message, 'Error', {
      //   duration: 3000,
      // });
    }
  }
}
