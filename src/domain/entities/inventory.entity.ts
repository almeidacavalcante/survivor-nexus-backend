import Item from "@/domain/entities/item.entity";

export interface InventoryItem {
  item: Item;
  quantity: number;
}

interface Props {
  items: InventoryItem[];
}

export default class Inventory {
  protected props: Props;

  constructor(props: Props) {
    this.props = props;
  }

  get items(): InventoryItem[] {
    return this.props.items;
  }

  addItem(item: Item, quantity: number) {
    const inventoryItem = this.items.find((i) => i.item.id.equals(item.id));
    if (inventoryItem) {
      inventoryItem.quantity += quantity;
    } else {
      this.items.push({ item, quantity });
    }
  }

  removeItem(item: Item, quantity: number) {
    console.log(this.items);

    const inventoryItem = this.items.find((i) => {
      return i.item.id.equals(item.id);
    });
    if (!inventoryItem) {
      throw new Error("Item not found in inventory");
    }
    if (inventoryItem && inventoryItem.quantity >= quantity) {
      inventoryItem.quantity -= quantity;
    }
    if (inventoryItem && inventoryItem.quantity === 0) {
      this.props.items = this.items.filter((i) => !i.item.id.equals(item.id));
    }
  }

  findItemByName(name: string): InventoryItem | undefined {
    return this.props.items.find((i) => i.item.name === name);
  }

  findItemById(id: string): InventoryItem | undefined {
    return this.props.items.find((i) => i.item.id.toString() === id);
  }
}
