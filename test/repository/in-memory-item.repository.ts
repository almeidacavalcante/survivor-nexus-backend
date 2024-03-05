import Item from '@/domain/entities/item.entity';
import ItemRepository from '@/domain/repository/item.repository';
import EntityId from '@/domain/entities/entity-id';

export class InMemoryItemRepository implements ItemRepository {
  public items: Item[] = []

  async findById(id: string) {
    const item = this.items.find((item) => item.id.equals(new EntityId(id)) )

    if (!item) {
      return null
    }

    return item
  }

  async findByName(name: string) {
    const item = this.items.find((item) => item.name === name)

    if (!item) {
      return null
    }

    return item
  }

  async save(item: Item) {
    this.items.push(item)
  }

  async create(item: Item) {
    this.items.push(item)
  }
}
