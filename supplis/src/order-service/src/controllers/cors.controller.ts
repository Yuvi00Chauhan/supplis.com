import {inject} from '@loopback/core';
import {operation, RestBindings} from '@loopback/rest';
import {Response} from 'express';

export class CorsController {
  @operation('options', '/orders')
  optionsOrders(
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'authorization,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(204).end();
    return res;
  }

  @operation('options', '/orders/{id}')
  optionsOrdersById(
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'authorization,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(204).end();
    return res;
  }

  @operation('options', '/coupons')
  optionsCoupons(
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'authorization,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(204).end();
    return res;
  }

  @operation('options', '/coupons/validate')
  optionsCouponValidation(
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'authorization,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(204).end();
    return res;
  }
}
