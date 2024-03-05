import Survivor from '@/domain/entities/survivor.entity';
import SurvivorRepository from '@/domain/repository/survivor.repository';
import EntityId from '@/domain/entities/entity-id';

export class InMemorySurvivorRepository extends SurvivorRepository {
  async create(survivor: Survivor): Promise<void> {
    this.survivors.push(survivor);
  }

  async findUniqueByEmail(email: string): Promise<Survivor | null> {
    const survivor = this.survivors.find((item) => item.email === email);

    if (!survivor) {
      return null;
    }

    return survivor;
  }

  public survivors: Survivor[] = [];

  async findById(id: string): Promise<Survivor | null> {
    const survivor = this.survivors.find((item) => item.id.equals(new EntityId(id)));

    if (!survivor) {
      return null;
    }

    return survivor;
  }

  async save(survivor: Survivor): Promise<void> {
    this.survivors.push(survivor);
  }
}


