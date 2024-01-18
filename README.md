# poc-mercadopago

## Introdução a API do Mercado Pago

No Mercado Pago existem diferentes tipos de QR Code:
* QR Code para pagamento via PIX: É gerado um QR Code no formato "BR Code" do Banco Central do Brasil.
* QR Code Modelo Dinâmico: É gerado um QR Code de uso único por transação, por pedido, com o valor já incluído. O código QR dinâmico não pode ser reutilizado após o pagamento. **É este que vamos gerar.** ✅
* QR Code Modelo Atendido: Um QR Code a ser impresso e exposto em um pequeno pôster nos Caixas em lojas físicas. O cliente escaneia o QR code exposto no Caixa da loja e informa o valor dentro da App do Mercado Pago na hora de fazer o pagamento.

## Pré-requisitos

Segue abaixo um passo a passo detalhado para começar a usar a API do Mercado Pago.
> Para mais detalhes, confira a página https://www.mercadopago.com.br/developers/pt/docs/qr-code/pre-requisites

### Criar a Aplicação principal

1. Fazer login no Painel de Desenvolvedor do Mercado Pago Developers em https://www.mercadopago.com.br/developers usando a sua conta pessoal do Mercado Livre ou Mercado Pago;
2. No Painel de Desenvolvedor do Mercado Pago, clique em "Suas integrações" na parte de cima da tela;
3. Clique no botão azul "Criar aplicação". Dê um nome para a aplicação e marque as opções "Pagos presencial" e "CódigoQR". Em "Modelo de integração" selecione a opção "Dinâmico";
4. Por fim, marque a caixa de seleção "Eu autorizo" e clique em "Criar aplicação".

![image](https://github.com/dannevesdantas/poc-mercadopago/assets/5115895/c9b45877-dd95-4626-ba80-36f3a245d050)

### Criar os Usuários de Teste👥

1. Dentro do Painel de Desenvolvedor do Mercado Pago, clique em "Contas de teste" no menu, do lado esquerdo da tela;
2. Crie dois usuários de testes: Um com nome de `Vendedor` e outro com nome de `Comprador`

<img width="775" alt="image" src="https://github.com/dannevesdantas/poc-mercadopago/assets/5115895/dc26ec02-fa69-44ee-8f10-f547cafa1717">

### Criar a Aplicação de Testes🧪

Você vai precisar criar mais uma aplicação, dentro da conta de teste do **Vendedor**. Faça o seguinte:

1. Abra uma janela anônima no navegador e faça login no Painel de Desenvolvedor do Mercado Pago em https://www.mercadopago.com.br/developers usando o usuário e senha de teste da conta de **Vendedor** que você acabou de criar.
2. Na aba anônima, no Painel de Desenvolvedor do Mercado Pago, clique em "Suas integrações";
3. Novamente, clique no botão azul "Criar aplicação". Dê um nome para a aplicação de testes e marque as opções "Pagos presencial" e "CódigoQR". Em "Modelo de integração" selecione a opção "Dinâmico", da mesma forma que você fez no passo anterior;
4. Por fim, marque a caixa de seleção "Eu autorizo" e clique em "Criar aplicação" para criar a aplicação de testes dentro da conta de teste do **Vendedor**.

> A Aplicação de teste na conta do usuário de teste do Vendedor que você está criando agora não poderá ter exatamente o mesmo nome da aplicação que você criou anteriormente usando a sua conta pessoal do Mercado Pago.

> Repare que agora você terá duas aplicações registradas no Mercado Pago: Uma principal, criada dentro da sua conta pessoal e uma outra aplicação de teste, criada dentro da conta de teste do Vendedor.

Daqui em diante vamos usar somente a nova aplicação de teste que você acabou de criar dentro da conta de teste do Vendedor.

### Obter o Access Token e User ID da Aplicação de Teste🔐

1. Abra uma janela anônima no navegador e faça login no Painel de Desenvolvedor do Mercado Pago em https://www.mercadopago.com.br/developers usando o usuário e senha de teste da conta de **Vendedor** que você criou anteriormente;
2. Na página inicial da aplicação de testes do Vendedor serão exibidas algumas informações gerais sobre a aplicação de testes. Anote o `User ID` que aparece em baixo de "Detalhes da aplicação", pois vamos precisar dele nos próximos passos;
3. Clique em "Credenciais de teste" no menu do lado esquerdo da tela e anote o `Access Token` da aplicação de testes do Vendedor. Vamos precisar dele nos próximos passos.

![image](https://github.com/dannevesdantas/poc-mercadopago/assets/5115895/2ed8386d-c60b-4566-9226-a23c7ae99d43)
<img width="770" alt="image" src="https://github.com/dannevesdantas/poc-mercadopago/assets/5115895/5bde1813-9080-44ad-bd85-7a8e22903c84">

Pronto! Agora você já pode começar a usar a API do Mercado Pago!🥳

## Cadastrar Loja e Caixa

Antes de começar a gerar QR Codes do Mercado Pago, você irá precisar cadastrar ao menos uma Loja e um Caixa (ou seja, um POS - Point of sale).

> Só para lembrar: Ao importar as requests de exemplo disponíveis abaixo no Postman, lembre-se de informar o `Access Token` da aplicação de teste que você anotou anteriormente, na guia Authorization.\
> <img width="704" alt="image" src="https://github.com/dannevesdantas/poc-mercadopago/assets/5115895/71271e2d-e13e-46af-9337-7fb67ce3da91">

### Crie uma Loja via API🏪

Siga as instruções da documentação "Criar loja" na página https://www.mercadopago.com.br/developers/pt/reference/stores/_users_user_id_stores/post para criar uma loja usando a API do Mercado Pago, ou utilize a request de exemplo abaixo.

> Ao criar uma Loja, informe o `user_id` da aplicação de testes do Vendedor que você anotou anteriormente, na URL.

<details>
<summary>Request de exemplo📝</summary>
  
```bash
curl --location 'https://api.mercadopago.com/users/{user_id}/stores' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer TEST-844********54504-01********443991c5********a5b5e4db********5758942' \
--data '{
    "name": "Minha Lojinha de Teste",
    //"external_id": "SUC001", // Campo opcional // Identificação da Loja dentro da sua organização
    "location": {
        "street_number": "1264",
        "street_name": "Av. Lins de Vasconcelos",
        "city_name": "São Paulo",
        "state_name": "São Paulo",
        "latitude": -23.5740998,
        "longitude": -46.6258023,
        "reference": null // Ponto de referência
        // Dica: Você pode descobrir a latitude e longitude de um endereço no Google Maps
    }
}'
```
  
</details>

✏️Anote o `id` da Loja criada que será retornado na response pela API do Mercado Pago. Você vai precisar dele no próximo passo.

### Cadastre um Caixa na Loja🧺

Siga as instruções da documentação "Criar caixa" na página https://www.mercadopago.com.br/developers/pt/reference/pos/_pos/post para criar um Caixa ou seja, um POS - Point of Sale na sua loja, ou utilize a request de exemplo abaixo.

<details>
<summary>Request de exemplo📝</summary>
  
```bash
curl --location 'https://api.mercadopago.com/pos' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer TEST-844********54504-01********443991c5********a5b5e4db********5758942' \
--data '{
    "name": "Caixa 01",
    "store_id": ????????, // Informe aqui o id da loja que você criou anteriormente
    "external_id": "CAIXA01" // Identificação interna do Caixa dentro da sua Loja
    //"category": 5611203, // Campo opcional // Código MCC // CNAE: 5611-2/03 Lanchonetes, casas de chá, de sucos e similares.
    //"fixed_amount": false // Campo opcional // Determine se o cliente pode informar o valor a ser pago
}'
```
  
</details>

✏️Anote o `external_id` do Caixa que você informou no body da request ao criar o Caixa na API do Mercado Pago. Você vai precisar dele no próximo passo.

Com a Loja e Caixa cadastrados, confira abaixo o passo a passo para gerar um QR Code.

## Gerar QR Code Modelo Dinâmico

> Só para lembrar: O Postman pode gerar o código da request HTTP em diversas linguagens de programação clicando no botão `</>` do lado direito superior da tela.💡

Siga as instruções da documentação "Criar um quadro QR" na página https://www.mercadopago.com.br/developers/pt/reference/qr-dynamic/_instore_orders_qr_seller_collectors_user_id_pos_external_pos_id_qrs/post para criar um Pedido (merchant order) com QR Code no Mercado Pago, ou utilize a request de exemplo abaixo.

<details>
<summary>Request de exemplo📝</summary>
  
```bash
curl --location 'https://api.mercadopago.com/instore/orders/qr/seller/collectors/{user_id}/pos/{external_pos_id}/qrs' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer TEST-844********54504-01********443991c5********a5b5e4db********5758942' \
--data '{
    "title": "Product order",
    "description": "Purchase description.",
    "expiration_date": "2025-01-01T00:00:00.000-04:00", // Campo opcional
    "external_reference": "reference_12345", // Número interno do Pedido dentro da sua loja
    "items": [
        {
            //"sku_number": "A123K9191938", // Campo opcional
            //"category": "marketplace", // Campo opcional
            "title": "Point Mini",
            //"description": "This is the Point Mini", // Campo opcional
            "unit_price": 0.01,
            "quantity": 1,
            "unit_measure": "unit",
            "total_amount": 0.01
        }
    ],
    "notification_url": "https://webhook.site/???", // Dica: Você pode testar webhooks usando o https://webhook.site/
    "total_amount": 0.01
}'
```
  
</details>

Você receberá como response da API do Mercado Pago um QR Code para pagamento, em formato string no campo `qr_data`.

> Você pode copiar e colar a string em `qr_data` na response do Mercado Pago em https://www.qr-code-generator.com/solutions/text-qr-code/ ou usar uma biblioteca de geração de QR Codes para transformar a string no campo `qr_data` em uma imagem .jpg, .png ou .svg

### Pagar o pedido com QR Code

Baixe a app do Mercado Pago no seu celular e faça login usando o usuário e senha da conta de teste do **Comprador** que você criou anteriormente. Ao pagar um QR Code, os créditos sairão da conta de testes do Comprador e cairão na conta de testes do Vendedor que você criou anteriormente.

![tempFileForShare_20240112-111308](https://github.com/dannevesdantas/poc-mercadopago/assets/5115895/740c784a-574f-4323-91b5-b386e4681e51)

> ⚠️Você não irá conseguir pagar QR Codes modelo dinâmico do Mercado Pago (este que estamos gerando) usando apps de outros bancos digitais. O QR Code modelo dinâmico do Mercado Pago possui um formato específico (formato EMVCo) e não será reconhecido por outros bancos.

## Webhook

Ao criar um QR Code, você informou no body da request no campo `notification_url` a URL do seu webhook. O Mercado Pago fará um POST para a URL que você informou no campo `notification_url` avisando sempre que houver alguma atualização no pedido do lado do Mercado Pago.

> DICA: Conforme recomendado pela equipe do Mercado Pago, você pode usar o https://webhook.site/ para obter uma URL temporária na internet para testar seus webhooks (print abaixo).
> <img width="1018" alt="image" src="https://github.com/dannevesdantas/poc-mercadopago/assets/5115895/da0c6c21-3046-4329-9a31-9e95fd9885b4">

Assim que o pedido for pago através da app do Mercado Pago, você receberá uma notificação do Mercado Pago via webhook. Este será o body da request que será enviada para o seu webhook via POST pelo Mercado Pago:

```bash
curl --location 'https://{seu_webhook}?id=15140831325&topic=merchant_order' \
--data '{
    "resource": "https://api.mercadolibre.com/merchant_orders/15140831325", // URL onde você poderá consultar o status do pedido
    "topic": "merchant_order"
}'
```

Após receber uma notificação do Mercado Pago, via webhook, você deverá consultar o pedido na API do Mercado Pago para obter o status mais recente do pedido para checar se o pedido já foi pago ou não.

### Consultando o status do pagamento no Mercado Pago

Faça um GET na URL informada no campo `resource` no JSON que você recebeu do Mercado Pago via webhook para obter todos os detalhes do pedido, incluindo o status mais recente, conforme instruções na página [Obter Pedido](https://www.mercadopago.com.br/developers/pt/reference/merchant_orders/_merchant_orders_id/get) no portal do Mercado Pago Developers, ou utilize a request de exemplo abaixo.

<details>
<summary>Request de exemplo📝</summary>
  
```bash
curl --location 'https://api.mercadopago.com/merchant_orders/{id}' \
--header 'Authorization: Bearer TEST-844********54504-01********443991c5********a5b5e4db********5758942'
```
  
</details>

> Se preferir, você também pode consultar o pedido no Mercado Pago usando a [SDK](https://www.mercadopago.com.br/developers/pt/docs/sdks-library/server-side).

Você pode verificar o status do pagamento do pedido no campo `order_status` para checar se o pedido já foi pago ou não (print abaixo).

<img width="365" alt="image" src="https://github.com/dannevesdantas/poc-mercadopago/assets/5115895/739e51dc-4330-4e14-8e9c-d1559566fbd2">

#### Como eu sei qual pedido do Mercado Pago se refere a qual pedido em minha loja?🤔

Anteriormente, ao criar o pedido com QR Code no Mercado Pago você informou no body da request o campo `external_reference` contendo o número do pedido dentro da sua loja, na sua plataforma, no seu banco de dados.\
Ao consultar um pedido no Mercado Pago você receberá na response todos os dados do pedido, incluindo o campo `order_status` com o status do pagamento e o `external_reference` que contém o número do pedido na sua loja. Dessa forma você poderá relacionar o pedido do lado do Mercado Pago com o número do pedido na sua loja e marcar o pedido como "pago" dentro da sua plataforma quando `order_status` for igual a "paid".
