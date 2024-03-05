import RequestItemUsecase from '@/application/usecases/request-item.usecase';
import { InMemoryItemRepository } from '../repository/in-memory-item.repository';
import { PrismaItemRepository } from '@/infrastrucutre/repository/prisma-item.repository';
import { PrismaService } from '@/infrastrucutre/prisma/prisma.service';
import { PrismaSurvivorRepository } from '@/infrastrucutre/repository/prisma-survivor.repository';
import Item from '@/domain/entities/item.entity';
import { randomString } from '../test-utils';
import Survivor from '@/domain/entities/survivor.entity';
import Gender from '@/domain/entities/value-objects/gender';
import Inventory from '@/domain/entities/inventory.entity';
import Position from '@/domain/entities/value-objects/position';
import { PrismaInventoryRepository } from '@/infrastrucutre/repository/prisma-inventory.repository';
import { expect } from 'vitest';

let inMemoryItemRepository: InMemoryItemRepository
let prismaItemRepository: PrismaItemRepository
let prismaInventoryRepository: PrismaInventoryRepository
let prismaSurvivorRepository: PrismaSurvivorRepository
let sut: RequestItemUsecase

const birthDate = new Date();
const position = new Position(80, 120);
const randomEmail = Math.random().toString(36).substring(2) + '@gmail.com';
const waterItem = new Item({name: 'Water', description: 'A bottle of water'});
const foodItem = new Item({name: 'Food', description: 'A can of food'});
const medicationItem = new Item({name: 'Medication', description: 'A box of medication'});
const cVirusAntidote = new Item({
  name: 'C-Virus Antidote',
  description: 'A vial of C-Virus Antidote',
  removesInfection: true
});

export async function createTestSurvivor(email?: string) {
  const emailNameList = [
    {email: 'abc@example.com' , name: 'John Doe'},
    {email: 'def@demo.com' , name: 'Marc Zon'},
    {email: 'ghi@test.com' , name: 'Lara Zion'},
  ]

  const selectedEmailName = emailNameList[Math.floor(Math.random() * emailNameList.length)];
  let survivor = await prismaSurvivorRepository.findUniqueByEmail(selectedEmailName.email);
  if (survivor) {
    const item = await createTestItem()
    survivor.addItem(item, 3)
    await prismaSurvivorRepository.save(survivor)
    return survivor;
  }

  survivor = new Survivor({
    name: selectedEmailName.name,
    birthDate,
    gender: new Gender('male'),
    lastLocation: position,
    email: selectedEmailName.email,
    password: 'Abc@123#',
    isInfected: false,
    inventory: new Inventory({items: []})
  });


  await prismaSurvivorRepository.create(survivor)
  return survivor
}

async function createTestRequesterSurvivor() {
  const email = 'luannest@demo.com'
  let survivor = await prismaSurvivorRepository.findUniqueByEmail(email);
  if (survivor) return survivor;

  survivor = new Survivor({
    name: 'Luan Nest',
    birthDate,
    gender: new Gender('male'),
    lastLocation: position,
    email,
    password: 'Abc@123#',
    isInfected: false,
    inventory: new Inventory({items: []})
  });
  await prismaSurvivorRepository.create(survivor)
  return survivor
}

async function createTestItem() {
  let item = await prismaItemRepository.findByName('Water');
  if (item) return item;

  item = new Item({
    name: `Water`,
    description: 'A bottle of water',
  });
  await prismaItemRepository.create(item)
  return item
}

describe('Request Item', () => {
  beforeEach(() => {
    const prismaService = new PrismaService()

    inMemoryItemRepository = new InMemoryItemRepository()
    prismaItemRepository = new PrismaItemRepository(prismaService)
    prismaInventoryRepository = new PrismaInventoryRepository(prismaService)
    prismaSurvivorRepository = new PrismaSurvivorRepository(prismaService, prismaInventoryRepository)
    sut = new RequestItemUsecase(prismaItemRepository, prismaSurvivorRepository)
  })

  it('should be able to request an item', async () => {
    const item = await createTestItem()
    let requester = await createTestRequesterSurvivor()
    let survivor = await createTestSurvivor()

    const randomNumber = Math.floor(Math.random() * 21) - 10;
    const latitude = 75 + randomNumber;
    const longitude = 115 + randomNumber;

    const result = await sut.execute({
      requesterId: requester.id.toString(),
      survivorId: survivor.id.toString(),
      itemId: item.id.toString(),
      quantity: 1,
      latitude,
      longitude,
    })

    console.log(result);
    expect(result).toBeDefined()

    survivor = await prismaSurvivorRepository.findById(survivor.id.toString());
    expect(survivor?.lastLocation.latitude).toBe(latitude);
    expect(survivor?.lastLocation.longitude).toBe(longitude);
  })
})
