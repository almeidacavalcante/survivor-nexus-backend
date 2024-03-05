import { Survivor as PrismaSurvivor, Prisma } from '@prisma/client';
import Survivor from '@/domain/entities/survivor.entity';
import Gender from '@/domain/entities/value-objects/gender';
import Position from '@/domain/entities/value-objects/position';
import Inventory from '@/domain/entities/inventory.entity';
import EntityId from '@/domain/entities/entity-id';

export class PrismaSurvivorMapper {
  static toDomain(raw: PrismaSurvivor): Survivor {
    return new Survivor(
      {
        name: raw.name,
        birthDate: raw.birthDate,
        gender: new Gender(raw.gender),
        lastLocation: new Position(raw.latitude, raw.longitude),
        inventory: new Inventory({
          // @ts-ignore
          items: raw.inventory.map(r => (
            {
              item: {
                id: new EntityId(r.item.id),
                name: r.item.name,
                description: r.item.description,
                removesInfection: r.item.removesInfection,
              },
              quantity: r.quantity,
            }
          )),
        }),
        email: raw.email,
        password: raw.password,
        isInfected: raw.isInfected,
      },
      raw.id,
    );
  }

  static toPrisma(survivor: Survivor): Prisma.SurvivorUncheckedCreateInput {
    return {
      id: survivor.id?.value,
      name: survivor.name,
      birthDate: survivor.birthDate,
      gender: survivor.gender,
      latitude: survivor.lastLocation.latitude,
      longitude: survivor.lastLocation.longitude,
      email: survivor.email,
      password: survivor.password,
      isInfected: survivor.isInfected,
      infectedAt: survivor.infectedAt,
    };
  }
}
