import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import ListSurvivorsUsecase from '@/application/usecases/list-survivors.usecase';


@ApiTags('survivors')
@Controller('/survivors/list')
export default class ListSurvivorsController {
  constructor(private readonly listSurvivors: ListSurvivorsUsecase) {
  }

  @Get(':page/:perPage')
  async handle(
    @Param('page', ParseIntPipe) page: number,
    @Param('perPage', ParseIntPipe) perPage: number,
  ) {
    return this.listSurvivors.execute({ page, perPage });
  }
}
