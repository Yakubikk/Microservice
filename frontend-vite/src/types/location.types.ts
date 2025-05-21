// Типы для местоположений и перемещений
import type { Part } from './parts.types';
import type { RailwayCistern } from './cistern.types';

/**
 * Типы местоположений
 */
export type LocationType = 'warehouse' | 'wagon' | 'repair_shop' | 'scrap_yard' | 'other';

/**
 * Местоположение
 */
export interface Location {
  location_id: string;
  name: string;
  type: LocationType;
  description?: string;
}

/**
 * Установка детали (перемещение)
 */
export interface PartInstallation {
  installation_id: string;
  part_id: string;
  wagon_id?: string;
  installed_at: string;
  installed_by?: string;
  removed_at?: string;
  removed_by?: string;
  from_location_id?: string;
  to_location_id: string;
  notes?: string;

  // Связанные объекты
  part?: Part;
  wagon?: RailwayCistern;
  fromLocation?: Location;
  toLocation: Location;
}

/**
 * Интерфейс для создания/обновления установки детали
 */
export interface PartInstallationInput {
  part_id: string;
  wagon_id?: string;
  installed_at?: string;
  installed_by?: string;
  removed_at?: string;
  removed_by?: string;
  from_location_id?: string;
  to_location_id: string;
  notes?: string;
}
