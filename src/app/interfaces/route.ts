import { Bus } from './bus';
import { Driver } from './driver';
export interface Route {
  id?: number;
  name?: string;
  code?: string;
  route_type?: RouteType;
  route_type_id?: number;
  bus?: Bus;
  bus_id?: number;
  driver?: Driver;
  driver_id?: number;
  start_time?: string;
  end_time?: string;
  occuped_seats?: number;
  free_seats?: number;
  route_stops?: RouteStop[];
  rating?: number;
}

export interface RouteStop {
  id?: number;
  name?: string;
  lattitude?: string;
  longitude?: string;
  arrival_time?: string;
}

export interface RouteType {
  created_at?: string;
  deleted_at?: string;
  id?: number;
  name: string;
  updated_at: string;
}
