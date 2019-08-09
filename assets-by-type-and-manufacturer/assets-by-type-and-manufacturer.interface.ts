
export interface ICategoryType {
    total: number;
    id: string;
}

export class IManufacturerByType {
    categories: ICategoryType[];
    total: number;
    manufacturer: string;
    manufacturer_id: string;
}
