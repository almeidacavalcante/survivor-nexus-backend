import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import FindSurvivorByIdUsecase from '@/application/usecases/find-survivor-by-id.usecase';


@ApiTags('survivors')
@Controller('/survivors/findById')
export default class FindSurvivorByIdController {
  constructor(private readonly usecase: FindSurvivorByIdUsecase) {
  }

  @Get(':survivorId')
  async handle(
    @Param('survivorId') survivorId: string,
  ) {
    return this.usecase.execute({ survivorId });
  }
}
