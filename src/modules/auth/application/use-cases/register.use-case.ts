import { Injectable, Inject } from '@nestjs/common';
import { UseCase } from '../../../../shared/core/use-case.interface';
import { RegisterUserDto } from '../dto/register-user.dto';
import { IUserRepository } from '../../domain/user.repository.interface';
import { Result } from '../../../../shared/core/result';
import { User, UserRole } from '../../domain/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUserUseCase implements UseCase<RegisterUserDto, Promise<Result<void>>> {
  constructor(
    @Inject(IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(request: RegisterUserDto): Promise<Result<void>> {
    const emailExists = await this.userRepository.findByEmail(request.email);
    if (emailExists) {
      return Result.fail('User already exists');
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);

    const user = User.create({
      email: request.email,
      password: hashedPassword,
      name: request.name,
      role: UserRole.USER,
    });

    await this.userRepository.save(user);

    return Result.ok();
  }
}
