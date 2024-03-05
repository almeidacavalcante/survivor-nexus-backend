import ListSurvivorsUsecase from '@/application/usecases/list-survivors.usecase';
import { InMemoryItemRepository } from '../repository/in-memory-item.repository';
import { PrismaItemRepository } from '@/infrastrucutre/repository/prisma-item.repository';
import { PrismaService } from '@/infrastrucutre/prisma/prisma.service';
import { PrismaSurvivorRepository } from '@/infrastrucutre/repository/prisma-survivor.repository';
import Item from '@/domain/entities/item.entity';
import Survivor from '@/domain/entities/survivor.entity';
import Gender from '@/domain/entities/value-objects/gender';
import Position from '@/domain/entities/value-objects/position';
import { PrismaInventoryRepository } from '@/infrastrucutre/repository/prisma-inventory.repository';
import { expect } from 'vitest';
import Inventory from '@/domain/entities/inventory.entity';

let inMemoryItemRepository: InMemoryItemRepository;
let prismaItemRepository: PrismaItemRepository;
let prismaInventoryRepository: PrismaInventoryRepository;
let prismaSurvivorRepository: PrismaSurvivorRepository;
let sut: ListSurvivorsUsecase;

const birthDate = new Date();
const position = new Position(80, 120);

async function createTestSurvivor(email?: string) {
  const emailNameList = [
    { email: 'abc@example.com', name: 'John Doe' },
    { email: 'def@demo.com', name: 'Marc Zon' },
    { email: 'ghi@test.com', name: 'Lara Zion' },
  ];

  const selectedEmailName = emailNameList[Math.floor(Math.random() * emailNameList.length)];
  let survivor = await prismaSurvivorRepository.findUniqueByEmail(selectedEmailName.email);
  if (survivor) {
    const item = await createTestItem();
    survivor.addItem(item, 3);
    await prismaSurvivorRepository.save(survivor);
    return survivor;
  }

  survivor = new Survivor({
    name: selectedEmailName.name,
    birthDate,
    gender: new Gender('male'),
    lastLocation: position,
    email: selectedEmailName.email,
    password: 'Abc@123#',
    inventory: new Inventory({ items: [] }),
  });


  await prismaSurvivorRepository.create(survivor);
  return survivor;
}

async function createTestRequesterSurvivor() {
  const email = 'luannest@demo.com';
  let survivor = await prismaSurvivorRepository.findUniqueByEmail(email);
  if (survivor) return survivor;

  survivor = new Survivor({
    name: 'Luan Nest',
    birthDate,
    gender: new Gender('male'),
    lastLocation: position,
    email,
    password: 'Abc@123#',
    inventory: new Inventory({ items: [] }),
  });
  await prismaSurvivorRepository.create(survivor);
  return survivor;
}

async function createTestItem() {
  let item = await prismaItemRepository.findByName('Water');
  if (item) return item;

  item = new Item({
    name: `Water`,
    description: 'A bottle of water',
  });
  await prismaItemRepository.create(item);
  return item;
}

describe('List Survivors Test', () => {
  beforeEach(() => {
    const prismaService = new PrismaService();

    inMemoryItemRepository = new InMemoryItemRepository();
    prismaItemRepository = new PrismaItemRepository(prismaService);
    prismaInventoryRepository = new PrismaInventoryRepository(prismaService);
    prismaSurvivorRepository = new PrismaSurvivorRepository(prismaService, prismaInventoryRepository);
    sut = new ListSurvivorsUsecase(prismaItemRepository, prismaSurvivorRepository);
  });

  it('should be able to list the survivors', async () => {
    const survivors = await sut.execute({
      page: 1,
      perPage: 10,
    });

    expect(survivors).toBeDefined();
    console.log(survivors);
  });
});
