import { inject, Injectable } from '@angular/core';
import { Environment } from '../../../environments/environment.model';
import { ApiService } from './api-interface.service';
import { environment } from '../../../environments/environment';
import { TenantApiConfig } from '../auth/login/login.model';

@Injectable({ providedIn: 'root' })
export class TenantConfigService {
  private config: TenantApiConfig = environment;

  async loadConfig(): Promise<void> {
    const subdomain = window.location.hostname.split('.')[0];
    const configUrl = `tenant/${subdomain}/details`;

    if (subdomain === 'localhost') return;
    const apiService = inject(ApiService);
    this.config = await apiService.get<Environment>(configUrl);
  }

  switchTenant(config: TenantApiConfig) {
    const host = window.location.host; // e.g. te.localhost:4200
    const newHost = `${config.sub_domain}.${host}`;
    const protocol = window.location.protocol;
    window.location.href = `${protocol}//${newHost}${window.location.pathname}`;
  }

  switchAdmin() {
    const hostParts = window.location.host.split('.');
    if (hostParts.length > 1) {
      hostParts.shift();
    }
    const newHost = hostParts.join('.');
    const protocol = window.location.protocol;
    window.location.href = `${protocol}//${newHost}${window.location.pathname}`;
  }

  get apiHost(): string {
    return this.config?.api_host ?? '';
  }

  get basePath(): string {
    return this.config?.base_path ?? '';
  }

  get fullApiUrl(): string {
    return `${this.apiHost}/${this.basePath}/`;
  }

  isAdmin() {
    return this.config.sub_domain === '';
  }
}
