import {randomUUID} from "node:crypto";

export default class EntityId {
  private readonly _value: string;

  constructor(id?: string) {
    this._value = id || randomUUID();
  }

  get value(): string {
    return this._value;
  }

  equals(id: EntityId): boolean {
    return this._value === id.value;
  }

  toString(): string {
    return this._value;
  }
}
