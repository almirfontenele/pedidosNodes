# Orders-Service API

Microserviço centralizado para orquestração e gestão de pedidos, desenvolvido com foco em integridade de dados e escalabilidade.

## 🏗️ Arquitetura: Hexagonal (Ports & Adapters)

O projeto segue os princípios da **Arquitetura Hexagonal** para garantir que o núcleo da aplicação (regras de negócio) seja independente de tecnologias externas como bancos de dados, frameworks web ou serviços de terceiros.

- **Core (Domain & Application):** Contém as entidades de domínio, regras de negócio puras e a implementação dos casos de uso (Inbound Ports).
- **Adapters:** Implementações técnicas para comunicação externa.
  - **Inbound (Driving):** REST API com Express.js.
  - **Outbound (Driven):** Persistência com MongoDB/Mongoose e integração com serviço de inventário.

## 🚀 Tecnologias Utilizadas

- **Node.js** & **TypeScript**
- **Express.js** (Framework Web)
- **MongoDB** & **Mongoose** (Banco de Dados e ORM)
- **Jest** & **Supertest** (Testes Unitários e E2E)
- **Docker** (Containerização)
- **Dotenv** (Gestão de variáveis de ambiente)

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- Docker e Docker Compose (opcional, para rodar o banco de dados)

## 🛠️ Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd pedidosNodes
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto seguindo o exemplo:
   ```env
   MONGO_URI=mongodb://localhost:27017/orders
   PORT=3000
   ```

4. **Inicie o banco de dados (via Docker):**
   Se não tiver um MongoDB local, use o docker-compose:
   ```bash
   docker-compose up -d mongodb
   ```

5. **Execute a aplicação em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 🧪 Testes

O projeto possui uma suíte de testes abrangente cobrindo lógica de domínio e fluxos de API.

- **Rodar todos os testes:**
  ```bash
  npm test
  ```
- **Rodar apenas testes unitários:**
  ```bash
  npm test src/core
  ```
- **Rodar testes de integração (E2E):**
  ```bash
  npm test src/tests
  ```

## 🛣️ Endpoints da API

A documentação interativa da API (Swagger) está disponível em:
`http://localhost:3000/docs`

### Pedidos

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/orders` | Cria um novo pedido (Valida estoque e calcula total) |
| `GET` | `/orders` | Lista pedidos (Filtros: `customerId`, `status`) |
| `PATCH` | `/orders/:id/status` | Atualiza o status do pedido (PENDENTE -> PAGO -> ENVIADO) |
| `DELETE` | `/orders/:id` | Cancela um pedido (Apenas status PENDENTE) |

#### Exemplo de Payload para Criação (`POST /orders`):
```json
{
  "customerId": "user_123",
  "items": [
    { "productId": "prod_abc", "quantity": 2, "unitPrice": 50.0 },
    { "productId": "prod_xyz", "quantity": 1, "unitPrice": 100.0 }
  ],
  "freight": 15.0
}
```

## 📂 Estrutura de Pastas

```text
src/
├── core/                   # Núcleo da aplicação (Independente de frameworks)
│   ├── domain/             # Entidades e Regras de Negócio Puras
│   └── application/        # Casos de Uso (Orquestração)
│   └── ports/              # Interfaces (Contratos de Entrada e Saída)
├── adapters/               # Implementações técnicas
│   ├── inbound/            # Adaptadores de entrada (HTTP/Express)
│   └── outbound/           # Adaptadores de saída (Database/External Services)
├── config/                 # Configurações de infraestrutura
├── app.ts                  # Composição da aplicação (Dependency Injection)
└── index.ts                # Ponto de entrada do servidor
```

## 📜 Princípios Aplicados

- **Clean Code:** Nomes significativos, funções pequenas e responsabilidade única.
- **SOLID:** Princípios de design para código manutenível e extensível.
- **TDD (Test Driven Development):** Desenvolvimento guiado por testes para garantir robustez.
