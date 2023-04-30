import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { BeersService } from './beers.service';
import { CreateBeerDto } from './dto/create-beer.dto';
import { UpdateBeerDto } from './dto/update-beer.dto';
import { FindBeerByTemperature } from './dto/find-beer-by-temperature.dto';

@Controller('beers')
export class BeersController {
  constructor(private readonly beersService: BeersService) {}

  @Post()
  create(@Body() createBeerDto: CreateBeerDto) {
    return this.beersService.create(createBeerDto);
  }

  @Get()
  findAll() {
    return this.beersService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBeerDto: UpdateBeerDto) {
    return this.beersService.update(id, updateBeerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.beersService.remove(id);
  }

  @Post('find-by-temperature')
  findByTemperature(@Body() { temperature }: FindBeerByTemperature) {
    return this.beersService.findByTemperature(temperature);
  }
}
