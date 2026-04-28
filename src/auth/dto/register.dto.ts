import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(128)
  @Matches(/[A-Z]/, { message: 'Password must contain uppercase letter' })
  @Matches(/[0-9]/, { message: 'Password must contain a number' })
  password: string;
}