import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty({ required: false })
  message?: string;

  @ApiProperty({ required: false })
  error?: any;

  constructor(success: boolean, data?: T, message?: string, error?: any) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.error = error;
  }

  static success<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse(true, data, message);
  }

  static error<T>(message: string, error?: any): ApiResponse<T> {
    return new ApiResponse<T>(false, undefined, message, error);
  }
}
