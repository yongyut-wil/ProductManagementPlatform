import { Injectable, Inject } from '@nestjs/common';
import { UseCase } from '../../../../shared/core/use-case.interface';
import { PlaceOrderDto } from '../dto/place-order.dto';
import { IOrderRepository } from '../../domain/order.repository.interface';
import { IProductRepository } from '../../../product/domain/product.repository.interface';
import { OrderProducer } from '../../infrastructure/queue/order.producer';
import { Result } from '../../../../shared/core/result';
import { Order } from '../../domain/order.entity';

@Injectable()
export class PlaceOrderUseCase implements UseCase<PlaceOrderDto, Promise<Result<void>>> {
  constructor(
    @Inject(IOrderRepository) private orderRepo: IOrderRepository,
    @Inject(IProductRepository) private productRepo: IProductRepository,
    private orderProducer: OrderProducer,
  ) {}

  async execute(request: PlaceOrderDto): Promise<Result<void>> {
    const items = [];
    for (const item of request.items) {
      const product = await this.productRepo.findById(item.productId);
      if (!product) return Result.fail(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) return Result.fail(`Insufficient stock for ${product.name}`);
      items.push({ productId: product.id, quantity: item.quantity, price: product.price });
    }

    const order = Order.create({
      userId: request.userId,
      items: items,
    });

    await this.orderRepo.save(order);

    for (const item of items) {
      await this.productRepo.updateStock(item.productId, item.quantity);
    }

    await this.orderProducer.addOrderCreatedJob(order.id, order.userId);

    return Result.ok();
  }
}
