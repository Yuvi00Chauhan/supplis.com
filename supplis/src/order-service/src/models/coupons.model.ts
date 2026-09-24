import {Entity, model, property} from '@loopback/repository';

@model()
export class Coupons extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuidv4',
  })
  id?: string;

  @property({
    type: 'string',
  })
  code?: string;

  @property({
    type: 'string',
    default: 'flat',
  })
  type?: string;

  @property({
    type: 'number',
  })
  value?: number;

  @property({
    type: 'date',
  })
  expiryDate?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  isActive?: boolean;

  @property({
    type: 'number',
  })
  minCartValue?: number;


  constructor(data?: Partial<Coupons>) {
    super(data);
  }
}

export interface CouponsRelations {
  // describe navigational properties here
}

export type CouponsWithRelations = Coupons & CouponsRelations;
