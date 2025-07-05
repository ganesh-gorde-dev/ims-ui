export interface TenantResponse {
  list: Tenant[];
  pagination: {
    count: number;
    page_size: number;
    current_page: number;
    total_pages: number;
  };
}

export interface Tenant {
  tenant_id: string;
  tenant_code: string;
  tenant_name: string;
}

export interface TenantDetails {
  api_host: string;
  base_path: string;
  host: string;
  sub_domain: string;
}

export interface TenantConfiguration {
  database_strategy: string;
  authentication_type: string;
  database_server: string;
  database_config?: {
    password: string;
    username: string;
    host: string;
    port: number;
    options: string;
    database_name: string;
  };
}

export interface Permission {
  action: 'POST' | 'GET' | 'PUT' | 'DELETE';
  module: string;
  name: string;
  permission_id: string;
}

export interface PermissionResponse {
  list: Permission[];
  pagination: {
    count: number;
    page_size: number;
    current_page: number;
    total_pages: number;
  };
}

export interface User {
  email: string;
  user_id: string;
  profile_photo: string;
  phone_number: number;
  first_name: string;
  last_name: string;
  full_name: string;
}

export interface UserResponse {
  list: User[];
  pagination: {
    count: number;
    page_size: number;
    current_page: number;
    total_pages: number;
  };
}

export interface TenantPayload {
  tenant_code: string;
  tenant_name: string;
}

export interface DialogData {
  isEdit: boolean;
  tenant?: Tenant;
}
