import ReportInfectedSurvivorsUsecase from '@/application/usecases/report-infected-survivors.usecase';
import { InMemorySurvivorRepository } from '../repository/in-memory-survivor.repository';
import { randomEmail } from '../test-utils';
import { PrismaSurvivorRepository } from '@/infrastrucutre/repository/prisma-survivor.repository';
import { PrismaService } from '@/infrastrucutre/prisma/prisma.service';
import { PrismaInventoryRepository } from '@/infrastrucutre/repository/prisma-inventory.repository';
import { afterEach, expect } from 'vitest';
import Survivor from '@/domain/entities/survivor.entity';
import Gender from '@/domain/entities/value-objects/gender';
import Inventory from '@/domain/entities/inventory.entity';
import Position from '@/domain/entities/value-objects/position';

let inMemorySurvivorRepository: InMemorySurvivorRepository;
let prismaSurvivorRepository: PrismaSurvivorRepository;
let prismaInventoryRepository: PrismaInventoryRepository;
let sut: ReportInfectedSurvivorsUsecase;
let testSurvivor: Survivor;

describe('Report Infected Survivor test', () => {
  beforeEach(async () => {
    const prismaService = new PrismaService();

    inMemorySurvivorRepository = new InMemorySurvivorRepository();
    prismaInventoryRepository = new PrismaInventoryRepository(prismaService);
    prismaSurvivorRepository = new PrismaSurvivorRepository(prismaService, prismaInventoryRepository);

    testSurvivor = new Survivor({
      name: 'Bora Test',
      birthDate: new Date('1990-01-01'),
      gender: new Gender('male'),
      lastLocation: new Position(80, 120),
      email: randomEmail(),
      password: 'Abc@123#',
      inventory: new Inventory({items: []})
    });
    await prismaSurvivorRepository.create(testSurvivor);

    sut = new ReportInfectedSurvivorsUsecase(prismaSurvivorRepository);
  });

  afterEach(async () => {
    await prismaSurvivorRepository.delete(testSurvivor.id.toString());
  });

  it('should display the infection report for the last 15 days', async () => {
    testSurvivor.getInfected()
    await prismaSurvivorRepository.save(testSurvivor)

    const result = await sut.execute({ days: 1 })

    console.log(result);
    expect(result.count).toBeGreaterThanOrEqual(1);

  });
});
