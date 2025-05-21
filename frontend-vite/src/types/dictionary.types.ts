// Типы для базовых справочников

/**
 * Завод-изготовитель
 */
export interface Manufacturer {
  id: string;
  name: string;
  country: string;
}

/**
 * Тип вагона
 */
export interface WagonType {
  id: string;
  name: string;
}

/**
 * Регистратор
 */
export interface Registrar {
  id: number;
  name: string;
}

/**
 * Модель вагона
 */
export interface WagonModel {
  id: string;
  name: string;
}

/**
 * Тип ремонта
 */
export interface RepairType {
  id: string;
  name: string;
  code: string;
  description?: string;
  created_at?: string;
}

/**
 * Депо
 */
export interface Depot {
  depot_id: string;
  name: string;
  code: string;
  location?: string;
  created_at?: string;
}
