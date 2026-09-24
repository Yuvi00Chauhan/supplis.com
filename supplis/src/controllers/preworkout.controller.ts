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
import {PreWorkoutProduct} from '../models';
import {PreWorkoutProductRepository} from '../repositories';
import { authenticate, STRATEGY } from "loopback4-authentication";
import { authorize } from "loopback4-authorization";

export class PreworkoutController {
  constructor(
    @repository(PreWorkoutProductRepository)
    public preWorkoutProductRepository : PreWorkoutProductRepository,
  ) {}
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @post('/pre-workout-products')
  @response(200, {
    description: 'PreWorkoutProduct model instance',
    content: {'application/json': {schema: getModelSchemaRef(PreWorkoutProduct)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PreWorkoutProduct, {
            title: 'NewPreWorkoutProduct',
          }),
        },
      },
    })
    preWorkoutProduct: Omit<PreWorkoutProduct, 'id'>,
  ): Promise<PreWorkoutProduct> {
    return this.preWorkoutProductRepository.create(preWorkoutProduct);
  }

  @authorize({permissions: ['*']})
  @get('/pre-workout-products/count')
  @response(200, {
    description: 'PreWorkoutProduct model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PreWorkoutProduct) where?: Where<PreWorkoutProduct>,
  ): Promise<Count> {
    return this.preWorkoutProductRepository.count(where);
  }

  @authorize({permissions: ['*']})
  @get('/pre-workout-products')
  @response(200, {
    description: 'Array of PreWorkoutProduct model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PreWorkoutProduct, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PreWorkoutProduct) filter?: Filter<PreWorkoutProduct>,
  ): Promise<PreWorkoutProduct[]> {
    return this.preWorkoutProductRepository.find(filter);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @patch('/pre-workout-products')
  @response(200, {
    description: 'PreWorkoutProduct PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PreWorkoutProduct, {partial: true}),
        },
      },
    })
    preWorkoutProduct: PreWorkoutProduct,
    @param.where(PreWorkoutProduct) where?: Where<PreWorkoutProduct>,
  ): Promise<Count> {
    return this.preWorkoutProductRepository.updateAll(preWorkoutProduct, where);
  }

  @authorize({permissions: ['*']})
  @get('/pre-workout-products/{id}')
  @response(200, {
    description: 'PreWorkoutProduct model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PreWorkoutProduct, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(PreWorkoutProduct, {exclude: 'where'}) filter?: FilterExcludingWhere<PreWorkoutProduct>
  ): Promise<PreWorkoutProduct> {
    return this.preWorkoutProductRepository.findById(id, filter);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @patch('/pre-workout-products/{id}')
  @response(204, {
    description: 'PreWorkoutProduct PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PreWorkoutProduct, {partial: true}),
        },
      },
    })
    preWorkoutProduct: PreWorkoutProduct,
  ): Promise<void> {
    await this.preWorkoutProductRepository.updateById(id, preWorkoutProduct);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @put('/pre-workout-products/{id}')
  @response(204, {
    description: 'PreWorkoutProduct PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() preWorkoutProduct: PreWorkoutProduct,
  ): Promise<void> {
    await this.preWorkoutProductRepository.replaceById(id, preWorkoutProduct);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @del('/pre-workout-products/{id}')
  @response(204, {
    description: 'PreWorkoutProduct DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.preWorkoutProductRepository.deleteById(id);
  }
}
