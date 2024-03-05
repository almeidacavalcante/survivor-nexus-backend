import { Injectable } from '@nestjs/common';
import ItemRepository from '@/domain/repository/item.repository';
import Item from '@/domain/entities/item.entity';

@Injectable()
export default class CreateItemUsecase {
  constructor(private readonly repository: ItemRepository) {}
  async execute({ name, description, removesInfection }: Input): Promise<Output> {

    const item = new Item({
      name,
      description,
      removesInfection,
    });

    await this.repository.create(item);

    return {
      id: item.id.toString(),
      name: item.name,
      description: item.description,
      removesInfection: item.removesInfection,
    };
  }
}

export type Input = {
  name: string;
  description: string;
  removesInfection?: boolean;
};

export type Output = {
  id: string;
  name: string;
  description: string;
  removesInfection?: boolean;
}
