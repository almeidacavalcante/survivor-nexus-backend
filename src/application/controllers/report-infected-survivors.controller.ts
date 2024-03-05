import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import ReportInfectedSurvivorsUsecase from '@/application/usecases/report-infected-survivors.usecase';


@ApiTags('reports')
@Controller('/reports/infected-survivors')
export default class ReportInfectedSurvivorsController {
  constructor(private readonly report: ReportInfectedSurvivorsUsecase) {
  }

  @Get(':days')
  async handle(
    @Param('days', ParseIntPipe) days: number,
  ) {
    return this.report.execute({ days });
  }
}
