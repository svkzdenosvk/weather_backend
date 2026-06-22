import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNumber } from 'class-validator';

export class AddFavouriteDto {
  @IsString()
  name: string;

  @IsString()
  country: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;
}
