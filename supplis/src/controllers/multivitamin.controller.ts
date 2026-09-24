import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {MultivitaminProduct} from '../models';
import {MultivitaminProductRepository} from '../repositories';
import { authenticate, STRATEGY } from "loopback4-authentication";
import { authorize } from "loopback4-authorization";

export class MultivitaminController {
  constructor(
    @repository(MultivitaminProductRepository)
    public multivitaminProductRepository : MultivitaminProductRepository,
  ) {}
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @post('/multivitamin-products')
  @response(200, {
    description: 'MultivitaminProduct model instance',
    content: {'application/json': {schema: getModelSchemaRef(MultivitaminProduct)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MultivitaminProduct, {
            title: 'NewMultivitaminProduct',
          }),
        },
      },
    })
    multivitaminProduct: Omit<MultivitaminProduct, 'id'>,
  ): Promise<MultivitaminProduct> {
    return this.multivitaminProductRepository.create(multivitaminProduct);
  }

  @authorize({permissions: ['*']})
  @get('/multivitamin-products/count')
  @response(200, {
    description: 'MultivitaminProduct model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MultivitaminProduct) where?: Where<MultivitaminProduct>,
  ): Promise<Count> {
    return this.multivitaminProductRepository.count(where);
  }

  @authorize({permissions: ['*']})
  @get('/multivitamin-products')
  @response(200, {
    description: 'Array of MultivitaminProduct model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MultivitaminProduct, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MultivitaminProduct) filter?: Filter<MultivitaminProduct>,
  ): Promise<MultivitaminProduct[]> {
    return this.multivitaminProductRepository.find(filter);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @patch('/multivitamin-products')
  @response(200, {
    description: 'MultivitaminProduct PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MultivitaminProduct, {partial: true}),
        },
      },
    })
    multivitaminProduct: MultivitaminProduct,
    @param.where(MultivitaminProduct) where?: Where<MultivitaminProduct>,
  ): Promise<Count> {
    return this.multivitaminProductRepository.updateAll(multivitaminProduct, where);
  }
  @authorize({permissions: ['*']})
  @get('/multivitamin-products/{id}')
  @response(200, {
    description: 'MultivitaminProduct model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MultivitaminProduct, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(MultivitaminProduct, {exclude: 'where'}) filter?: FilterExcludingWhere<MultivitaminProduct>
  ): Promise<MultivitaminProduct> {
    return this.multivitaminProductRepository.findById(id, filter);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @patch('/multivitamin-products/{id}')
  @response(204, {
    description: 'MultivitaminProduct PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MultivitaminProduct, {partial: true}),
        },
      },
    })
    multivitaminProduct: MultivitaminProduct,
  ): Promise<void> {
    await this.multivitaminProductRepository.updateById(id, multivitaminProduct);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @put('/multivitamin-products/{id}')
  @response(204, {
    description: 'MultivitaminProduct PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() multivitaminProduct: MultivitaminProduct,
  ): Promise<void> {
    await this.multivitaminProductRepository.replaceById(id, multivitaminProduct);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @del('/multivitamin-products/{id}')
  @response(204, {
    description: 'MultivitaminProduct DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.multivitaminProductRepository.deleteById(id);
  }
}
