import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {PaymentDatasourceName} from '@sourceloop/payment-service';
import dotenv from 'dotenv';
dotenv.config();
const config = {
  name: PaymentDatasourceName,
  connector: 'postgresql',
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT ?? 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA ?? 'public',
};

@lifeCycleObserver('datasource')
export class PaymentDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = PaymentDatasourceName;
  static readonly defaultConfig = config;
  constructor(
    @inject(`datasources.config.${PaymentDatasourceName}`, {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
