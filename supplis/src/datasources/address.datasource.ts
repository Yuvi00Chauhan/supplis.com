import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

const config = {
  name: 'address',
  connector: 'postgresql',
  url: '',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.ADDRESS_SCHEMA,
};

@lifeCycleObserver('datasource')
export class AddressDatasource extends juggler.DataSource

  implements LifeCycleObserver {
  static dataSourceName = 'address';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.address', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
