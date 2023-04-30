import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Model } from 'mongoose';

export type BeerDocument = HydratedDocument<Beer>;

@Schema({ _id: false })
class IdealTemperature extends Document {
  @Prop({ required: true, type: Number })
  min: number;

  @Prop({ required: true, type: Number })
  max: number;
}

@Schema()
export class Beer {
  @Prop({ required: true, type: String })
  style: string;

  @Prop({ required: true, type: IdealTemperature })
  idealTemperature: IdealTemperature;
}

export interface BeerModel extends Model<Beer> {
  findByTemperature: (temperature: number) => Promise<Beer[]>;
}

const BeerSchema = SchemaFactory.createForClass<Beer, BeerModel>(Beer);

BeerSchema.statics.findByTemperature = async function (
  this: BeerModel,
  temperature: number,
): Promise<Beer[]> {
  const beers = await this.find().exec();

  let smallestDifference = Infinity;
  let closestBeers: Beer[] = [];

  beers.forEach((beer) => {
    const { min, max } = beer.idealTemperature;
    const averageTemperature = (min + max) / 2;

    const difference = Math.abs(temperature - averageTemperature);

    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestBeers = [beer];
    } else if (difference === smallestDifference) {
      closestBeers = [...closestBeers, beer];
    }
  });

  return closestBeers;
};

export default BeerSchema;
