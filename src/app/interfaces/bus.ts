import { BusModel } from './bus-model';
import { BusType } from './bus-type';
export interface Bus {
  id?: number;
  unit_number?: number;
  license_plate?: string;
  number_positions?: number;
  bus_model_id?: number;
  bus_type_id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  bus_model?: BusModel;
  bus_type?: BusType;
}
