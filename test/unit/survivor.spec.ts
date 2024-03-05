import Gender from "@/domain/entities/value-objects/gender";
import Position from "@/domain/entities/value-objects/position";
import Survivor from "@/domain/entities/survivor.entity";
import {expect} from "vitest";
import Item from "@/domain/entities/item.entity";
import Inventory from "@/domain/entities/inventory.entity";


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

function createTestSurvivor() {
  const survivor = new Survivor({
    name: 'Test Survivor',
    birthDate,
    gender: new Gender('male'),
    lastLocation: position,
    email: randomEmail,
    password: 'Abc@123#',
    inventory: new Inventory({
      items: [
        {
          item: waterItem,
          quantity: 5
        },
        {
          item: foodItem,
          quantity: 10
        },
        {
          item: cVirusAntidote,
          quantity: 1
        }
      ]
    })
  });
  return survivor;
}

describe('Survivor Entity Unit Test', () => {

  it('should create a Survivor successfully', () => {
    const survivor = createTestSurvivor();

    expect(survivor).toBeInstanceOf(Survivor);
    expect(survivor.name).toBe('Test Survivor');
    expect(survivor.email).toBe(randomEmail);
    expect(survivor.birthDate).toStrictEqual(birthDate);
    expect(survivor.lastLocation).toStrictEqual(position);
  });

  it('should update a Survivor position successfully', () => {
    const survivor = createTestSurvivor();
    survivor.updatePosition(90, 180);
    expect(survivor.lastLocation.latitude).toBe(90);
    expect(survivor.lastLocation.longitude).toBe(180);
    expect(survivor.updatedAt).not.toBeNull();
  });

  it('should throw an error when updating a Survivor position with wrong latitude', () => {
    const survivor = createTestSurvivor();
    expect(() => {
      survivor.updatePosition(91, 180);
    }).toThrowError('Latitude must be between -90 and 90');
  });

  it('should update the gender of a Survivor successfully - should change updatedAt accordingly', () => {
    vi.useFakeTimers();
    const survivor = createTestSurvivor();
    survivor.updateGender('female');
    expect(survivor.gender).toBe('female');
    expect(survivor.updatedAt).not.toBeNull();
    vi.advanceTimersByTime(1000);
    const lastUpdate = survivor.updatedAt?.getTime();
    survivor.updateGender('other');
    expect(survivor.gender).toBe('other');
    expect(survivor.updatedAt?.getTime()).toBeGreaterThan(lastUpdate);
  });

  it('should add an item to the inventory successfully', () => {
    const survivor = createTestSurvivor();
    survivor.addItem(medicationItem, 3);
    expect(survivor.inventory.findItemByName('Medication')?.item.name).toBe('Medication');
    expect(survivor.inventory.findItemByName('Medication')?.quantity).toBe(3);
  });

  it('should remove an item from the inventory successfully', () => {
    const survivor = createTestSurvivor();
    survivor.removeItem(foodItem, 5);
    expect(survivor.inventory.findItemByName('Food')?.quantity).toBe(5);
  });

  it('should mark a Survivor as infected successfully', () => {
    const survivor = createTestSurvivor();
    survivor.getInfected();
    expect(survivor.isInfected).toBe(true);
    expect(survivor.infectedAt).not.toBeNull();
  });

  it('should throw an error when marking a Survivor as infected more than once', () => {
    const survivor = createTestSurvivor();
    survivor.getInfected();
    expect(() => {
      survivor.getInfected();
    }).toThrowError('Survivor is already infected');
  });

  it('should cure infection by using C-Virus Antidote', () => {
    const survivor = createTestSurvivor();
    survivor.getInfected();
    survivor.useItem(cVirusAntidote);
    expect(survivor.isInfected).toBe(false);
    expect(survivor.infectedAt).toBeUndefined();
    expect(survivor.inventory.findItemByName('C-Virus Antidote')?.quantity).toBe(undefined);
    console.log(survivor.inventory.items);
  });
});
