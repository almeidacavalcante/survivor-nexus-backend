import { Injectable } from '@nestjs/common';
import ItemRepository from '@/domain/repository/item.repository';
import Item from '@/domain/entities/item.entity';
import ApplicationException from '@/application/exceptions/application-exception';
import SurvivorRepository from '@/domain/repository/survivor.repository';
import Position from '@/domain/entities/value-objects/position';
import request from 'supertest';

@Injectable()
export default class ReportHealthySurvivorsUsecase {
  constructor(
    private readonly survivorRepository: SurvivorRepository,
  ) {
  }

  async execute({ days }: Input): Promise<Output> {
    return await this.survivorRepository.reportHealthySurvivorsComparison(days);
  }
}

export type Input = {
  days: number;
};

export type Output = {
  currentPeriodCount: number,
  previousPeriodCount: number,
  percentageChange: number,
}
