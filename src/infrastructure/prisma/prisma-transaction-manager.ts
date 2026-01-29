import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ITransactionManager } from '../../shared/core/transaction-manager.interface';

@Injectable()
export class PrismaTransactionManager implements ITransactionManager {
  constructor(private prisma: PrismaService) {}

  async run<T>(fn: (context: unknown) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      return fn(tx);
    });
  }
}
