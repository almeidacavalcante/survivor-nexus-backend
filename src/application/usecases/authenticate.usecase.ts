import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import SurvivorRepository from '@/domain/repository/survivor.repository';
import { HashComparer } from '@/application/criptography/hash-comparer';

@Injectable()
export default class AuthenticateUsecase {
  constructor(
    private readonly accountRepository: SurvivorRepository,
    private readonly jwtService: JwtService,
    private readonly hashComparer: HashComparer,
  ) {}

  async execute(input: Input) {
    const existingAccount = await this.accountRepository.findUniqueByEmail(
      input.email,
    );

    if (!existingAccount) {
      throw new UnauthorizedException('Invalid account credentials');
    }

    const isPasswordValid = await this.hashComparer.compare(
      existingAccount.password,
      input.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid account credentials');
    }

    const accessToken = this.jwtService.sign({ sub: existingAccount.id });
    return { access_token: accessToken };
  }
}

export type Input = {
  email: string;
  password: string;
};
