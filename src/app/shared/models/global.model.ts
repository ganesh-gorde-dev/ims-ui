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
