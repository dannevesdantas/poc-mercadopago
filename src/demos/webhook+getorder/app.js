import { MercadoPagoConfig, MerchantOrder } from 'mercadopago';
import express from 'express';

// Exemplo de Webhook do Mercado Pago
// Necessário criar uma conta paga no https://webhook.site/ para poder encaminhar as request para a máquina local. Custo: $6 por mês.
// Use o comando abaixo no terminal para fazer forward das request para http://localhost:3000 no seu computador:
// whcli forward --token=????????-????-????-????-???????????? --api-key=????????-????-????-????-???????????? --target=http://localhost:3000/webhook

// Primeira Parte: Aguarda por uma requisição do Mercado Pago no Webhook

var app = express();
app.use(express.json());

app.post('/webhook', function (req, res) {
    const dateNow = new Date();
    console.log(`O Webhook recebeu uma requisição em ${dateNow}`);
    if (req.query.id && req.query.topic) {
        if (req.query.topic === "merchant_order") {
            const merchantOrderId = req.query.id;
            const merchantOrderTopic = req.query.topic;
            console.log("Um pedido da sua loja foi atualizado!");
            console.log(`O merchantOrderId do pedido no Mercado Pago é: ${merchantOrderId}`);
            console.log("Obtendo detalhes do Pedido...");
            getMerchantOrder(merchantOrderId);
        }
        if (req.query.topic === "payment") {
        }
    }
    res.sendStatus(200);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000');
});

// Segunda Parte: Obtem os detalhes do Pedido

function getMerchantOrder(merchantOrderId) {
    // Access Token obtido na página "Credenciais de teste" no painel do Mercado Pago Developers
    const accessToken = 'TEST-844********54504-01********443991c5********a5b5e4db********5758942';
    const idempotencyKey = 'a005986e-f97c-4274-91cf-b72d2672824f';
    const client = new MercadoPagoConfig({ accessToken: accessToken, options: { timeout: 5000, idempotencyKey: idempotencyKey } });

    const customerClient = new MerchantOrder(client);

    customerClient.get({ merchantOrderId: merchantOrderId })
        .then(function (merchantOrder) {
            console.log(merchantOrder.order_status);
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
}
