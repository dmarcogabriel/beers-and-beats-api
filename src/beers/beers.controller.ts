import * as Nest from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { BeersService } from './beers.service';
import { BeerDto } from './dto/beer.dto';
import { CreateBeerDto } from './dto/create-beer.dto';
import { UpdateBeerDto } from './dto/update-beer.dto';
import { FindBeerByTemperature } from './dto/find-beer-by-temperature.dto';
import {
  IdealBeerDto,
  IdealBeerWithoutPlaylistDto,
} from './dto/ideal-beer.dto';

@Nest.Controller('beers')
export class BeersController {
  constructor(private readonly beersService: BeersService) {}

  @Nest.Post()
  @ApiCreatedResponse({
    type: BeerDto,
  })
  create(@Nest.Body() createBeerDto: CreateBeerDto) {
    if (
      !createBeerDto ||
      !createBeerDto.style ||
      !createBeerDto.idealTemperature
    )
      throw new Nest.HttpException(
        'request body is missing "beer" object or it\'s invalid',
        Nest.HttpStatus.BAD_REQUEST,
      );
    return this.beersService.create(createBeerDto);
  }

  @Nest.Get()
  @ApiOkResponse({
    type: [BeerDto],
    isArray: true,
  })
  findAll() {
    return this.beersService.findAll();
  }

  @Nest.Put(':id')
  @ApiOkResponse({
    type: BeerDto,
  })
  update(
    @Nest.Param('id') id: string,
    @Nest.Body() updateBeerDto: UpdateBeerDto,
  ) {
    if (!id)
      throw new Nest.HttpException(
        'request params is missing "id"',
        Nest.HttpStatus.BAD_REQUEST,
      );
    if (!updateBeerDto) {
      throw new Nest.HttpException(
        'request body is missing "beer" object or it\'s invalid',
        Nest.HttpStatus.BAD_REQUEST,
      );
    }
    return this.beersService.update(id, updateBeerDto);
  }

  @Nest.Delete(':id')
  @ApiNoContentResponse()
  remove(@Nest.Param('id') id: string) {
    if (!id)
      throw new Nest.HttpException(
        'request params is missing "id"',
        Nest.HttpStatus.BAD_REQUEST,
      );

    this.beersService.remove(id);
  }

  @Nest.Post('find-by-temperature')
  @ApiOkResponse({
    type: IdealBeerDto,
  })
  @ApiResponse({
    status: Nest.HttpStatus.PARTIAL_CONTENT,
    type: IdealBeerWithoutPlaylistDto,
  })
  async findByTemperature(
    @Nest.Res() response: Response,
    @Nest.Body() { temperature }: FindBeerByTemperature,
  ) {
    if (!temperature)
      throw new Nest.HttpException(
        'request body is missing "temperature"',
        Nest.HttpStatus.BAD_REQUEST,
      );
    const beerByTemperature = await this.beersService.findByTemperature(
      temperature,
    );
    const status = beerByTemperature.playlist
      ? Nest.HttpStatus.OK
      : Nest.HttpStatus.PARTIAL_CONTENT;
    response.status(status).send(beerByTemperature);
  }
}
