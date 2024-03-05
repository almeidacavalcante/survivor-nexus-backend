import { Injectable } from '@nestjs/common'
import SurvivorRepository from '@/domain/repository/survivor.repository';
import { PrismaService } from '@/infrastrucutre/prisma/prisma.service';
import Survivor from '@/domain/entities/survivor.entity';
import { PrismaSurvivorMapper } from '@/domain/repository/mappers/prisma-survivor.mapper';
import InventoryRepository from '@/domain/repository/inventory.repository';

@Injectable()
export class PrismaSurvivorRepository implements SurvivorRepository {
  constructor(
    private prisma: PrismaService,
    private inventoryRepository: InventoryRepository,
  ) {}

  async findById(id: string): Promise<Survivor | null> {
    const survivor = await this.prisma.survivor.findUnique({
      where: {
        id,
      },
      include: {
        inventory: {
          include: {
            item: true,
          },
        },
      }
    })

    if (!survivor) {
      return null
    }

    const toDomain = PrismaSurvivorMapper.toDomain(survivor)
    return toDomain
  }

  async delete(survivorId: string): Promise<void> {
    await this.prisma.survivor.delete({
      where: {
        id: survivorId,
      },
    })
  }

  async findMany(page: number = 1, perPage: number = 5): Promise<Survivor[]> {
    const survivors = await this.prisma.survivor.findMany({
      include: {
        inventory: {
          include: {
            item: true,
          },
        },
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return survivors.map((survivor) => PrismaSurvivorMapper.toDomain(survivor))
  }

  async findUniqueByEmail(email: string): Promise<Survivor | null> {
    const survivor = await this.prisma.survivor.findUnique({
      where: {
        email,
      },
      include: {
        inventory: {
          include: {
            item: true,
          },
        }
      }
    })

    if (!survivor) {
      return null
    }

    return PrismaSurvivorMapper.toDomain(survivor)
  }

  async create(survivor: Survivor): Promise<void> {
    const data = PrismaSurvivorMapper.toPrisma(survivor)
    await this.prisma.survivor.create({
      data,
    })

  }

  async save(survivor: Survivor): Promise<void> {
    const data = PrismaSurvivorMapper.toPrisma(survivor)

    await Promise.all([
      this.prisma.survivor.update({
        where: {
          id: survivor.id.toString(),
        },
        data,
      }),
      this.inventoryRepository.update(survivor.inventory, survivor.id.toString()),
    ])
  }

  async reportInfectedSurvivorsComparison(days: number): Promise<{currentPeriodCount: number, previousPeriodCount: number, percentageChange: number}> {
    const currentDate = new Date();
    const startOfCurrentPeriod = new Date(currentDate.getTime() - (days * 24 * 60 * 60 * 1000));
    const startOfPreviousPeriod = new Date(currentDate.getTime() - (2 * days * 24 * 60 * 60 * 1000));

    const currentPeriodCount = await this.prisma.survivor.count({
      where: {
        isInfected: true,
        infectedAt: {
          gte: startOfCurrentPeriod,
        },
      },
    });
    const previousPeriodCount = await this.prisma.survivor.count({
      where: {
        isInfected: true,
        infectedAt: {
          gte: startOfPreviousPeriod,
          lt: startOfCurrentPeriod,
        },
      },
    });
    let percentageChange = 0;
    if (previousPeriodCount > 0) {
      percentageChange = ((currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100;
    }

    return { currentPeriodCount, previousPeriodCount, percentageChange };
  }

  async reportHealthySurvivorsComparison(days: number): Promise<{currentPeriodCount: number, previousPeriodCount: number, percentageChange: number}> {
    const currentDate = new Date();
    const startOfCurrentPeriod = new Date(currentDate.getTime() - (days * 24 * 60 * 60 * 1000));
    const startOfPreviousPeriod = new Date(currentDate.getTime() - (2 * days * 24 * 60 * 60 * 1000));

    const currentPeriodCount = await this.prisma.survivor.count({
      where: {
        isInfected: false,
        createdAt: {
          gte: startOfCurrentPeriod,
        },
      },
    });
    const previousPeriodCount = await this.prisma.survivor.count({
      where: {
        isInfected: false,
        createdAt: {
          gte: startOfPreviousPeriod,
          lt: startOfCurrentPeriod,
        },
      },
    });
    let percentageChange = 0;
    if (previousPeriodCount > 0) {
      percentageChange = ((currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100;
    }

    return { currentPeriodCount, previousPeriodCount, percentageChange };
  }
}
