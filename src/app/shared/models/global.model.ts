export interface MasterData {
  value: string;
  label: string;
}

export interface UserProfile {
  email: string;
  first_name: string;
  full_name: string;
  last_name: string;
  phone_number: string;
  profile_photo: string | null;
  role_id: string;
  user_id: string;
}

export interface Permission {
  name: string;
  code: string;
  module: string;
  action: string;
  permission_id: string;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
}

export interface NotificationResponse {
  data: {
    list: NotificationItem[];
    pagination: Pagination;
  };
  errors: any;
  messages: any;
  status_code: number;
  is_success: boolean;
}

export interface NotificationItem {
  created_dtm: string;
  sent_by: Sender;
  notification: NotificationDetails;
}

export interface Sender {
  email: string;
  user_id: string;
  role_id: string;
  phone_number: string;
  profile_photo: string | null;
  last_name: string;
  first_name: string;
  full_name: string;
}

export interface NotificationDetails {
  title: string;
  message: string;
  created_by: string;
  notification_id: string;
  notification_type: string;
  notification_data: {
    stock_id?: string;
    [key: string]: any;
  };
}

export interface Pagination {
  count: number;
  page_size: number;
  current_page: number;
  total_pages: number;
}
