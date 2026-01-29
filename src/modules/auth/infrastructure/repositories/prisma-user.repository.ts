import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.interface';
import { User, UserRole } from '../../domain/user.entity';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    const data = {
      email: user.email,
      password: user.password!,
      name: user.name,
      role: user.role === UserRole.ADMIN ? Role.ADMIN : Role.USER,
    };

    if (user.id) {
      await this.prisma.user.upsert({
        where: { id: user.id },
        update: data,
        create: { ...data, id: user.id },
      });
    } else {
      await this.prisma.user.create({
        data: data,
      });
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({ where: { email } });
    if (!prismaUser) return null;
    return this.toDomain(prismaUser);
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({ where: { id } });
    if (!prismaUser) return null;
    return this.toDomain(prismaUser);
  }

  private toDomain(prismaUser: any): User {
    return User.create(
      {
        email: prismaUser.email,
        password: prismaUser.password,
        name: prismaUser.name,
        role: prismaUser.role === Role.ADMIN ? UserRole.ADMIN : UserRole.USER,
        createdAt: prismaUser.createdAt,
        updatedAt: prismaUser.updatedAt,
      },
      prismaUser.id,
    );
  }
}
