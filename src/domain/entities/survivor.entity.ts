import Entity from "./entity";
import Gender from "@/domain/entities/value-objects/gender";
import Position from "@/domain/entities/value-objects/position";
import Inventory from "@/domain/entities/inventory.entity";
import Item from "@/domain/entities/item.entity";

interface Props {
  name: string;
  birthDate: Date;
  gender: Gender;
  lastLocation: Position;
  email: string;
  password: string;
  inventory: Inventory;
  isInfected?: boolean;
  infectedAt?: Date;
}

export default class Survivor extends Entity<Props> {
  constructor(props: Props, id?: string) {
    super(props, id);
    this.buildInventory(props);
    if (props.isInfected) {
      this.props.isInfected = props.isInfected;
      this.props.infectedAt = props.infectedAt;
    }
  }

  private buildInventory(props: Props) {
    if (!props.inventory) this.props.inventory = new Inventory({ items: [] });
  }

  useItem(item: Item) {
    if (this.props.inventory.findItemByName(item.name)) {
      if (item.removesInfection) {
        this.props.isInfected = false;
        this.props.infectedAt = undefined;
        this.touch();
      }
      this.props.inventory.removeItem(item, 1);
    }
  }

  updatePosition(latitude: number, longitude: number): void {
    this.props.lastLocation = new Position(latitude, longitude);
    this.touch();
  }

  updateGender(gender: string) {
    this.props.gender = new Gender(gender);
    this.touch();
  }

  addItem(item: Item, quantity: number) {
    this.props.inventory.addItem(item, quantity);
  }

  removeItem(item: Item, quantity: number) {
    this.props.inventory.removeItem(item, quantity);
  }

  getInfected() {
    if (this.props.isInfected) {
      throw new Error('Survivor is already infected');
    }
    this.props.isInfected = true;
    this.props.infectedAt = new Date();
    this.touch();
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get birthDate(): Date {
    return this.props.birthDate;
  }

  get lastLocation(): Position {
    return this.props.lastLocation;
  }

  get gender(): string {
    return this.props.gender.value;
  }

  get inventory(): Inventory {
    return this.props.inventory;
  }

  get isInfected(): boolean  {
    return this.props.isInfected ?? false;
  }

  get infectedAt(): Date | undefined {
    return this.props.infectedAt;
  }

}
