import { BadRequestException } from '@nestjs/common';

export default class DomainException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
