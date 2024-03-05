import Inventory from '@/domain/entities/inventory.entity';

interface AvgItemsPerSurvivor {
  items: {
    name: string,
    avgQuantity: number
  }[]
}

export default abstract class InventoryRepository {
  abstract update(inventory: Inventory, survivorId: string): Promise<void>;
  abstract calculateAverageItemsPerSurvivor(): Promise<any>;
}
