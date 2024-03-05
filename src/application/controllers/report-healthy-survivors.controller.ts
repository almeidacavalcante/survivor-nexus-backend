import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import ReportHealthySurvivorsUsecase from '@/application/usecases/report-healthy-survivors.usecase';


@ApiTags('reports')
@Controller('/reports/healthy-survivors')
export default class ReportHealthySurvivorsController {
  constructor(private readonly report: ReportHealthySurvivorsUsecase) {
  }

  @Get(':days')
  async handle(
    @Param('days', ParseIntPipe) days: number,
  ) {
    return this.report.execute({ days });
  }
}
