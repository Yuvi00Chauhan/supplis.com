import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, get, requestBody, response, param, del, HttpErrors} from '@loopback/rest';
import {Address} from '../models';
import {AddressRepository} from '../repositories';
import {authenticate, AuthenticationBindings, IAuthUser, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';

export class AddressController {
  constructor(
    @repository(AddressRepository)
    public addressRepository: AddressRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post('/user-addresses')
  @response(200, {
    description: 'Address model instance',
    content: {'application/json': {schema: {'x-ts-type': Address}}},
  })
  async create(
    @requestBody() address: Omit<Address, 'id' | 'userId'> & {
      addressLine1?: string;
    },
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: IAuthUser,
  ): Promise<Address> {
    const {addressLine1, ...addressFields} = address;
    const street = addressFields.street ?? addressLine1;

    if (!addressFields.name || !addressFields.zipCode || !street) {
      throw new HttpErrors.UnprocessableEntity(
        'name, addressLine1 (or street), and zipCode are required.',
      );
    }

    const addressData = {
      ...addressFields,
      street,
      userId: currentUser.id as string,
    };

    return this.addressRepository.create(addressData);
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
  ): Promise<Address[]> {
    return this.addressRepository.find({
      where: {userId: currentUser.id as string},
    });
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
