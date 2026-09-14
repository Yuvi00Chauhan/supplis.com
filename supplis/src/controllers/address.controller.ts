import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, get, requestBody, response, param, del, HttpErrors} from '@loopback/rest';
import {Address} from '../models';
import {AddressRepository} from '../repositories';
import {authenticate, AuthenticationBindings, IAuthUser, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';

type AddressInput = Omit<Address, 'id'> & {zipCode?: string};

export class AddressController {
  constructor(
    @repository(AddressRepository)
    public addressRepository: AddressRepository,
  ) {}

  private normalizeAddressInput(address: Partial<AddressInput>): Partial<AddressInput> {
    const normalized: Partial<AddressInput> = {...address};
    const postalCode = normalized.zipCode ?? normalized.pinCode;

    if (postalCode) {
      normalized.pinCode = postalCode;
    }

    delete normalized.zipCode;
    return normalized;
  }

  private serializeAddress(address: Address): any {
    return {
      ...address,
      zipCode: address.pinCode,
      pinCode: undefined,
    };
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post('/user-addresses')
  @response(200, {
    description: 'Address model instance',
    content: {'application/json': {schema: {'x-ts-type': Address}}},
  })
  async create(
    @requestBody() address: AddressInput,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: IAuthUser,
  ): Promise<any> {
    const normalizedAddress = this.normalizeAddressInput(address) as AddressInput;

    if (!normalizedAddress.pinCode) {
      throw new HttpErrors.UnprocessableEntity('zipCode is required.');
    }

    normalizedAddress.userId = currentUser.id as string;
    const createdAddress = await this.addressRepository.create(normalizedAddress as Omit<Address, 'id'>);
    return this.serializeAddress(createdAddress);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get('/user-addresses')
  @response(200, {
    description: 'Array of Address model instances for current user',
    content: {
      'application/json': {
        schema: {type: 'array', items: {'x-ts-type': Address}},
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: IAuthUser,
  ): Promise<any[]> {
    const addresses = await this.addressRepository.find({
      where: {userId: currentUser.id as string},
    });

    return addresses.map(address => this.serializeAddress(address));
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @del('/user-addresses/{id}')
  @response(204, {
    description: 'Address DELETE success',
  })
  async deleteById(
    @param.path.string('id') id: string,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: IAuthUser,
  ): Promise<void> {
    await this.addressRepository.deleteAll({
      id: id,
      userId: currentUser.id as string,
    });
  }
}
