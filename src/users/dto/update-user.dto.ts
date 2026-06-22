import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'john_doe', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username?: string;

  @ApiProperty({ example: 'OldPassword123*', required: false })
  @IsOptional()
  @IsString()
  currentPassword?: string;

  @ApiProperty({ example: 'NewPassword123*', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  @Matches(/[A-Z]/, { message: 'Password must contain uppercase letter' })
  @Matches(/[0-9]/, { message: 'Password must contain a number' })
  newPassword?: string;
}
