// Типы для деталей вагонов
import type { Depot } from './dictionary.types';
import type { Location } from './location.types';

/**
 * Типы деталей
 */
export type PartType = 'wheel_pair' | 'side_frame' | 'bolster' | 'coupler' | 'shock_absorber';

/**
 * Статус детали
 */
export type PartStatus = 'active' | 'decommissioned' | 'extended';

/**
 * Базовая деталь
 */
export interface BasePart {
  part_id: string;
  part_type: PartType;
  depot_id?: string;
  stamp_number: string;
  serial_number?: string;
  manufacture_year?: number;
  current_location?: string;
  status?: PartStatus;
  notes?: string;
  created_at?: string;

  // Связанные объекты
  depot?: Depot;
  currentLocation?: Location;
}

/**
 * Колёсная пара
 */
export interface WheelPair extends BasePart {
  part_type: 'wheel_pair';
  thickness_left?: number;
  thickness_right?: number;
  wheel_type?: string;
}

/**
 * Боковая рама
 */
export interface SideFrame extends BasePart {
  part_type: 'side_frame';
  service_life_years?: number;
  extended_until?: string;
}

/**
 * Надрессорная балка
 */
export interface Bolster extends BasePart {
  part_type: 'bolster';
  service_life_years?: number;
  extended_until?: string;
}

/**
 * Автосцепка
 */
export interface Coupler extends BasePart {
  part_type: 'coupler';
}

/**
 * Поглощающий аппарат
 */
export interface ShockAbsorber extends BasePart {
  part_type: 'shock_absorber';
  model?: string;
  manufacturer_code?: string;
  next_repair_date?: string;
  service_life_years?: number;
}

/**
 * Объединённый тип для всех деталей
 */
export type Part = WheelPair | SideFrame | Bolster | Coupler | ShockAbsorber;

/**
 * Интерфейс для создания/обновления детали
 */
export interface PartInput {
  part_type: PartType;
  depot_id?: string;
  stamp_number: string;
  serial_number?: string;
  manufacture_year?: number;
  current_location?: string;
  status?: PartStatus;
  notes?: string;

  // Специфические поля для типов деталей
  thickness_left?: number;
  thickness_right?: number;
  wheel_type?: string;
  service_life_years?: number;
  extended_until?: string;
  model?: string;
  manufacturer_code?: string;
  next_repair_date?: string;
}
