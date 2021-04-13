export interface Route {
  id?: number;
  name?: string;
  code?: string;
  route_type_id?: number;
  bus_id?: number;
  driver_id?: number;
  start_time?: string;
  end_time?: string;
  route_stops?: RouteStop[];
}

export interface RouteStop {
  id?: number;
  name?: string;
  lattitude?: string;
  longitude?: string;
  arrival_time?: string;
}
