# ADR 001: Definição da API de Pedidos (Pedidos-API)

**Status:** Proposto  
**Data:** 13 de Abril de 2026  
**Autor:** Product Manager / Engenharia

## 1. Contexto e Problema
Precisamos de um serviço robusto e escalável para gerenciar o ciclo de vida de pedidos em nossa plataforma. O sistema deve processar desde a criação do pedido até a integração com serviços de pagamento e estoque, garantindo integridade de dados e alta disponibilidade.

## 2. Requisitos de Produto (Escopo)

### Requisitos Funcionais
- **Criação de Pedidos:** Receber itens, quantidades e informações do cliente.
- **Cálculo de Totais:** Somar preços, aplicar descontos e calcular frete.
- **Fluxo de Status:** Gerenciar a transição (Pendente -> Pago -> Enviado -> Entregue/Cancelado).
- **Listagem e Busca:** Filtros por status, data e cliente.
- **Cancelamento:** Regras de negócio para estorno e devolução de estoque.

### Requisitos Não-Funcionais (Padrões de Engenharia)
Para garantir a qualidade esperada (conforme diretrizes de senioridade):
- **Resiliência:** Implementação de try/catch global e tratamento de erros específicos (ex: estoque insuficiente).
- **Performance:** Uso estratégico de `Promise.all()` em chamadas paralelas (ex: validar usuário + validar estoque).
- **Consistência:** Uso de transações de banco de dados para garantir que um pedido não seja criado sem a reserva de estoque.
- **Segurança:** Validação rigorosa de inputs (Zod/Joi) e sanitização de dados.

## 3. Decisões de Arquitetura

### Stack Técnica
- **Runtime:** Node.js (LTS).
- **Framework:** Fastify (preferencial pela performance) ou Express.
- **Linguagem:** TypeScript (Interfaces bem definidas para contratos de pedidos).
- **Banco de Dados:** PostgreSQL (Relacional é mandatório para garantir integridade via transações ACID).

### Organização do Código
Adotaremos uma separação de responsabilidades clara:
- **Routes:** Definição dos endpoints.
- **Controllers:** Orquestração da requisição/resposta.
- **Services (Lógica de Negócio):** Onde reside a "inteligência" do pedido (ex: cálculo de impostos).
- **Repositories:** Abstração do acesso ao banco de dados.

## 4. Design da API (Contratos)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| POST | `/orders` | Cria um novo pedido. |
| GET | `/orders/:id` | Detalhes de um pedido específico. |
| PATCH | `/orders/:id/status` | Atualiza o estado do pedido (ex: marcar como pago). |
| DELETE | `/orders/:id` | Cancela o pedido (se as regras permitirem). |

## 5. Princípios de Implementação (Mindset Senior)
1.  **Explique o Raciocínio:** Ao codificar, documente ou comunique por que certas estruturas (como Maps ou Transações) foram escolhidas.
2.  **Testes:** Cobertura de testes unitários para o cálculo do valor total é obrigatória.
3.  **Logs:** Implementar log de mudanças de status para auditoria.
4.  **Configuração:** Hardcoding é proibido. Use variáveis de ambiente (`.env`).

---
*Este documento serve como guia oficial para o desenvolvimento da API de Pedidos, unindo as necessidades de negócio à excelência técnica.*