// Типы для сосудов
import type { RailwayCistern } from './cistern.types';

/**
 * Сосуд (для вагона-цистерны)
 */
export interface Vessel {
  id: string;
  railwayCisternsId: string;
  vesselSerialNumber?: string;
  vesselBuildDate?: string;

  // Связанный объект
  railwayCistern?: RailwayCistern;
}

// Интерфейс для создания/обновления сосуда
export interface VesselInput {
  railwayCisternsId: string;
  vesselSerialNumber?: string;
  vesselBuildDate?: string;
}
