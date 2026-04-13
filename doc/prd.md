# PRD - API de Gestão de Pedidos (Orders-Service)

**Versão:** 1.0  
**Status:** Em Revisão  
**PM:** Gemini CLI  

---

## 1. Objetivos do Produto (O quê e Por quê)
**O quê:** Desenvolver um serviço centralizado para orquestração de pedidos.  
**Por quê:** Atualmente, a falta de um fluxo padronizado de pedidos causa inconsistência no estoque e atrasos na comunicação com o cliente. O objetivo é garantir **100% de integridade de dados** (estoque vs. pedido) e reduzir o tempo de processamento manual em **30%**.

---

## 2. Personas e User Stories

### Persona: Cliente Final
*   **User Story:** Como cliente, quero adicionar itens ao meu carrinho e finalizar a compra para que eu possa receber meus produtos no prazo.
*   **User Story:** Como cliente, quero acompanhar o status do meu pedido (Pendente, Pago, Enviado) para reduzir minha ansiedade sobre a entrega.
*   **User Story:** Como cliente, quero poder cancelar um pedido que ainda não foi pago para evitar cobranças indevidas.

### Persona: Gestor de Operações (Admin)
*   **User Story:** Como gestor, quero visualizar todos os pedidos filtrados por status para priorizar o despacho de mercadorias.
*   **User Story:** Como gestor, quero atualizar o status de um pedido para "Enviado" assim que ele sair do armazém.

---

## 3. Requisitos Funcionais e Critérios de Aceitação (AC)

### RF01: Criação de Pedido
*   **Descrição:** O sistema deve permitir a criação de um pedido com múltiplos itens.
*   **AC1:** O sistema DEVE validar se há estoque disponível antes de confirmar a criação.
*   **AC2:** O sistema DEVE calcular o valor total (Preço Unitário * Qtd + Frete) automaticamente.
*   **AC3:** O pedido deve ser criado inicialmente com o status `PENDENTE`.

### RF02: Gestão de Inventário (Reserva)
*   **Descrição:** Integração entre pedido e estoque.
*   **AC1:** Ao criar o pedido, a quantidade de itens deve ser "reservada" (deduzida do estoque disponível).
*   **AC2:** Se o pedido for cancelado, o estoque deve ser devolvido automaticamente.

### RF03: Fluxo de Status
*   **Descrição:** Transições de estado do pedido.
*   **AC1:** Um pedido só pode passar para `PAGO` se o pagamento for confirmado.
*   **AC2:** Um pedido `ENVIADO` não pode mais ser cancelado pelo usuário.

---

## 4. Requisitos Não-Funcionais (UX & Engenharia)
*   **Performance:** A criação do pedido deve levar menos de 200ms para não frustrar o usuário no checkout.
*   **Segurança:** Apenas o dono do pedido ou um admin pode visualizar os detalhes de um pedido específico.
*   **Disponibilidade:** O serviço deve operar em 99.9% do tempo, visto que é o "coração" da operação de vendas.

---

## 5. Critérios de Sucesso (KPIs)/
1.  **Taxa de Erro no Estoque:** < 0.1% (Inconsistência entre pedido e estoque real).
2.  **Tempo Médio de Resposta:** < 300ms nos endpoints de leitura.
3.  **Adoção:** 100% dos novos pedidos processados pela nova API em 30 dias.

---
*Este documento é a base para o desenvolvimento técnico descrito no `pedido-adr.md`.*