# Casos de Teste de Integração - Ordens de Venda (Orders)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Arquivo | Status |
| :--- | :--- | :--- | :--- |
| **CT-INT-ORD-01**<br>createOrderWorker sucesso | Criar pedido, validar transporte, gerar audit log | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-ORD-02**<br>createOrderWorker - transporte não autorizado | Rejeitar criação com transporte não autorizado | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-ORD-03**<br>updateStatusWorker CRIADA → PLANEJADA | Transicionar status e registrar audit log | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-ORD-04**<br>updateDeliveryWorker PLANEJADA → AGENDADA | Agendar entrega, mudar status, registrar audit | `orders/tests/orderSaga.test.ts` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-INT-ORD-05** | updateStatusWorker transição inválida rejeitada |
| **CT-INT-ORD-06** | updateStatusWorker pedido não encontrado |
| **CT-INT-ORD-07** | updateDeliveryWorker reagendamento sem mudar status |
| **CT-INT-ORD-08** | updateTransportWorker sucesso com autorização |
| **CT-INT-ORD-09** | updateTransportWorker transporte não autorizado rejeitado |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-INT-ORD-10** | createOrderWorker cliente inexistente |
| **CT-INT-ORD-11** | updateStatusWorker terminal ENTREGUE bloqueado |
| **CT-INT-ORD-12** | updateTransportWorker pedido não encontrado |
| **CT-INT-ORD-13** | updateTransportWorker cliente não encontrado |
