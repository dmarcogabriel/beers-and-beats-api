interface ITrack {
  name: string;
  artist: string;
  link: string;
}

export interface IFindByTemperatureResponse {
  beerStyle: string;
  playlist: {
    name: string;
    tracks: ITrack[];
  };
}
