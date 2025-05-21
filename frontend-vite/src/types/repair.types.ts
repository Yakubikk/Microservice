// Типы для ремонтов
import type { Part } from './parts.types';
import type { RepairType, Depot } from './dictionary.types';

/**
 * Ремонт
 */
export interface Repair {
  repair_id: string;
  part_id: string;
  repair_type_id: string;
  repair_date: string;
  depot_id?: string;
  next_repair_date?: string;
  created_at?: string;

  // Связанные объекты
  part?: Part;
  repair_type?: RepairType;
  depot?: Depot;
}

/**
 * Интерфейс для создания/обновления ремонта
 */
export interface RepairInput {
  part_id: string;
  repair_type_id: string;
  repair_date: string;
  depot_id?: string;
  next_repair_date?: string;
}
