import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export class AddFavouriteDto {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

@Controller('favourites')
@UseGuards(JwtAuthGuard)
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @Get()
  getAll(@Request() req: any) {
    return this.favouritesService.getAll(req.user.sub);
  }

  @Post()
  add(@Request() req: any, @Body() body: AddFavouriteDto) {
    return this.favouritesService.add(req.user.sub, body);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.favouritesService.remove(req.user.sub, id);
  }
}