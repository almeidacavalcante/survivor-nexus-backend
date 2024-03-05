import { Module } from '@nestjs/common'


import { BcryptHasher } from './bcrypt-hasher'
import { HashComparer } from '@/application/criptography/hash-comparer';
import { HashGenerator } from '@/application/criptography/hash-generator';
import { Encrypter } from '@/application/criptography/encrypter';
import { JwtEncrypter } from '@/infrastrucutre/criptography/jwt-encrypter';

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
