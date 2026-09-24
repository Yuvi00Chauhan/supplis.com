import {inject} from '@loopback/core';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {
  AuthenticationBindings,
  AuthenticateFn,
  IAuthUser,
} from 'loopback4-authentication';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) protected send: Send,
    @inject(SequenceActions.REJECT) protected reject: Reject,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<IAuthUser>,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;
      const origin = request.headers.origin;
      if (origin === 'http://localhost:5173') {
        response.setHeader('Access-Control-Allow-Origin', origin);
        response.setHeader('Access-Control-Allow-Credentials', 'true');
        response.setHeader(
          'Access-Control-Allow-Methods',
          'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        );
        response.setHeader(
          'Access-Control-Allow-Headers',
          'Authorization,Content-Type',
        );
        response.setHeader('Vary', 'Origin');
      }

      if (request.method === 'OPTIONS') {
        response.statusCode = 204;
        response.end();
        return;
      }

      const route = this.findRoute(request);

      // 1. Authenticate request using loopback4-authentication
      const user = await this.authenticateRequest(request);

      if (user) {
        const tenantId =
          (user as any).tenantId ||
          (user as any).tenant_id ||
          (user as any).defaultTenantId ||
          '4750fdd9-12a8-47a6-a508-5dd2d95da9cc';

        (user as any).tenantId = tenantId;
        (user as any).tenant_id = tenantId;

        // 2. Bind user dynamically so repository getters resolve it correctly
        context
          .bind(AuthenticationBindings.CURRENT_USER)
          .toDynamicValue(async () => user);

        // 3. Inject tenant-id header for Sourceloop multi-tenant repository hooks
        request.headers['tenant-id'] = tenantId;
      }

      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
