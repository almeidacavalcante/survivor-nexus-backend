import { BadRequestException } from '@nestjs/common';

export default class ApplicationException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
