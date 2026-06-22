import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../../common/dto-response/user-response.dto';

export class LoginResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
