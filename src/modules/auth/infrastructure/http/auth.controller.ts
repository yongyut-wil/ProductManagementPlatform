import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/register.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { LoginUserDto } from '../../application/dto/login-user.dto';
import { ApiResponse } from '../../../../shared/dto/response.dto';

import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUserUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @SwaggerApiResponse({ status: 201, description: 'User registered successfully' })
  @SwaggerApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() dto: RegisterUserDto) {
    const result = await this.registerUseCase.execute(dto);
    if (result.isFailure) {
      throw new BadRequestException(ApiResponse.error(result.error as string));
    }
    return ApiResponse.success(null, 'User registered successfully');
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @SwaggerApiResponse({ status: 201, description: 'Login successful' })
  @SwaggerApiResponse({ status: 400, description: 'Invalid credentials' })
  async login(@Body() dto: LoginUserDto) {
    const result = await this.loginUseCase.execute(dto);
    if (result.isFailure) {
      throw new BadRequestException(ApiResponse.error(result.error as string));
    }
    return ApiResponse.success(result.getValue(), 'Login successful');
  }
}
