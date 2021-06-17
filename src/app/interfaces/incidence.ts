import { Driver } from './driver';

export interface IncidenceResponse<T> {
  data: T;
  message: string;
}

export interface IncidenceData {
  includes: string[];
  route_id: number;
  type_incident_id: number;
  start_date: string;
  end_date: string;

}
export interface Incidence {
  id?: number;
  lattitude?: string;
  longitude?: string;
  description?: string;
  solved?: number;
  driver_id?: number;
  route_id?: number;
  created_at?: string;
  updated_at?: string;
  type_incident_id?: number;
  type_incident?: IncidenceType;
  driver?: Driver;
}


export interface IncidenceType {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}
