// Типы для вагонов и цистерн
import type {Manufacturer, Registrar, WagonModel, WagonType} from './dictionary.types';
import type {Vessel} from './vessel.types';
import type {Part} from './parts.types';

/**
 * Вагон-цистерна
 */
export interface RailwayCistern {
    id: string;
    number: string;
    manufacturerId: string;
    manufacturerName?: string;
    manufacturerCountry?: string;
    buildDate: string;
    tareWeight: number;
    loadCapacity: number;
    length: number;
    axleCount: number;
    volume: number;
    fillingVolume?: number;
    initialTareWeight?: number;
    typeId: string;
    typeName?: string;
    modelId?: string;
    modelName?: string;
    commissioningDate?: string;
    serialNumber: string;
    registrationNumber: string;
    registrationDate: string;
    registrarId?: string;
    registrarName?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
    creatorId?: string;

    // Связанные объекты - сохраняем для совместимости
    manufacturer?: Manufacturer;
    type?: WagonType;
    model?: WagonModel;
    registrar?: Registrar;
    vessel?: Vessel;
    parts?: Part[];
}

// Интерфейс для создания/обновления вагона-цистерны
export interface RailwayCisternInput {
    number: string;
    manufacturerId: string;
    buildDate: string;
    tareWeight: number;
    loadCapacity: number;
    length: number;
    axleCount: number;
    volume: number;
    fillingVolume?: number;
    initialTareWeight?: number;
    typeId: string;
    modelId?: string;
    commissioningDate?: string;
    serialNumber: string;
    registrationNumber: string;
    registrationDate: string;
    registrarId?: string;
    notes?: string;
    
    // Vessel related properties
    vesselSerialNumber?: string;
    vesselBuildDate?: string;
}
