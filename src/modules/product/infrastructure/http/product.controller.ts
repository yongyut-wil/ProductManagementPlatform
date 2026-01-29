import { Controller, Post, Body, Get, BadRequestException } from '@nestjs/common';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { CreateProductDto } from '../../application/dto/create-product.dto';
import { ApiResponse } from '../../../../shared/dto/response.dto';
import { Inject } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.interface';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    @Inject(IProductRepository) private readonly productRepo: IProductRepository,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    const result = await this.createProductUseCase.execute(dto);
    if (result.isFailure) {
      throw new BadRequestException(ApiResponse.error(result.error as string));
    }
    return ApiResponse.success(null, 'Product created successfully');
  }

  @Get()
  async findAll() {
    const products = await this.productRepo.findAll();
    return ApiResponse.success(products);
  }
}
