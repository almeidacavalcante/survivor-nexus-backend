import { Injectable } from '@nestjs/common';
import ItemRepository from '@/domain/repository/item.repository';
import Item from '@/domain/entities/item.entity';
import ApplicationException from '@/application/exceptions/application-exception';
import SurvivorRepository from '@/domain/repository/survivor.repository';
import Position from '@/domain/entities/value-objects/position';
import request from 'supertest';

@Injectable()
export default class RequestItemUsecase {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly survivorRepository: SurvivorRepository,
  ) {}
  async execute({ requesterId, survivorId, itemId, quantity, latitude, longitude }: Input): Promise<Output> {
    const requester = await this.survivorRepository.findById(requesterId);
    if (!requester) throw new ApplicationException('Requester not found');

    const survivor = await this.survivorRepository.findById(survivorId);
    if (!survivor) throw new ApplicationException('Survivor not found');

    const requestedInventory = survivor.inventory.findItemById(itemId);
    if (!requestedInventory) throw new ApplicationException('Item not found');
    if (requestedInventory && requestedInventory.quantity < quantity) {
      throw new ApplicationException('Not enough items');
    }

    survivor.inventory.removeItem(requestedInventory?.item, quantity);
    survivor.updatePosition(latitude, longitude);
    await this.survivorRepository.save(survivor);

    requester.inventory.addItem(requestedInventory?.item, quantity);
    requester.updatePosition(latitude, longitude);
    await this.survivorRepository.save(requester);

    return {
      item: {
        id: requestedInventory.item.id.toString(),
        name: requestedInventory.item.name,
        description: requestedInventory.item.description,
        removesInfection: requestedInventory.item.removesInfection || false,
      },
      requesterQuantity: requester.inventory.findItemByName(requestedInventory.item.name)?.quantity || 0,
      requestedQuantity: survivor.inventory.findItemByName(requestedInventory.item.name)?.quantity || 0,
    };
  }
}

export type Input = {
  requesterId: string;
  survivorId: string;
  itemId: string;
  quantity: number;
  latitude: number,
  longitude: number,
};

export type Output = {
  item: {
    id: string;
    name: string;
    description: string;
    removesInfection: boolean;
  }
  requesterQuantity: number;
  requestedQuantity: number;
}
