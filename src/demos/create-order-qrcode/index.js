const axios = require('axios');
const BigNumber = require('bignumber.js');
const { DateTime } = require("luxon");

// About bignumber.js
// https://www.npmjs.com/package/bignumber.js
// "[...] bignumber.js is perhaps more suitable for financial applications because the user doesn't need to worry about losing precision unless an operation involving division is used." — https://github.com/MikeMcl/big.js/wiki

// Parâmetros do Mercado Pago
const accessToken = 'TEST-844********54504-01********443991c5********a5b5e4db********5758942';
const user_id = "??????????";
const external_pos_id = "???";

// Dados do pedido
const numInternoPedido = "reference_12345"; // Número interno do Pedido dentro da sua loja
const itensPedidoSuaLoja = [
    {
        nome: "Point Mini",
        sku: "A123K9191938",
        categoria: "marketplace",
        descricao: "This is the Point Mini",
        valorUnitario: 0.01,
        quantidade: 1,
        unidadeDeMedida: "unit",
        valorTotal: 0.01
    }
];
const itensPedidoMercadoPago = itensPedidoSuaLoja.map(itemPedidoSuaLoja => (
    {
        "sku_number": itemPedidoSuaLoja.sku ?? null, // Campo opcional
        "category": itemPedidoSuaLoja.categoria ?? null, // Campo opcional
        "title": itemPedidoSuaLoja.nome,
        "description": itemPedidoSuaLoja.descricao ?? null, // Campo opcional
        "unit_price": itemPedidoSuaLoja.valorUnitario,
        "quantity": itemPedidoSuaLoja.quantidade,
        "unit_measure": itemPedidoSuaLoja.unidadeDeMedida,
        "total_amount": itemPedidoSuaLoja.valorTotal
    }
));
const valorTotalPedido = itensPedidoMercadoPago.reduce((valorTotalPedido, itemPedido) => { return BigNumber.sum(valorTotalPedido, itemPedido.total_amount).toNumber(); }, 0); // Deve ser a soma do total de todos os itens do pedido
const webhookURL = "https://webhook.site/???";

let data = JSON.stringify({
    "title": "Product order",
    "description": "Purchase description.",
    "expiration_date": DateTime.now().setZone('UTC').plus({ hours: 24 }).toISO(), // Campo opcional
    "external_reference": numInternoPedido.toString(), // Número interno do Pedido dentro da sua loja
    "items": itensPedidoMercadoPago,
    "notification_url": webhookURL,
    "total_amount": valorTotalPedido
});

let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://api.mercadopago.com/instore/orders/qr/seller/collectors/${user_id}/pos/${external_pos_id}/qrs`,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    },
    data: data
};

axios.request(config)
    .then((response) => {
        console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
        console.log(error);
    });
