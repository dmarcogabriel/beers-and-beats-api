export interface IPostAuthResponseData {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface IPlaylist {
  collaborative: boolean;
  description: string;
  href: string;
  id: string;
  images: [
    {
      height: number;
      url: string;
      width: number;
    },
  ];
  name: string;
  owner: {
    display_name: string;
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
}

export interface IGetPlaylistResponseData {
  playlists: {
    items: IPlaylist[];
  };
}

interface IArtist {
  name: string;
}

interface ITrack {
  href: string;
  name: string;
  artists: IArtist[];
}

export interface IGetPlaylistTracksResponseData {
  items: { track: ITrack }[];
}
