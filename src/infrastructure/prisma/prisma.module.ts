import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaTransactionManager } from './prisma-transaction-manager';
import { ITransactionManager } from '../../shared/core/transaction-manager.interface';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: ITransactionManager,
      useClass: PrismaTransactionManager,
    },
  ],
  exports: [PrismaService, ITransactionManager],
})
export class PrismaModule {}
