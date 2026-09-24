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
import {SingleVitaminProduct} from '../models';
import {SingleVitaminProductRepository} from '../repositories';
import { authenticate, STRATEGY } from "loopback4-authentication";
import { authorize } from "loopback4-authorization";

export class SingleVitaminController {
  constructor(
    @repository(SingleVitaminProductRepository)
    public singleVitaminProductRepository : SingleVitaminProductRepository,
  ) {}
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @post('/single-vitamin-products')
  @response(200, {
    description: 'SingleVitaminProduct model instance',
    content: {'application/json': {schema: getModelSchemaRef(SingleVitaminProduct)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SingleVitaminProduct, {
            title: 'NewSingleVitaminProduct',
          }),
        },
      },
    })
    singleVitaminProduct: Omit<SingleVitaminProduct, 'id'>,
  ): Promise<SingleVitaminProduct> {
    return this.singleVitaminProductRepository.create(singleVitaminProduct);
  }

  @authorize({permissions: ['*']})
  @get('/single-vitamin-products/count')
  @response(200, {
    description: 'SingleVitaminProduct model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SingleVitaminProduct) where?: Where<SingleVitaminProduct>,
  ): Promise<Count> {
    return this.singleVitaminProductRepository.count(where);
  }

  @authorize({permissions: ['*']})
  @get('/single-vitamin-products')
  @response(200, {
    description: 'Array of SingleVitaminProduct model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SingleVitaminProduct, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SingleVitaminProduct) filter?: Filter<SingleVitaminProduct>,
  ): Promise<SingleVitaminProduct[]> {
    return this.singleVitaminProductRepository.find(filter);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @patch('/single-vitamin-products')
  @response(200, {
    description: 'SingleVitaminProduct PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SingleVitaminProduct, {partial: true}),
        },
      },
    })
    singleVitaminProduct: SingleVitaminProduct,
    @param.where(SingleVitaminProduct) where?: Where<SingleVitaminProduct>,
  ): Promise<Count> {
    return this.singleVitaminProductRepository.updateAll(singleVitaminProduct, where);
  }

  @authorize({permissions: ['*']})
  @get('/single-vitamin-products/{id}')
  @response(200, {
    description: 'SingleVitaminProduct model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SingleVitaminProduct, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(SingleVitaminProduct, {exclude: 'where'}) filter?: FilterExcludingWhere<SingleVitaminProduct>
  ): Promise<SingleVitaminProduct> {
    return this.singleVitaminProductRepository.findById(id, filter);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @patch('/single-vitamin-products/{id}')
  @response(204, {
    description: 'SingleVitaminProduct PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SingleVitaminProduct, {partial: true}),
        },
      },
    })
    singleVitaminProduct: SingleVitaminProduct,
  ): Promise<void> {
    await this.singleVitaminProductRepository.updateById(id, singleVitaminProduct);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @put('/single-vitamin-products/{id}')
  @response(204, {
    description: 'SingleVitaminProduct PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() singleVitaminProduct: SingleVitaminProduct,
  ): Promise<void> {
    await this.singleVitaminProductRepository.replaceById(id, singleVitaminProduct);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @del('/single-vitamin-products/{id}')
  @response(204, {
    description: 'SingleVitaminProduct DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.singleVitaminProductRepository.deleteById(id);
  }
}
