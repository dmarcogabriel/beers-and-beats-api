import { Injectable } from '@nestjs/common';
import { Beer } from '../beers/schemas/beer.schema';

@Injectable()
export class BeersUtils {
  getAlphaFirstBeer(beerList: Beer[]): Beer {
    const [firstBeer] = beerList.sort((beerA, beerB) => {
      if (beerA.style.toLowerCase() < beerB.style.toLowerCase()) {
        return -1;
      }
      if (beerA.style.toLowerCase() > beerB.style.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    return firstBeer;
  }
}
