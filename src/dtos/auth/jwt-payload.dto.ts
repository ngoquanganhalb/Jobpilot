export interface JwtDto {
  user: User;
  client: string;
  device_hash: string;
  domain: string;
  type: string;
  iat: number;
  exp: number;
}

interface User {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  name: any;
  email: any;
  phone: any;
  username: string;
  user_type: any;
  profile_details: any;
  client: string;
  role_id: number;
  avatar: any;
}
