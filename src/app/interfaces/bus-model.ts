export interface BusModel {
  id?: number;
  name?: string;
  bus_brand_id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  brand?: BusBrand;
}

export interface BusBrand {
  id?: number;
  name?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
