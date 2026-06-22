import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNumber } from 'class-validator';

export class AddFavouriteDto {
  @ApiProperty({ example: 'Bratislava' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Slovakia' })
  @IsString()
  country: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;
}
