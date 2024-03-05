import Item from '@/domain/entities/item.entity';

export default abstract class ItemRepository {
  abstract save(item: Item): Promise<void>;
  abstract create(item: Item): Promise<void>;
  abstract findById(itemId: string): Promise<Item | null>;
  abstract findByName(name: string): Promise<Item | null>;
}
