import {Entity, model, property} from '@loopback/repository';

@model()
export class Address extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuidv4',
  })
  id?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  street?: string;

  @property({
    type: 'string',
  })
  addressLine2?: string;

  @property({
    type: 'string',
  })
  city?: string;

  @property({
    type: 'string',
  })
  state?: string;

  @property({
    type: 'string',
  })
  zipCode?: string;

  @property({
    type: 'boolean',
  })
  isDefault?: boolean;

  @property({
    type: 'string',
  })
  phone?: string;

  @property({
    type: 'string',
  })
  userId?: string;

  constructor(data?: Partial<Address>) {
    super(data);
  }
}

export interface AddressRelations {
}

export type AddressWithRelations = Address & AddressRelations;
