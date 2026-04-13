# SDD (Software Design Document) - API de Gestão de Pedidos
**Como e Com quê.**

Este documento descreve a implementação técnica da API de Gestão de Pedidos, baseada nos requisitos do PRD e no fluxo definido no SSD.

---

## 1. Arquitetura: Microserviços
O **Orders-Service** será um microserviço independente, seguindo os princípios de Single Responsibility.
- **Linguagem:** Node.js (TypeScript)
- **Framework:** Express.js
- **Comunicação:** REST (HTTP/JSON)
- **Database:** MongoDB (Escolhido pela flexibilidade do schema de itens de pedido).

---

## 2. Modelagem de Dados (Schemas)

### Coleção: `orders`
```json
{
  "_id": "ObjectId",
  "customerId": "String",
  "status": "String (PENDENTE | PAGO | ENVIADO | CANCELADO)",
  "items": [
    {
      "productId": "String",
      "quantity": "Number",
      "unitPrice": "Number"
    }
  ],
  "freight": "Number",
  "total": "Number",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

---

## 3. Definição de API

### POST `/orders`
- **Descrição:** Cria um novo pedido (RF01, RF02).
- **Request Body:**
  ```json
  {
    "customerId": "123",
    "items": [{ "productId": "p1", "quantity": 2 }],
    "freight": 15.0
  }
  ```
- **Fluxo:** Valida estoque -> Reserva itens -> Calcula total -> Salva como `PENDENTE`.
- **Response:** `201 Created` com o objeto do pedido.

### GET `/orders`
- **Descrição:** Lista pedidos com filtros (RF03).
- **Query Params:** `status`, `customerId`.
- **Response:** `200 OK` com array de pedidos.

### PATCH `/orders/:id/status`
- **Descrição:** Atualiza o status do pedido (RF03).
- **Request Body:** `{ "status": "ENVIADO" }`
- **Regras:** Validar transição permitida (ex: PENDENTE -> PAGO).
- **Response:** `200 OK`.

### DELETE `/orders/:id`
- **Descrição:** Cancela um pedido (RF02).
- **Regras:** Apenas se status for `PENDENTE`. Devolve itens ao estoque.
- **Response:** `204 No Content`.

---

## 4. Decisões Técnicas
- **Validação de Estoque:** Será feita via chamada síncrona ao `Inventory-Service` (ou mockado inicialmente).
- **Cálculo de Total:** Centralizado no Model/Service da aplicação para garantir precisão.
- **Segurança:** Middleware JWT para validar `customerId` e permissões de `Admin` para o Gestor de Operações.
- **Performance:** Indexação no MongoDB pelos campos `customerId` e `status` para busca rápida (< 300ms).

---

## 5. Diagramas de Sequência
O fluxo detalhado de interações entre Cliente, Gestor e Sistema está documentado no arquivo `ssd.mmd`.

### Resumo do Fluxo Principal:
1. **Criação:** O sistema intercepta o `POST /orders`, valida disponibilidade e confirma a reserva.
2. **Cancelamento:** Se o status for elegível, o sistema libera a reserva de estoque e marca como `CANCELADO`.
3. **Despacho:** O Gestor altera para `ENVIADO`, bloqueando futuras alterações.
