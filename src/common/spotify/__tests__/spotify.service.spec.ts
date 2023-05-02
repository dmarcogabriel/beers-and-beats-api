import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { SpotifyService } from '../spotify.service';
import { IPlaylist, ITrack } from '../interfaces/spotifyAPI.interface';
import axios from 'axios';

jest.mock('axios');

const mockPlaylists: IPlaylist[] = [
  {
    id: 'id1',
    name: 'playlist 1',
    tracks: {
      href: 'url-to-tracks',
    },
  },
  {
    id: 'id2',
    name: 'playlist 2',
    tracks: {
      href: 'url-to-tracks',
    },
  },
];

const mockTracks: { track: ITrack }[] = [
  {
    track: {
      name: 'track 1',
      href: 'track-link',
      artists: [
        {
          name: 'Artist 1',
        },
        {
          name: 'Artist 2',
        },
      ],
    },
  },
  {
    track: {
      name: 'track 2',
      href: 'track-link',
      artists: [
        {
          name: 'Artist 3',
        },
        {
          name: 'Artist 4',
        },
      ],
    },
  },
];

describe('SpotifyService', () => {
  let service: SpotifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), CacheModule.register(), HttpModule],
      providers: [SpotifyService],
    }).compile();

    service = module.get<SpotifyService>(SpotifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logInSpotify', () => {
    it('should log in spotify', async () => {
      (axios.post as jest.Mock).mockResolvedValue({
        data: {
          token_type: 'Test',
          access_token: 'token',
        },
      });

      await service.logInSpotify();
      expect(axios.post).toHaveBeenCalled();
    });
  });

  describe('getPlaylist', () => {
    it('should get playlist', async () => {
      (axios.get as jest.Mock).mockResolvedValue({
        data: {
          playlists: {
            items: mockPlaylists,
          },
        },
      });

      await service.getPlaylist('Pilsens');
      expect(axios.get).toHaveBeenCalled();
    });
  });

  describe('getPlaylistTracks', () => {
    it('should get playlist tracks', async () => {
      (axios.get as jest.Mock).mockResolvedValue({
        data: {
          items: mockTracks,
        },
      });

      await service.getPlaylistTracks('tracks-url');
      expect(axios.get).toHaveBeenCalled();
    });
  });
});
