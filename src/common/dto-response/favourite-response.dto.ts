import { ApiProperty } from '@nestjs/swagger';

export class FavouriteResponseDto {
  @ApiProperty({ example: 'cm9x1a2b3' })
  id: string;

  @ApiProperty({ example: 'Bratislava' })
  name: string;

  @ApiProperty({ example: 'SK' })
  country: string;

  @ApiProperty({ example: 48.1486 })
  lat: number;

  @ApiProperty({ example: 17.1077 })
  lon: number;

  @ApiProperty({ example: 'cm9x1a2b3' })
  userId: string;
}
