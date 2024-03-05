import { Item as PrismaItem, Prisma } from '@prisma/client';
import Item from '@/domain/entities/item.entity';

export class PrismaItemMapper {
  static toDomain(raw: PrismaItem): Item {
     return new Item(
      {
        name: raw.name,
        description: raw.description,
        removesInfection: raw.removesInfection,
      },
      raw.id
    )
  }

  static toPrisma(item: Item): Prisma.ItemUncheckedCreateInput {
    return {
      id: item.id!.toString(),
      name: item.name,
      description: item.description,
      removesInfection: item.removesInfection ?? false,
    }
  }
}

