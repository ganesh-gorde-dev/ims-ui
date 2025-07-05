import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Angular 17+ Functional Interceptor (supported in Angular 19)
export const apiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<any> => {
  const token = localStorage.getItem('authToken');

  const errorHandler = inject(ErrorHandlerService);

  let modifiedReq = req;
  if (token) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      errorHandler.handle(error);
      return throwError(() => error);
    })
  );
};
