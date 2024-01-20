var express = require('express');

// Exemplo de Webhook do Mercado Pago
// Necessário criar uma conta paga no https://webhook.site/ para poder encaminhar as request para a máquina local. Custo: $6 por mês.
// Use o comando abaixo no terminal para fazer forward das request para http://localhost:3000 no seu computador:
// whcli forward --token=????????-????-????-????-???????????? --api-key=????????-????-????-????-???????????? --target=http://localhost:3000/webhook

var app = express();
app.use(express.json());

app.post('/webhook', function (req, res) {
    console.log("O Webhook recebeu uma requisição!");
    if (req.query.id && req.query.topic) {
        if (req.query.topic === "merchant_order") {
            const merchantOrderId = req.query.id;
            const merchantOrderTopic = req.query.topic;
            console.log("Um pedido da sua loja foi atualizado!");
            console.log(`O merchantOrderId do pedido no Mercado Pago é: ${merchantOrderId}`);
        }
        if (req.query.topic === "payment") {
        }
    }
    if (req.body) {
        console.log(req.body);
    }
    res.sendStatus(200);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000');
});
