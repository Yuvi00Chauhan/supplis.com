import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, Provider} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {HttpErrors, RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {
  AuthenticationComponent,
  Strategies,
  VerifyFunction,
} from 'loopback4-authentication';
import {AuthorizationBindings} from 'loopback4-authorization';
import {verify} from 'jsonwebtoken';
import {MySequence} from './sequence';

export {ApplicationConfig};

// Inline Bearer verifier to decode tokens from Auth service
class BearerVerifierProvider implements Provider<VerifyFunction.BearerFn> {
  value(): VerifyFunction.BearerFn {
    return async (token: string) => {
      try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error('JWT secret is not defined');
        }
        return verify(token, secret) as any;
      } catch (err) {
        throw new HttpErrors.Unauthorized('Invalid or expired token');
      }
    };
  }
}

export class OrderServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Registers HTTP Bearer Scheme for Swagger UI ("Authorize" button)
    this.api({
      openapi: '3.0.0',
      info: {title: 'order-service', version: '0.0.1'},
      paths: {},
      components: {
        securitySchemes: {
          HTTPBearer: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{HTTPBearer: []}],
    });

    // Set up custom sequence
    this.sequence(MySequence);

    // Mount Sourceloop Auth Component
    this.component(AuthenticationComponent);

    // Bind Bearer verifier to Sourceloop's strategy key
    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
      BearerVerifierProvider,
    );

    // Bind JWT config
    this.bind('sf.user.config').to({
      jwtSecret: process.env.JWT_SECRET,
    });

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Allow unauthenticated access for explorer, openapi and public endpoints (CORS preflight + health)
    this.bind(AuthorizationBindings.PATHS_TO_ALLOW_ALWAYS).to([
      '/explorer',
      '/openapi.json',
      '/ping',
      '/orders',
      '/orders/{id}',
      '/coupons/validate',
    ]);

    // Customize @loopback/rest-explorer configuration
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Enable CORS middleware for all routes to allow frontend dev server
    const cors = require('cors');
    // Use expressMiddleware with middleware first and options object (no 'paths')
    this.expressMiddleware(
      cors({
        origin: 'http://localhost:5173',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        maxAge: 86400,
      }),
      {key: 'cors'},
    );

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
