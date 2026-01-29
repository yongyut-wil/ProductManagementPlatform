import { Injectable, Inject } from '@nestjs/common';
import { UseCase } from '../../../../shared/core/use-case.interface';
import { LoginUserDto } from '../dto/login-user.dto';
import { IUserRepository } from '../../domain/user.repository.interface';
import { Result } from '../../../../shared/core/result';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUserUseCase implements UseCase<LoginUserDto, Promise<Result<{ accessToken: string }>>> {
  constructor(
    @Inject(IUserRepository) private userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  async execute(request: LoginUserDto): Promise<Result<{ accessToken: string }>> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      return Result.fail('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(request.password, user.password!);
    if (!isMatch) {
      return Result.fail('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return Result.ok({ accessToken });
  }
}
