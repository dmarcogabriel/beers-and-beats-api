import { ApiProperty } from '@nestjs/swagger';
import {
  IFindByTemperatureResponse,
  IPlaylistResponse,
  ITrackResponse,
} from '../interfaces/beersService.interface';

class Track implements ITrackResponse {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly artist: string;

  @ApiProperty()
  readonly link: string;
}

class Playlist implements IPlaylistResponse {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: () => [Track] })
  tracks: Track[];
}

export class IdealBeerDto implements IFindByTemperatureResponse {
  @ApiProperty()
  readonly beerStyle: string;

  @ApiProperty({ type: () => Playlist })
  readonly playlist?: Playlist;
}

export class IdealBeerWithoutPlaylistDto implements IFindByTemperatureResponse {
  @ApiProperty()
  readonly beerStyle: string;
}
