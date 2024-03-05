import Survivor from '@/domain/entities/survivor.entity';

export default abstract class SurvivorRepository {
  abstract save(survivor: Survivor): Promise<void>;
  abstract create(survivor: Survivor): Promise<void>;
  abstract delete(survivorId: string): Promise<void>;
  abstract findById(survivorId: string): Promise<Survivor | null>;
  abstract findUniqueByEmail(email: string): Promise<Survivor | null>;
  abstract findMany(page: number, perPage: number): Promise<Survivor[]>;
  abstract reportInfectedSurvivorsComparison(days: number):  Promise<{currentPeriodCount: number, previousPeriodCount: number, percentageChange: number}>;
  abstract reportHealthySurvivorsComparison(days: number): Promise<{currentPeriodCount: number, previousPeriodCount: number, percentageChange: number}>;
}
