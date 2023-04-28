import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type BeerDocument = HydratedDocument<Beer>;

@Schema()
class IdealTemperature extends Document {
  @Prop({ required: true, type: Number })
  min: number;

  @Prop({ required: true, type: Number })
  max: number;
}

@Schema()
export class Beer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: IdealTemperature })
  idealTemperature: IdealTemperature;
}

export const BeerSchema = SchemaFactory.createForClass(Beer);
