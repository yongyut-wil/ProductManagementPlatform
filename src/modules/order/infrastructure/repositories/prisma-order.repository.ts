import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../domain/order.repository.interface';
import { Order, OrderStatus } from '../../domain/order.entity';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { Prisma, OrderStatus as PrismaOrderStatus } from '@prisma/client';

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  async save(order: Order, context?: unknown): Promise<void> {
    const data = {
      userId: order.userId,
      status: order.status as unknown as PrismaOrderStatus,
      total: new Prisma.Decimal(order.total),
      items: {
        create: order.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: new Prisma.Decimal(i.price),
        })),
      },
    };

    const prisma = (context as Prisma.TransactionClient) || this.prisma;

    // Assuming new order always
    await prisma.order.create({
      data: data,
    });
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) return null;

    return Order.create(
      {
        userId: order.userId,
        items: order.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price.toNumber(),
        })),
        // Force set status and total from DB
      },
      order.id,
    );
  }
}
