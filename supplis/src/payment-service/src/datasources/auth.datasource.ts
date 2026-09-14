import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import dotenv from 'dotenv';
dotenv.config();
const config = {
  name: 'AuthDB',
  connector: 'postgresql',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER ?? undefined,
  password: typeof process.env.DB_PASSWORD === 'undefined' ? undefined : String(process.env.DB_PASSWORD),
  database: process.env.DB_DATABASE ?? undefined,
  schema: process.env.DB_SCHEMA ?? undefined,
};

@lifeCycleObserver('datasource')
export class AuthDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'AuthDB';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.AuthDB', {optional: true}) dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
