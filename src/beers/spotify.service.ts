import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {
  IPlaylist,
  IPostAuthResponseData,
  IGetPlaylistResponseData,
  IGetPlaylistTracksResponseData,
} from './interfaces/spotifyAPI.interface';

@Injectable()
export class SpotifyService {
  private spotifyAuthToken: string;
  private readonly logger = new Logger(SpotifyService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('*/50 * * * *')
  async handleAuthOnSpotify() {
    const url = this.configService.get<string>('SPOTIFY_AUTH_URL');
    this.httpService
      .post<IPostAuthResponseData>(
        `${url}/api/token`,
        {
          grant_type: 'client_credentials',
          client_id: this.configService.get<string>('SPOTIFY_CLIENT_ID'),
          client_secret: this.configService.get<string>(
            'SPOTIFY_CLIENT_SECRET',
          ),
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .subscribe(({ data }) => {
        this.logger.log('Spotify token updated!');
        this.spotifyAuthToken = `${data.token_type} ${data.access_token}`;
      });
  }

  async getPlaylistTracks(tracksUrl: string) {
    const { data } =
      await this.httpService.axiosRef.get<IGetPlaylistTracksResponseData>(
        tracksUrl,
        {
          headers: { Authorization: this.spotifyAuthToken },
        },
      );

    return data.items.map(({ track }) => ({
      name: track.name,
      link: track.href,
      artist: track.artists[0].name,
    }));
  }

  async getPlaylist(beerStyle: string): Promise<IPlaylist> {
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
          headers: { Authorization: this.spotifyAuthToken },
        },
      );
    const [firstPlaylist] = data.playlists.items;
    return firstPlaylist;
  }
}
