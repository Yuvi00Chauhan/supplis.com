import {inject} from '@loopback/core';
import {post, requestBody, response, HttpErrors} from '@loopback/rest';
import {repository} from '@loopback/repository';
import {
  authenticate,
  AuthenticationBindings,
  IAuthUser,
  STRATEGY,
} from 'loopback4-authentication';
import {v4 as uuidv4} from 'uuid';
import {createHmac, timingSafeEqual} from 'crypto';
import {OrdersRepository, PaymentGatewaysRepository, TransactionsRepository} from '@sourceloop/payment-service';

const Razorpay = require('razorpay');

interface PaymentSessionRequest {
  orderId: string;
  amount: number;
  currency?: string;
  checkoutDetails?: Record<string, unknown>;
}

interface PaymentConfirmationRequest {
  paymentOrderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export class PaymentSessionController {
  constructor(
    @repository(OrdersRepository)
    private readonly ordersRepository: OrdersRepository,
    @repository(TransactionsRepository)
    private readonly transactionsRepository: TransactionsRepository,
    @repository(PaymentGatewaysRepository)
    private readonly paymentGatewaysRepository: PaymentGatewaysRepository,
  ) {}

  private readonly razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  @authenticate(STRATEGY.BEARER)
  @post('/payments/create-session')
  @response(200, {
    description: 'Razorpay payment session',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async createSession(
    @requestBody() request: PaymentSessionRequest,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: IAuthUser,
  ): Promise<object> {
    if (!request.orderId || !Number.isFinite(request.amount) || request.amount <= 0) {
      throw new HttpErrors.UnprocessableEntity(
        'orderId and a positive amount are required.',
      );
    }
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new HttpErrors.InternalServerError(
        'Razorpay credentials are not configured on the payment service.',
      );
    }

    const amount = Math.round(request.amount * 100) / 100;
    const amountInPaise = Math.round(amount * 100);
    let paymentOrder;
    try {
      paymentOrder = await this.razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: request.currency ?? 'INR',
        receipt: request.orderId,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Razorpay rejected the payment order.';
      throw new HttpErrors.BadGateway(`Unable to create Razorpay order: ${message}`);
    }
    const tenantId =
      (currentUser as IAuthUser & {tenantId?: string}).tenantId ??
      '4750fdd9-12a8-47a6-a508-5dd2d95da9cc';

    let paymentGateway = await this.paymentGatewaysRepository.findOne({
      where: {gatewayType: 'razorpay'},
    });
    if (!paymentGateway) {
      paymentGateway = await this.paymentGatewaysRepository.create({
        id: uuidv4(),
        name: 'Razorpay',
        gatewayType: 'razorpay',
        enabled: true,
        tenantId,
      });
    }

    const storedOrder = await this.ordersRepository.create({
      id: uuidv4(),
      // The payment-service schema stores monetary amounts in the smallest
      // currency unit, while the checkout request is expressed in rupees.
      totalAmount: amountInPaise,
      currency: request.currency ?? 'INR',
      status: 'created',
      paymentGatewayId: paymentGateway.id,
      paymentmethod: 'razorpay',
      metaData: {
        applicationOrderId: request.orderId,
        razorpayOrderId: paymentOrder.id,
        amountInRupees: amount,
        checkoutDetails: request.checkoutDetails ?? {},
      },
      tenantId,
    });

    return {
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      razorpayOrderId: paymentOrder.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentOrderId: storedOrder.id,
    };
  }

  @authenticate(STRATEGY.BEARER)
  @post('/payments/confirm')
  @response(200, {
    description: 'Confirmed payment and transaction',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async confirmPayment(
    @requestBody() request: PaymentConfirmationRequest,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: IAuthUser,
  ): Promise<object> {
    if (
      !request.paymentOrderId ||
      !request.razorpayOrderId ||
      !request.razorpayPaymentId ||
      !request.razorpaySignature
    ) {
      throw new HttpErrors.UnprocessableEntity(
        'Payment confirmation details are required.',
      );
    }

    const expectedSignature = createHmac(
      'sha256',
      process.env.RAZORPAY_KEY_SECRET ?? '',
    )
      .update(`${request.razorpayOrderId}|${request.razorpayPaymentId}`)
      .digest('hex');
    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(request.razorpaySignature);
    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      throw new HttpErrors.BadRequest('Invalid payment signature.');
    }

    const order = await this.ordersRepository.findById(request.paymentOrderId);
    const metadata = order.metaData ?? {};
    if (metadata.razorpayOrderId !== request.razorpayOrderId) {
      throw new HttpErrors.BadRequest('Payment order does not match.');
    }
    const tenantId =
      (currentUser as IAuthUser & {tenantId?: string}).tenantId ??
      '4750fdd9-12a8-47a6-a508-5dd2d95da9cc';

    const transaction = await this.transactionsRepository.create({
      id: uuidv4(),
      amountPaid: order.totalAmount,
      currency: order.currency,
      status: 'paid',
      paidDate: new Date(),
      paymentGatewayId: order.paymentGatewayId,
      orderId: order.id,
      res: {
        razorpayOrderId: request.razorpayOrderId,
        razorpayPaymentId: request.razorpayPaymentId,
        razorpaySignature: request.razorpaySignature,
        checkoutDetails: metadata.checkoutDetails ?? {},
      },
      tenantId,
    });

    await this.ordersRepository.updateById(order.id as string, {
      status: 'paid',
      metaData: {
        ...metadata,
        razorpayPaymentId: request.razorpayPaymentId,
        razorpaySignature: request.razorpaySignature,
      },
    });

    return {order, transaction};
  }
}
