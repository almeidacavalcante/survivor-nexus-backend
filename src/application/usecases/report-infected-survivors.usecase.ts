import { Injectable } from '@nestjs/common';
import ItemRepository from '@/domain/repository/item.repository';
import Item from '@/domain/entities/item.entity';
import ApplicationException from '@/application/exceptions/application-exception';
import SurvivorRepository from '@/domain/repository/survivor.repository';
import Position from '@/domain/entities/value-objects/position';
import request from 'supertest';

@Injectable()
export default class ReportInfectedSurvivorsUsecase {
  constructor(
    private readonly survivorRepository: SurvivorRepository,
  ) {
  }

  async execute({ days }: Input): Promise<Output> {
    const {
      percentageChange,
      previousPeriodCount,
      currentPeriodCount,
    } = await this.survivorRepository.reportInfectedSurvivorsComparison(days);

    return {
      percentageChange,
      previousPeriodCount,
      currentPeriodCount,
    };
  }
}

export type Input = {
  days: number;
};

export type Output = {
  percentageChange: number,
  previousPeriodCount: number,
  currentPeriodCount: number,
}
