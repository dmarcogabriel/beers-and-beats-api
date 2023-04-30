export interface ITrackResponse {
  name: string;
  artist: string;
  link: string;
}

export interface IPlaylistResponse {
  name: string;
  tracks: ITrackResponse[];
}

export interface IFindByTemperatureResponse {
  beerStyle: string;
  playlist?: IPlaylistResponse;
}
