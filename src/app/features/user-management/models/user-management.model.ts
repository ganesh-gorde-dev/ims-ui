export interface User {
  email: string;
  role_id: number;
  password: string;
  profile_photo: string;
  phone_number: number;
  first_name: string;
  last_name: string;
  full_name: string;
  user_id: string;
}

export interface DialogData {
  isEdit: boolean;
  user?: User;
}
