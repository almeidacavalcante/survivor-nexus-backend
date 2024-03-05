import CreateItemUsecase from '@/application/usecases/create-item.usecase';
import { InMemoryItemRepository } from '../repository/in-memory-item.repository';
import { PrismaItemRepository } from '@/infrastrucutre/repository/prisma-item.repository';
import { PrismaService } from '@/infrastrucutre/prisma/prisma.service';
import { randomString } from '../test-utils';

let inMemoryItemRepository: InMemoryItemRepository
let prismaItemRepository: PrismaItemRepository
let sut: CreateItemUsecase

describe('Create Item', () => {
  beforeEach(() => {
    const prismaService = new PrismaService()

    inMemoryItemRepository = new InMemoryItemRepository()
    prismaItemRepository = new PrismaItemRepository(prismaService)
    sut = new CreateItemUsecase(prismaItemRepository)
  })

  it('should be able to create a item', async () => {
    const randomSuffix = randomString();

    const result = await sut.execute({
      name: `Potable Water ${randomSuffix}`,
      description: 'Water that is safe to drink',
    })

    expect(result.name).toBe(`Potable Water ${randomSuffix}`)
    expect(result.description).toBe('Water that is safe to drink')
    expect(result.removesInfection).toBe(false)
  })

  it('should be able to create a item that removes infection', async () => {
    const randomSuffix = randomString()

    const result = await sut.execute({
      name: `Medicine ${randomSuffix}`,
      description: 'A medicine that cures infections',
      removesInfection: true,
    })

    expect(result.name).toBe(`Medicine ${randomSuffix}`)
    expect(result.description).toBe('A medicine that cures infections')
    expect(result.removesInfection).toBe(true)
  })
})
