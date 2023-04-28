import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Beer } from 'src/beers/schemas/beer.schema';
import { CreateBeerDto } from './dto/create-beer.dto';
import { UpdateBeerDto } from './dto/update-beer.dto';

@Injectable()
export class BeersService {
  constructor(@InjectModel(Beer.name) private beerModel: Model<Beer>) {}

  create(createBeerDto: CreateBeerDto) {
    const createdBeer = new this.beerModel(createBeerDto);
    return createdBeer.save();
  }

  findAll() {
    return this.beerModel.find().exec();
  }

  findOne(id: string) {
    return this.beerModel.findById(id).exec();
  }

  update(id: string, updateBeerDto: UpdateBeerDto) {
    return this.beerModel.updateOne({ id }, updateBeerDto).exec();
  }

  remove(id: string) {
    return this.beerModel.deleteOne({ id }).exec();
  }

  findByTemperature(temperature: number) {
    // todo: add logic here
    return `find by temperature ${temperature}`;
  }
}
