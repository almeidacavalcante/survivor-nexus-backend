import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PrismaService } from '@/infrastrucutre/prisma/prisma.service';
import { AppModule } from '@/app.module';
import { randomEmail } from '../test-utils';
import { AuthModule } from '@/application/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envSchema } from '@/env';

describe('Create Survivor (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ConfigService],
      imports: [AppModule, AuthModule, ConfigModule.forRoot({
        isGlobal: true,
        validate: (env) => envSchema.parse(env),
      })],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /survivors/create', async () => {
    const email = randomEmail();
    const response = await request(app.getHttpServer()).post('/survivors/create').send({
      name: 'John Doe',
      email,
      password: 'Abc@123#',
    })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.survivor.findUnique({
      where: {
        email,
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
