import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, firstValueFrom, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SpinnerService } from './spinner.service';
import { TenantConfigService } from './tenant-config.service';
import { Environment } from '../../../environments/environment.model';

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
  is_success: boolean;
  errors?: any; // Optional, can be null or an object
  status_code: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private _spinnerService: SpinnerService,
    private _configService: TenantConfigService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
    return headers;
  }

  async get<T>(url: string, params?: any, spinner: boolean = true): Promise<T> {
    if (spinner) this._spinnerService.show();

    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<T>>(this._configService.fullApiUrl + url, {
          headers: this.getHeaders(),
          params: params,
        })
      );
      if (!response) throw new Error('No response from API');
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      if (spinner) this._spinnerService.hide();
    }
  }

  async post<T>(url: string, data: any, spinner: boolean = true): Promise<T> {
    if (spinner) this._spinnerService.show();

    try {
      const response = await firstValueFrom(
        this.http.post<ApiResponse<T>>(
          this._configService.fullApiUrl + url,
          data,
          {
            headers: this.getHeaders(),
          }
        )
      );
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      if (spinner) this._spinnerService.hide();
    }
  }

  async put<T>(url: string, data: any, spinner: boolean = true): Promise<T> {
    if (spinner) this._spinnerService.show();

    try {
      const response = await firstValueFrom(
        this.http.put<ApiResponse<T>>(
          this._configService.fullApiUrl + url,
          data,
          {
            headers: this.getHeaders(),
          }
        )
      );
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      if (spinner) this._spinnerService.hide();
    }
  }

  async patch<T>(url: string, data: any, spinner: boolean = true): Promise<T> {
    if (spinner) this._spinnerService.show();

    try {
      const response = await firstValueFrom(
        this.http.patch<ApiResponse<T>>(
          this._configService.fullApiUrl + url,
          data,
          {
            headers: this.getHeaders(),
          }
        )
      );
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      if (spinner) this._spinnerService.hide();
    }
  }

  async delete<T>(url: string, spinner: boolean = true): Promise<null> {
    if (spinner) this._spinnerService.show();

    try {
      await firstValueFrom(
        this.http.delete<ApiResponse<T>>(this._configService.fullApiUrl + url, {
          headers: this.getHeaders(),
        })
      );
      return null;
    } catch (error) {
      throw error;
    } finally {
      if (spinner) this._spinnerService.hide();
    }
  }
}
