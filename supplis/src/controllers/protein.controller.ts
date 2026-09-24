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
import {ProteinProduct} from '../models';
import {ProteinProductRepository} from '../repositories';
import { authenticate, STRATEGY } from "loopback4-authentication";
import { authorize } from "loopback4-authorization";

export class ProteinController {
  constructor(
    @repository(ProteinProductRepository)
    public proteinProductRepository : ProteinProductRepository,
  ) {}
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @post('/protein-products')
  @response(200, {
    description: 'ProteinProduct model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProteinProduct)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProteinProduct, {
            title: 'NewProteinProduct',
          }),
        },
      },
    })
    proteinProduct: Omit<ProteinProduct, 'id'>,
  ): Promise<ProteinProduct> {
    return this.proteinProductRepository.create(proteinProduct);
  }

  @authorize({permissions: ['*']})
  @get('/protein-products/count')
  @response(200, {
    description: 'ProteinProduct model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProteinProduct) where?: Where<ProteinProduct>,
  ): Promise<Count> {
    return this.proteinProductRepository.count(where);
  }

  @authorize({permissions: ['*']})
  @get('/protein-products')
  @response(200, {
    description: 'Array of ProteinProduct model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProteinProduct, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProteinProduct) filter?: Filter<ProteinProduct>,
  ): Promise<ProteinProduct[]> {
    return this.proteinProductRepository.find(filter);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @patch('/protein-products')
  @response(200, {
    description: 'ProteinProduct PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProteinProduct, {partial: true}),
        },
      },
    })
    proteinProduct: ProteinProduct,
    @param.where(ProteinProduct) where?: Where<ProteinProduct>,
  ): Promise<Count> {
    return this.proteinProductRepository.updateAll(proteinProduct, where);
  }

  @authorize({permissions: ['*']})
  @get('/protein-products/{id}')
  @response(200, {
    description: 'ProteinProduct model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProteinProduct, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ProteinProduct, {exclude: 'where'}) filter?: FilterExcludingWhere<ProteinProduct>
  ): Promise<ProteinProduct> {
    return this.proteinProductRepository.findById(id, filter);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @patch('/protein-products/{id}')
  @response(204, {
    description: 'ProteinProduct PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProteinProduct, {partial: true}),
        },
      },
    })
    proteinProduct: ProteinProduct,
  ): Promise<void> {
    await this.proteinProductRepository.updateById(id, proteinProduct);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @put('/protein-products/{id}')
  @response(204, {
    description: 'ProteinProduct PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() proteinProduct: ProteinProduct,
  ): Promise<void> {
    await this.proteinProductRepository.replaceById(id, proteinProduct);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['Admin', 'Manager']})
  @del('/protein-products/{id}')
  @response(204, {
    description: 'ProteinProduct DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.proteinProductRepository.deleteById(id);
  }
}
