import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyService } from '../spotify.service';

describe('SpotifyAuthService', () => {
  let service: SpotifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyService],
    }).compile();

    service = module.get<SpotifyService>(SpotifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
