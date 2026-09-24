import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, Provider} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {HttpErrors, RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {AuthenticationComponent, Strategies, VerifyFunction} from 'loopback4-authentication';
import {
  PaymentServiceComponent,
  RazorpayBindings,
  RazorpayProvider,
} from '@sourceloop/payment-service';
import {CoreComponent} from '@sourceloop/core';
import {verify} from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import {MySequence} from './sequence';

dotenv.config({path: path.resolve(__dirname, '../.env')});

class BearerVerifierProvider implements Provider<VerifyFunction.BearerFn> {
  value(): VerifyFunction.BearerFn {
    return async (token: string) => {
      try {
        const secret = process.env.JWT_SECRET ?? 'your-shared-jwt-secret';
        const decoded = verify(token, secret) as any;

        const resolvedTenantId =
          decoded.tenantId ||
          decoded.tenant_id ||
          decoded.defaultTenantId ||
          '4750fdd9-12a8-47a6-a508-5dd2d95da9cc';

        const resolvedUserId = decoded.id || decoded.userId || decoded.sub || 'user-1';

        // Returns a fully normalized user context required by Sourceloop multi-tenant repositories
        return {
          ...decoded,
          id: resolvedUserId,
          userId: resolvedUserId,
          tenantId: resolvedTenantId,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          tenant_id: resolvedTenantId,
          userTenantId: decoded.userTenantId || decoded.user_tenant_id || resolvedTenantId,
        };
      } catch {
        throw new HttpErrors.Unauthorized('Invalid or expired token');
      }
    };
  }
}

export class PaymentServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.api({
      openapi: '3.0.0',
      info: {title: 'payment-service', version: '0.0.1'},
      paths: {},
      components: {
        securitySchemes: {
          HTTPBearer: {type: 'http', scheme: 'bearer', bearerFormat: 'JWT'},
        },
      },
      security: [{HTTPBearer: []}],
    });

    this.sequence(MySequence);
    this.component(AuthenticationComponent);
    this.component(PaymentServiceComponent);
    this.component(CoreComponent);
    // Bind local JWT verifier
    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(BearerVerifierProvider);

    // Bind Razorpay Credentials and Helper Provider
    this.bind(RazorpayBindings.RazorpayConfig).to({
      dataKey: process.env.RAZORPAY_KEY_ID ?? '',
      publishKey: process.env.RAZORPAY_KEY_SECRET ?? '',
    });
    this.bind(RazorpayBindings.RazorpayHelper).toProvider(RazorpayProvider);

    // Configure REST explorer
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Set project root and Boot options so BootMixin can resolve artifact paths
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
