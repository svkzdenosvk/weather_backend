import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../../common/dto-response/user-response.dto';

export class MeResponseDto {
  @ApiProperty({ example: true })
  isLoggedIn: boolean;

  @ApiProperty({ type: UserResponseDto, required: false })
  user?: UserResponseDto;
}
