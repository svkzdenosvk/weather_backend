import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username?: string;

  @IsOptional()
  @IsString()
  currentPassword?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  @Matches(/[A-Z]/, { message: 'Password must contain uppercase letter' })
  @Matches(/[0-9]/, { message: 'Password must contain a number' })
  newPassword?: string;
}
