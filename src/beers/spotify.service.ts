import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BeersService } from './beers.service';
import { IPostAuthResponseData } from './interfaces/spotifyAPI.interface';

@Injectable()
export class SpotifyService {
  private readonly logger = new Logger(SpotifyService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly beersService: BeersService,
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
        this.beersService.spotifyAuthToken = `${data.token_type} ${data.access_token}`;
      });
  }
}
