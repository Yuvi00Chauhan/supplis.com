import {Provider} from '@loopback/core';

export const StripeBindings = {
  Config: 'stripe.config',
  StripeHelper: 'stripe.helper',
};

export class StripeProvider implements Provider<any> {
  constructor() {}

  async value() {
    // Minimal stubbed helper — replace with real Stripe integration as needed
    return {
      charge: async (amount: number, token: string) => {
        return {id: 'stub_charge', amount};
      },
    };
  }
}
