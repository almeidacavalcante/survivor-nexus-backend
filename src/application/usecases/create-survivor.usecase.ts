import { Injectable } from '@nestjs/common';
import SurvivorRepository from '@/domain/repository/survivor.repository';
import Survivor from '@/domain/entities/survivor.entity';
import Position from '@/domain/entities/value-objects/position';
import Inventory from '@/domain/entities/inventory.entity';
import Gender from '@/domain/entities/value-objects/gender';
import ApplicationException from '@/application/exceptions/application-exception';

@Injectable()
export default class CreateSurvivorUsecase {
  constructor(private readonly repository: SurvivorRepository) {}

  async execute(input: Input): Promise<Output> {
    const existingSurvivor = await this.repository.findUniqueByEmail(input.email);
    if (existingSurvivor) {
      throw new ApplicationException('Survivor already exists');
    }

    const lastLocation = new Position(input.latitude, input.longitude);
    const gender = new Gender(input.gender);

    const survivor = new Survivor({
      name: input.name,
      birthDate: input.birthDate,
      gender,
      lastLocation,
      inventory: new Inventory({ items: [] }),
      email: input.email,
      password: input.password,
    })

    if (input.isInfected) {
      survivor.getInfected()
    }

    await this.repository.create(survivor);

    return {
      id: survivor.id.toString(),
      name: survivor.name,
      birth: survivor.birthDate,
      gender: survivor.gender,
      latitude: survivor.lastLocation.latitude,
      longitude: survivor.lastLocation.longitude,
      email: survivor.email,
      isInfected: survivor.isInfected,
    };
  }
}

export type Input = {
  name: string;
  birthDate: Date;
  gender: string;
  latitude: number;
  longitude: number;
  email: string;
  password: string;
  isInfected?: boolean;
};

export type Output = {
  id: string;
  name: string;
  birth: Date;
  gender: string;
  latitude: number;
  longitude: number;
  email: string;
  isInfected: boolean;
}
