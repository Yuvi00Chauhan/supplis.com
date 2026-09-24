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
  AuthenticateFn,
  AuthenticationBindings,
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
    // 1. Fixed key: USER_AUTH_ACTION
    // 2. Fixed type: AuthenticateFn<IAuthUser> (or AuthenticateFn<any>)
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<IAuthUser>,
  ) {}

  async handle(context: RequestContext) {
    const {request, response} = context;
    // Always set CORS headers early so even auth failures include them
    try {
      response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
      response.setHeader('Access-Control-Allow-Credentials', 'true');
      response.setHeader('Access-Control-Allow-Headers', 'authorization,content-type');
      response.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    } catch (e) {
      // ignore
    }

    try {
      const route = this.findRoute(request);

      const user = await this.authenticateRequest(request);
      if (user) {
        const authenticatedUser = user as IAuthUser & {
          userId?: string;
          sub?: string;
        };
        const userId =
          authenticatedUser.id ??
          authenticatedUser.userId ??
          authenticatedUser.sub;
        if (userId) {
          authenticatedUser.id = userId;
        }
        context
          .bind(AuthenticationBindings.CURRENT_USER)
          .toDynamicValue(async () => authenticatedUser);
      }

      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
