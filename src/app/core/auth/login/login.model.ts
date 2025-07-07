export interface LoginPayload {
  username: string;
  password: string;
  tenantCode?: string;
}

export interface LoginResponse {
  token: string;
  created_dtm: string; // ISO date string
}

export interface TenantApiConfig {
  host: string;
  base_path: string;
  sub_domain: string;
  api_host: string;
}
