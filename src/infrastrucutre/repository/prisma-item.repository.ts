import { Injectable } from '@nestjs/common'
import ItemRepository from '@/domain/repository/item.repository';
import { PrismaService } from '@/infrastrucutre/prisma/prisma.service';
import Item from '@/domain/entities/item.entity';
import { PrismaItemMapper } from '@/domain/repository/mappers/prisma-item.mapper';

@Injectable()
export class PrismaItemRepository implements ItemRepository {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findById(id: string): Promise<Item | null> {
    const item = await this.prisma.item.findFirst({
      where: {
        id,
      },
    })

    if (!item) {
      return null
    }

    return PrismaItemMapper.toDomain(item)
  }

  async findByName(name: string): Promise<Item | null> {
    const item = await this.prisma.item.findFirst({
      where: {
        name,
      },
    })

    if (!item) {
      return null
    }

    return PrismaItemMapper.toDomain(item)
  }

  async create(item: Item): Promise<void> {
    const data = PrismaItemMapper.toPrisma(item)
    await this.prisma.item.create({
      data,
    })
  }

  async save(item: Item): Promise<void> {
    const data = PrismaItemMapper.toPrisma(item)

    await Promise.all([
      this.prisma.item.update({
        where: {
          id: item.id.toString(),
        },
        data,
      }),
    ])
  }
}
