import { Module } from '@nestjs/common';
import { ProductController } from './infrastructure/http/product.controller';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';
import { IProductRepository } from './domain/product.repository.interface';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    {
      provide: IProductRepository,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [IProductRepository],
})
export class ProductModule {}
