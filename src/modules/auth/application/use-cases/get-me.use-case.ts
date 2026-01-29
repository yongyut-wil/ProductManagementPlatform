import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.interface';
import { Result } from '../../../../shared/core/result';
import { UserRole } from '../../domain/user.entity';

export interface GetMeResponse {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: Date | null;
}

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<Result<GetMeResponse>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return Result.fail('User not found');
    }

    return Result.ok({
      id: user.id,
      email: user.email,
      name: user.name ?? null,
      role: user.role,
      createdAt: user.createdAt ?? null,
    });
  }
}
