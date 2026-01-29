import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { OrderController } from './infrastructure/http/order.controller';
import { PlaceOrderUseCase } from './application/use-cases/place-order.use-case';
import { PrismaOrderRepository } from './infrastructure/repositories/prisma-order.repository';
import { IOrderRepository } from './domain/order.repository.interface';
import { OrderProducer } from './infrastructure/queue/order.producer';
import { OrderProcessor } from './infrastructure/queue/order.processor';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    PrismaModule,
    ProductModule,
    BullModule.registerQueue({
      name: 'orders',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
      },
    }),
  ],
  controllers: [OrderController],
  providers: [
    PlaceOrderUseCase,
    OrderProducer,
    OrderProcessor,
    {
      provide: IOrderRepository,
      useClass: PrismaOrderRepository,
    },
  ],
})
export class OrderModule {}
