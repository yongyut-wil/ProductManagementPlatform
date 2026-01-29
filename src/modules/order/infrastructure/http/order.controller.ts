import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PlaceOrderUseCase } from '../../application/use-cases/place-order.use-case';
import { PlaceOrderDto } from '../../application/dto/place-order.dto';
import { ApiResponse } from '../../../../shared/dto/response.dto';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly placeOrderUseCase: PlaceOrderUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Place a new order' })
  @SwaggerApiResponse({ status: 201, description: 'Order placed successfully' })
  @SwaggerApiResponse({ status: 400, description: 'Invalid order or insufficient stock' })
  async placeOrder(@Body() dto: PlaceOrderDto) {
    const result = await this.placeOrderUseCase.execute(dto);
    if (result.isFailure) {
      throw new BadRequestException(ApiResponse.error(result.error as string));
    }
    return ApiResponse.success(null, 'Order placed successfully');
  }
}
