import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BeerModel } from '../beers/schemas/beer.schema';
import { CreateBeerDto } from './dto/create-beer.dto';
import { UpdateBeerDto } from './dto/update-beer.dto';
import {
  IGetPlaylistResponseData,
  IGetPlaylistTracksResponseData,
} from './interfaces/spotifyAPI.interface';
import { IFindByTemperatureResponse } from './interfaces/beersService.interface';

@Injectable()
export class BeersService {
  private _spotifyAuthToken: string;

  constructor(
    @InjectModel('Beer') private readonly beerModel: BeerModel,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  set spotifyAuthToken(data: string) {
    this._spotifyAuthToken = data;
  }

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

  private async getPlaylistTracks(tracksUrl: string) {
    const { data } =
      await this.httpService.axiosRef.get<IGetPlaylistTracksResponseData>(
        tracksUrl,
        {
          headers: { Authorization: this._spotifyAuthToken },
        },
      );

    return data.items.map(({ track }) => ({
      name: track.name,
      link: track.href,
      artist: track.artists[0].name,
    }));
  }

  private async getPlaylist(beerStyle: string) {
    const url = this.configService.get<string>('SPOTIFY_BASE_URL');

    const { data } =
      await this.httpService.axiosRef.get<IGetPlaylistResponseData>(
        `${url}/search`,
        {
          params: {
            q: beerStyle,
            type: 'playlist',
            limit: 1,
          },
          headers: { Authorization: this._spotifyAuthToken },
        },
      );
    const [firstPlaylist] = data.playlists.items;
    return firstPlaylist;
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

    const playlist = await this.getPlaylist(firstBeer.style);
    const tracks = await this.getPlaylistTracks(playlist.tracks.href);
    return {
      beerStyle: firstBeer.style,
      playlist: {
        name: playlist.name,
        tracks: tracks,
      },
    };
  }
}
