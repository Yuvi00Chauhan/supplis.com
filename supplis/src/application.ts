import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {
  AuthenticationServiceComponent,
  AuthServiceBindings,
} from '@sourceloop/authentication-service';
import {AuthorizationComponent, AuthorizationBindings} from 'loopback4-authorization';
import {AuthSeedObserver} from './observers/auth-seed.observer';
import {Strategies} from 'loopback4-authentication';
import {LocalPasswordStrategyFactoryProvider} from './providers/local-password-strategy-factory.provider';

export {ApplicationConfig};

export class SuplisBackendApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // 1. Configure Authentication Service before mounting components
    this.bind(AuthServiceBindings.Config).to({
      useCustomSequence: false,
      useSequelize: false,
      useSymmetricEncryption: true,
    });
    // Register local-password strategy factory so loopback4-authentication can create the passport-local strategy
    this.bind(Strategies.Passport.LOCAL_STRATEGY_FACTORY).toProvider(
      LocalPasswordStrategyFactoryProvider,
    );

    // 2. Mount Sourceloop Authentication & Authorization components
    this.component(AuthenticationServiceComponent);
    this.component(AuthorizationComponent);

    // Allow authentication endpoints, explorer, and public catalog endpoints without authorization checks
    this.bind(AuthorizationBindings.PATHS_TO_ALLOW_ALWAYS).to([
      '/auth',
      '/explorer',
      '/openapi.json',
      '/ping',
      '/categories',
      '/protein-products',
      '/creatine-products',
      '/pre-workout-products',
      '/amino-products',
      '/salt-products',
      '/multivitamin-products',
      '/omega-products',
      '/single-vitamin-products',
      '/weight-management-products',
    ]);


    // 3. Register Auth Seed Observer
    this.lifeCycleObserver(AuthSeedObserver);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
