import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './infrastructure/http/auth.controller';
import { RegisterUserUseCase } from './application/use-cases/register.use-case';
import { LoginUserUseCase } from './application/use-cases/login.use-case';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { IUserRepository } from './domain/user.repository.interface';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'secret',
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    JwtStrategy,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
