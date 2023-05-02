import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SpotifyService } from './common/spotify/spotify.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly spotifyService: SpotifyService) {}

  async onApplicationBootstrap() {
    await this.spotifyService.logInSpotify();
    this.logger.log('Spotify token created!');
  }

  @Cron('* 55 * * * *')
  async handleSpotifyToken() {
    await this.spotifyService.logInSpotify();
    this.logger.log('Spotify token updated!');
  }
}
