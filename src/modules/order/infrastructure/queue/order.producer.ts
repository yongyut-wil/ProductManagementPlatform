import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class OrderProducer {
  constructor(@InjectQueue('orders') private orderQueue: Queue) {}

  async addOrderCreatedJob(orderId: string, userId: string) {
    await this.orderQueue.add('order.created', {
      orderId,
      userId,
      timestamp: new Date(),
    });
  }
}
