import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BeerModel } from '../beers/schemas/beer.schema';
import { CreateBeerDto } from './dto/create-beer.dto';
import { UpdateBeerDto } from './dto/update-beer.dto';
import { IFindByTemperatureResponse } from './interfaces/beersService.interface';
import { SpotifyService } from './spotify.service';

@Injectable()
export class BeersService {
  constructor(
    @InjectModel('Beer') private readonly beerModel: BeerModel,
    private readonly spotifyService: SpotifyService,
  ) {}

  create(createBeerDto: CreateBeerDto) {
    const createdBeer = new this.beerModel(createBeerDto);
    return createdBeer.save();
  }

  findAll() {
    return this.beerModel.find().exec();
  }

  async update(id: string, updateBeerDto: UpdateBeerDto) {
    const foundedBeer = await this.beerModel.findOne({ _id: id });
    if (!foundedBeer) throw new Error();

    foundedBeer.style = updateBeerDto.style || foundedBeer.style;

    if (updateBeerDto.idealTemperature) {
      const { min, max } = updateBeerDto.idealTemperature;
      foundedBeer.idealTemperature.min = min;
      foundedBeer.idealTemperature.max = max;
    }

    return foundedBeer.save();
  }

  remove(id: string) {
    return this.beerModel.deleteOne({ _id: id }).exec();
  }

  async findByTemperature(
    temperature: number,
  ): Promise<IFindByTemperatureResponse> {
    const beerList = await this.beerModel.findByTemperature(temperature);

    const [firstBeer] = beerList.sort((beerA, beerB) => {
      if (beerA.style.toLowerCase() < beerB.style.toLowerCase()) {
        return -1;
      }
      if (beerA.style.toLowerCase() > beerB.style.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    try {
      const playlist = await this.spotifyService.getPlaylist(firstBeer.style);
      const tracks = await this.spotifyService.getPlaylistTracks(
        playlist.tracks.href,
      );
      return {
        beerStyle: firstBeer.style,
        playlist: {
          name: playlist.name,
          tracks: tracks,
        },
      };
    } catch (ex) {
      return {
        beerStyle: firstBeer.style,
      };
    }
  }
}
