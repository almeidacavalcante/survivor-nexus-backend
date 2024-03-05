import { Injectable } from '@nestjs/common';
import ItemRepository from '@/domain/repository/item.repository';
import Item from '@/domain/entities/item.entity';
import ApplicationException from '@/application/exceptions/application-exception';
import SurvivorRepository from '@/domain/repository/survivor.repository';
import Position from '@/domain/entities/value-objects/position';
import request from 'supertest';
import InventoryRepository from '@/domain/repository/inventory.repository';

@Injectable()
export default class ReportAverageAmountItemsPerSurvivorUsecase {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
  ) {
  }

  async execute(): Promise<Output> {
    return await this.inventoryRepository.calculateAverageItemsPerSurvivor();
  }
}

export type Output = {
  averages: {
    itemId: string;
    averageQuantityPerSurvivor: number;
  }[]
}
