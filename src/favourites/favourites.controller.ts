import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiParam,
} from '@nestjs/swagger';

import { FavouritesService } from './favourites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FavouriteResponseDto } from 'src/common/dto-response/favourite-response.dto';
import { SuccessResponseDto } from 'src/common/dto-response/success-response.dto';

export class AddFavouriteDto {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

@ApiTags('favourites')
@ApiCookieAuth('shortTerm_token')
@UseGuards(JwtAuthGuard)
@Controller('favourites')
@UseGuards(JwtAuthGuard)
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all favourites for the authenticated user' })
  @ApiResponse({ status: 200, type: [FavouriteResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAll(@Request() req: any) {
    return this.favouritesService.getAll(req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new favourite location' })
  @ApiResponse({ status: 201, type: FavouriteResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  add(@Request() req: any, @Body() body: AddFavouriteDto) {
    return this.favouritesService.add(req.user.sub, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a favourite location by ID' })
  @ApiParam({ name: 'id', description: 'Favourite location ID' })
  @ApiResponse({ status: 200, type: SuccessResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Favourite not found' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.favouritesService.remove(req.user.sub, id);
  }
}
