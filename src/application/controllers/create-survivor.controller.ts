import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { Validate } from '../pipes/zod-validation-pipe';
import CreateSurvivorUseCase from '../usecases/create-survivor.usecase';
import { ApiBody, ApiTags } from '@nestjs/swagger';

const createSurvivorBodySchema = z.object({
  name: z.string(),
  birthDate: z.string(),
  gender: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  email: z.string(),
  password: z.string(),
  isInfected: z.boolean(),
});

type CreateSurvivorBody = z.infer<typeof createSurvivorBodySchema>;

@ApiTags('survivors')
@Controller('/survivors/create')
export default class CreateSurvivorController {
  constructor(private readonly createSurvivor: CreateSurvivorUseCase) {
  }

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        birthDate: { type: 'string', example: '1990-01-01' },
        gender: { type: 'string', example: 'male' },
        latitude: { type: 'number', example: -23.55052 },
        longitude: { type: 'number', example: -46.633308 },
        email: { type: 'string', example: 'asd@demo.com' },
        password: { type: 'string', example: 'asd123@D' },
        isInfected: { type: 'boolean', example: false },
      },
    },
  })
  @UsePipes(new Validate(createSurvivorBodySchema))
  async handle(
    @Body() body: CreateSurvivorBody,
  ) {
    const input = {
      ...body,
      birthDate: new Date(body.birthDate),
    };
    return this.createSurvivor.execute(input);
  }
}
