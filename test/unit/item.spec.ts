import Item from "@/domain/entities/item.entity";

describe('Item Unit Tests', () => {

  it ('should create an item successfully', () => {
    const item = new Item({
      name: 'Test Item',
      description: 'A test item'
    });

    expect(item).toBeInstanceOf(Item);
    expect(item.name).toBe('Test Item');
    expect(item.description).toBe('A test item');
  });

  it ('should create an item that removes infection successfully', () => {
    const itemWithRemovesInfection = new Item({
      name: 'Test C-Virus Antidote',
      description: 'A C-Virus Antidote',
      removesInfection: true
    });

    expect(itemWithRemovesInfection).toBeInstanceOf(Item);
    expect(itemWithRemovesInfection.name).toBe('Test C-Virus Antidote');
    expect(itemWithRemovesInfection.description).toBe('A C-Virus Antidote');
  });
});
