import CreateSurvivorUsecase from '@/application/usecases/create-survivor.usecase';
import { InMemorySurvivorRepository } from '../repository/in-memory-survivor.repository';
import { randomEmail } from '../test-utils';
import { PrismaSurvivorRepository } from '@/infrastrucutre/repository/prisma-survivor.repository';
import { PrismaService } from '@/infrastrucutre/prisma/prisma.service';
import { PrismaInventoryRepository } from '@/infrastrucutre/repository/prisma-inventory.repository';

let inMemorySurvivorRepository: InMemorySurvivorRepository;
let prismaSurvivorRepository: PrismaSurvivorRepository;
let prismaInventoryRepository: PrismaInventoryRepository;
let sut: CreateSurvivorUsecase;

describe('Create Survivor', () => {
  beforeEach(() => {
    const prismaService = new PrismaService();

    inMemorySurvivorRepository = new InMemorySurvivorRepository();
    prismaInventoryRepository = new PrismaInventoryRepository(prismaService);
    prismaSurvivorRepository = new PrismaSurvivorRepository(prismaService, prismaInventoryRepository);
    sut = new CreateSurvivorUsecase(prismaSurvivorRepository);
  });

  it('should be able to create a survivor', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      gender: 'male',
      latitude: 80,
      longitude: 120,
      email: randomEmail(),
      password: 'Abc@123#',
    });

    console.log(result);

    expect(result).toBeDefined();
    expect(result.name).toBe('John Doe');

    const found = await prismaSurvivorRepository.findById(result.id);
    expect(found).toBeDefined();
  });

  it('should create an infected survivor', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      birthDate: new Date('1990-01-03'),
      gender: 'male',
      latitude: 80,
      longitude: 120,
      email: randomEmail(),
      password: 'Abc@123#',
      isInfected: true});

    expect(result).toBeDefined();
    expect(result.isInfected).toBe(true);
  })
});
