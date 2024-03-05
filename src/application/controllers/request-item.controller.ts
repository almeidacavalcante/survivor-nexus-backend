import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { Validate } from '../pipes/zod-validation-pipe';
import RequestItemUsecase from '../usecases/request-item.usecase';
import { ApiBody, ApiTags } from '@nestjs/swagger';

const requestItemBodySchema = z.object({
  requesterId: z.string(),
  survivorId: z.string(),
  itemId: z.string(),
  quantity: z.number().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

type RequestItemBody = z.infer<typeof requestItemBodySchema>;

@ApiTags('items')
@Controller('/items/request')
export default class RequestItemController {
  constructor(private readonly requestItem: RequestItemUsecase) {
  }

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        requesterId: { type: 'string', example: '87e7acc3-3a52-4907-a02f-f11617df8832'},
        survivorId: { type: 'string', example: '87e7acc3-3a52-4907-a02f-f11617df8832'},
        itemId: { type: 'string', example: '87e7acc3-3a52-4907-a02f-f11617df8832'},
        quantity: { type: 'number', example: 1},
        latitude: { type: 'number', example: -23.550520},
        longitude: { type: 'number', example: -46.633308},
      },
    },
  })
  @UsePipes(new Validate(requestItemBodySchema))
  async handle(
    @Body() body: RequestItemBody,
  ) {
    const input = {
      ...body,
    };
    return this.requestItem.execute(input);
  }
}
