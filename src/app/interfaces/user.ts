import { Role } from './role';

export interface User {
  id?: string;
  address?: string;
  charge?: string;
  client_id?: number;
  created_at?: string;
  deleted_at?: string;
  department?: string;
  imageUrl?: string;
  email?: string;
  email_verified_at?: string;
  identification?: string;
  license?: string;
  license_expiration?: string;
  name?: string;
  phone?: string;
  roles?: Array<Role>;
  updated_at?: string;
  verified_by_admin?: number;
  verified_by_client?: number;
  years_experiencie?: number;
  facebook_id?: string;
  google_id?: string;
}
