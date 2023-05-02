import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  IPlaylist,
  IPostAuthResponseData,
  IGetPlaylistResponseData,
  IGetPlaylistTracksResponseData,
} from './interfaces/spotifyAPI.interface';

@Injectable()
export class SpotifyService {
  private readonly SPOTIFY_TOKEN_KEY = '@spotify-token';

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async logInSpotify() {
    const url = this.configService.get<string>('SPOTIFY_AUTH_URL');
    const { data } =
      await this.httpService.axiosRef.post<IPostAuthResponseData>(
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
      );
    await this.cacheManager.set(
      this.SPOTIFY_TOKEN_KEY,
      `${data.token_type} ${data.access_token}`,
      0,
    );
  }

  async getPlaylistTracks(tracksUrl: string) {
    const spotifyAuthToken = await this.cacheManager.get<string>(
      this.SPOTIFY_TOKEN_KEY,
    );
    const { data } =
      await this.httpService.axiosRef.get<IGetPlaylistTracksResponseData>(
        tracksUrl,
        {
          headers: { Authorization: spotifyAuthToken },
        },
      );

    return data.items.map(({ track }) => ({
      name: track.name,
      link: track.href,
      artist: track.artists[0].name,
    }));
  }

  async getPlaylist(beerStyle: string): Promise<IPlaylist> {
    const spotifyAuthToken = await this.cacheManager.get<string>(
      this.SPOTIFY_TOKEN_KEY,
    );
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
          headers: { Authorization: spotifyAuthToken },
        },
      );
    const [firstPlaylist] = data.playlists.items;
    return firstPlaylist;
  }
}
