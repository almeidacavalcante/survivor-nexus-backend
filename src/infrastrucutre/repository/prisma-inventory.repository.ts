import { Injectable } from '@nestjs/common'
import InventoryRepository from '@/domain/repository/inventory.repository';
import { PrismaService } from '@/infrastrucutre/prisma/prisma.service';
import Inventory from '@/domain/entities/inventory.entity';

@Injectable()
export class PrismaInventoryRepository implements InventoryRepository {
  constructor(
    private prisma: PrismaService,
  ) {}

  async update(inventory: Inventory, survivorId: string): Promise<void> {
    const operations = inventory.items.map((inventoryItem) => {
      const itemId = inventoryItem.item.id.toString();
      const quantity = inventoryItem.quantity;
      return this.prisma.inventory.upsert({
        where: {
            survivorId_itemId: {
              survivorId,
              itemId,
            }
        },
        update: {
          quantity,
        },
        create: {
          survivorId,
          itemId,
          quantity,
        },
      });
    });

    await this.prisma.$transaction(operations);
  }

  async calculateAverageItemsPerSurvivor(): Promise<any> {
    const totalSurvivors = await this.prisma.survivor.count();

    const itemsSum = await this.prisma.inventory.groupBy({
      by: ['itemId'],
      _sum: {
        quantity: true,
      },
    });

    const itemNames = await this.prisma.item.findMany({
      where: {
        id: {
          in: itemsSum.map(item => item.itemId),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const itemIdToNameMap = itemNames.reduce((map, item) => {
      map[item.id] = item.name;
      return map;
    }, {});

    const averagesWithNames = itemsSum.map(item => ({
      itemId: item.itemId,
      itemName: itemIdToNameMap[item.itemId],
      averageQuantityPerSurvivor: (item._sum.quantity ?? 0) / totalSurvivors,
    }));

    return averagesWithNames;
  }



}
