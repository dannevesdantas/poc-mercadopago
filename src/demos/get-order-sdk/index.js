// Step 1: Import the parts of the module you want to use
import { MercadoPagoConfig, MerchantOrder } from 'mercadopago';

console.log(crypto.randomUUID());

// Ver documentação do módulo "mercadopago" em https://www.npmjs.com/package/mercadopago
// Baseado no exemplo disponível em https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/merchantOrder/get.ts

// Access Token obtido na página "Credenciais de teste" no painel do Mercado Pago Developers
const accessToken = 'TEST-844********54504-01********443991c5********a5b5e4db********5758942';
const idempotencyKey = 'a005986e-f97c-4274-91cf-b72d2672824f';

// Step 2: Initialize the client object
const client = new MercadoPagoConfig({ accessToken: accessToken, options: { timeout: 5000, idempotencyKey: idempotencyKey } });

const customerClient = new MerchantOrder(client);

// ID do pedido no Mercado Pago
const merchantOrderId = 14815073119;

customerClient.get({ merchantOrderId: merchantOrderId })
    .then(function (merchantOrder) {
        //console.log(merchantOrder);
        if (
            merchantOrder.status === 'closed' && // closed: Order with payments covering total amount.
            merchantOrder.order_status === 'paid' && // paid: Order with the sum of all payments "approved", "chargeback" or "in_mediation", covers the order total amount.
            merchantOrder.payments.every((payment) => {
                return payment.status === 'approved'; // approved: The payment has been approved and accredited.
            })
        ) {
            console.log(`O Pedido ${merchantOrderId} foi pago ✅`);
        }
    })
    .catch(console.log);
