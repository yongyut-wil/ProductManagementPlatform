import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('orders')
export class OrderProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'order.created':
        this.logger.log(`[Queue] Processing order.created for Order ID: ${job.data.orderId}`);
        // Simulate email sending
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.logger.log(`[Queue] Email sent to User ID: ${job.data.userId}`);
        break;
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }
}
