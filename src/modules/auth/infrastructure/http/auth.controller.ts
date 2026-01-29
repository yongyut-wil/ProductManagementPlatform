import { Controller, Post, Body, Get, UseGuards, Request, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/register.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login.use-case';
import { GetMeUseCase } from '../../application/use-cases/get-me.use-case';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { LoginUserDto } from '../../application/dto/login-user.dto';
import { ApiResponse } from '../../../../shared/dto/response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUserUseCase,
    private readonly getMeUseCase: GetMeUseCase,
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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @SwaggerApiResponse({ status: 200, description: 'Returns current user' })
  @SwaggerApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Request() req: any) {
    const result = await this.getMeUseCase.execute(req.user.userId);
    if (result.isFailure) {
      throw new UnauthorizedException(ApiResponse.error(result.error as string));
    }
    return ApiResponse.success(result.getValue(), 'User profile retrieved');
  }
}

