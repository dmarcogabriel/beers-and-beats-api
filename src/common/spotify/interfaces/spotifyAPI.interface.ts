export interface IPostAuthResponseData {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface IPlaylist {
  id: string;
  name: string;
  tracks: {
    href: string;
  };
}

export interface IGetPlaylistResponseData {
  playlists: {
    items: IPlaylist[];
  };
}

interface IArtist {
  name: string;
}

export interface ITrack {
  href: string;
  name: string;
  artists: IArtist[];
}

export interface IGetPlaylistTracksResponseData {
  items: { track: ITrack }[];
}
