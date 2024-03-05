import { Injectable } from '@nestjs/common';
import ItemRepository from '@/domain/repository/item.repository';
import Item from '@/domain/entities/item.entity';
import ApplicationException from '@/application/exceptions/application-exception';
import SurvivorRepository from '@/domain/repository/survivor.repository';
import Position from '@/domain/entities/value-objects/position';
import request from 'supertest';

@Injectable()
export default class ListSurvivorsUsecase {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly survivorRepository: SurvivorRepository,
  ) {}
  async execute({ page, perPage }: Input): Promise<Output> {
    const survivors = await this.survivorRepository.findMany(page, perPage);

    return {
      survivors: survivors.map(survivor => ({
        id: survivor.id.toString(),
        name: survivor.name,
        birthDate: survivor.birthDate,
        gender: survivor.gender,
        lastLocation: {
          latitude: survivor.lastLocation.latitude,
          longitude: survivor.lastLocation.longitude,
        },
        isInfected: survivor.isInfected,
        email: survivor.email,
        inventory: {
          items: survivor.inventory.items.map(item => ({
            item: {
              id: item.item.id.toString(),
              name: item.item.name,
              description: item.item.description,
              removesInfection: item.item.removesInfection,
            },
            quantity: item.quantity,
          })),
        },
      })),
    }
  }
}

export type Input = {
  page: number;
  perPage: number;
}

export type Output = {
  survivors: {
    id: string;
    name: string;
    birthDate: Date;
    gender: string,
    lastLocation: {
      latitude: number,
      longitude: number,
    },
    email: string,
    inventory: {
      items: {
        item: {
          id: string,
          name: string,
          description: string,
          removesInfection: boolean | undefined,
        },
        quantity: number;
      }[];
    }
  }[]
}
