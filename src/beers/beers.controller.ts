import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { BeersService } from './beers.service';
import { BeerDto } from './dto/beer.dto';
import { CreateBeerDto } from './dto/create-beer.dto';
import { UpdateBeerDto } from './dto/update-beer.dto';
import { FindBeerByTemperature } from './dto/find-beer-by-temperature.dto';
import {
  IdealBeerDto,
  IdealBeerWithoutPlaylistDto,
} from './dto/ideal-beer.dto';
import { IFindByTemperatureResponse } from './interfaces/beersService.interface';

@Controller('beers')
export class BeersController {
  constructor(private readonly beersService: BeersService) {}

  @Post()
  @ApiCreatedResponse({
    type: BeerDto,
  })
  create(@Body() createBeerDto: CreateBeerDto) {
    if (
      !createBeerDto ||
      !createBeerDto.style ||
      !createBeerDto.idealTemperature
    )
      throw new HttpException(
        'request body is missing "beer" object or it\'s invalid',
        HttpStatus.BAD_REQUEST,
      );
    return this.beersService.create(createBeerDto);
  }

  @Get()
  @ApiOkResponse({
    type: [BeerDto],
    isArray: true,
  })
  findAll() {
    return this.beersService.findAll();
  }

  @Put(':id')
  @ApiOkResponse({
    type: BeerDto,
  })
  update(@Param('id') id: string, @Body() updateBeerDto: UpdateBeerDto) {
    if (!id)
      throw new HttpException(
        'request params is missing "id"',
        HttpStatus.BAD_REQUEST,
      );
    if (!updateBeerDto) {
      throw new HttpException(
        'request body is missing "beer" object or it\'s invalid',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.beersService.update(id, updateBeerDto);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    if (!id)
      throw new HttpException(
        'request params is missing "id"',
        HttpStatus.BAD_REQUEST,
      );

    this.beersService.remove(id);
  }

  @Post('find-by-temperature')
  @ApiOkResponse({
    type: IdealBeerDto,
  })
  @ApiResponse({
    status: HttpStatus.PARTIAL_CONTENT,
    type: IdealBeerWithoutPlaylistDto,
  })
  async findByTemperature(
    @Body() { temperature }: FindBeerByTemperature,
    @Res() response: Response,
  ): Promise<IFindByTemperatureResponse> {
    if (!temperature)
      throw new HttpException(
        'request body is missing "temperature"',
        HttpStatus.BAD_REQUEST,
      );
    const beerByTemperature = await this.beersService.findByTemperature(
      temperature,
    );
    if (!beerByTemperature.playlist) {
      response.status(HttpStatus.PARTIAL_CONTENT).send(beerByTemperature);
    }
    return beerByTemperature;
  }
}
