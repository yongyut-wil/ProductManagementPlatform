import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Latest Apple Smartphone', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 35000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;
}
