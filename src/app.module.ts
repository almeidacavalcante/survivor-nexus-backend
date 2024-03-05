import { Module } from '@nestjs/common';

import { PrismaService } from './infrastrucutre/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { AuthModule } from './application/auth/auth.module';
import CreateSurvivorController from '@/application/controllers/create-survivor.controller';
import CreateSurvivorUsecase from '@/application/usecases/create-survivor.usecase';
import SurvivorRepository from '@/domain/repository/survivor.repository';
import { PrismaSurvivorRepository } from '@/infrastrucutre/repository/prisma-survivor.repository';
import { CryptographyModule } from '@/infrastrucutre/criptography/cryptography.module';
import { PrismaInventoryRepository } from '@/infrastrucutre/repository/prisma-inventory.repository';
import InventoryRepository from '@/domain/repository/inventory.repository';
import ListSurvivorsController from '@/application/controllers/list-survivors.controller';
import ListSurvivorsUsecase from '@/application/usecases/list-survivors.usecase';
import ItemRepository from '@/domain/repository/item.repository';
import RequestItemController from '@/application/controllers/request-item.controller';
import RequestItemUsecase from '@/application/usecases/request-item.usecase';
import ReportInfectedSurvivorsUsecase from '@/application/usecases/report-infected-survivors.usecase';
import ReportInfectedSurvivorsController from '@/application/controllers/report-infected-survivors.controller';
import ReportHealthySurvivorsUsecase from '@/application/usecases/report-healthy-survivors.usecase';
import ReportHealthySurvivorsController from '@/application/controllers/report-healthy-survivors.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    AuthModule,
    CryptographyModule,
  ],
  controllers: [
    CreateSurvivorController,
    ListSurvivorsController,
    RequestItemController,
    ReportInfectedSurvivorsController,
    ReportHealthySurvivorsController
  ],
  providers: [
    PrismaService,
    {
      provide: SurvivorRepository,
      useClass: PrismaSurvivorRepository
    },
    {
      provide: InventoryRepository,
      useClass: PrismaInventoryRepository
    },
    {
      provide: ItemRepository,
      useClass: PrismaInventoryRepository
    },
    CreateSurvivorUsecase,
    ListSurvivorsUsecase,
    RequestItemUsecase,
    ReportInfectedSurvivorsUsecase,
    ReportHealthySurvivorsUsecase
  ],
})
export class AppModule {}
