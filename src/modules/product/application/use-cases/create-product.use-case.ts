import { Injectable, Inject } from '@nestjs/common';
import { UseCase } from '../../../../shared/core/use-case.interface';
import { CreateProductDto } from '../dto/create-product.dto';
import { IProductRepository } from '../../domain/product.repository.interface';
import { Result } from '../../../../shared/core/result';
import { Product } from '../../domain/product.entity';

@Injectable()
export class CreateProductUseCase implements UseCase<CreateProductDto, Promise<Result<void>>> {
  constructor(
    @Inject(IProductRepository) private productRepository: IProductRepository,
  ) {}

  async execute(request: CreateProductDto): Promise<Result<void>> {
    const product = Product.create({
      name: request.name,
      description: request.description,
      price: request.price,
      stock: request.stock,
    });

    await this.productRepository.save(product);

    return Result.ok();
  }
}
