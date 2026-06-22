import { ApiProperty } from '@nestjs/swagger';

export class UsernameCheckResponseDto {
  @ApiProperty({ example: true })
  available: boolean;
}
