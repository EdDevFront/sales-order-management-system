# Casos de Teste de Integração - Ordens de Venda (Orders)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Entrada | Saída Esperada | Arquivo | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CT-INT-ORD-01**<br>createOrderWorker sucesso | Criar pedido, validar transporte, audit log | `cust-1` + `trans-1` (autorizado) + 1 item | `createOrderSuccess`, audit `CREATE_ORDER` | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-ORD-02**<br>createOrderWorker - transporte não autorizado | Rejeitar criação | `cust-1` + `trans-99` (não autorizado) | `createOrderFailure` "not authorized" | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-ORD-03**<br>updateStatusWorker CRIADA → PLANEJADA | Transicionar + audit | `orderId: "so-1"`, `newStatus: "PLANEJADA"` | `updateStatusSuccess`, audit `UPDATE_STATUS` | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-ORD-04**<br>updateDeliveryWorker PLANEJADA → AGENDADA | Agendar + mudar status + audit | `orderId: "so-1"` PLANEJADA, `deliveryDate`, `deliveryWindow` | `updateDeliverySuccess`, status AGENDADA, audit | `orders/tests/orderSaga.test.ts` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo | Entrada | Saída Esperada |
| :--- | :--- | :--- | :--- |
| **CT-INT-ORD-05** | Transição inválida | `CRIADA → AGENDADA` | `updateStatusFailure` "Invalid status transition" |
| **CT-INT-ORD-06** | Pedido não encontrado | `orderId` inexistente | `updateStatusFailure` "Order not found" |
| **CT-INT-ORD-07** | Reagendamento | AGENDADA → nova data | Status AGENDADA, entrega atualizada |
| **CT-INT-ORD-08** | updateTransportWorker | `trans-2` autorizado | `updateTransportSuccess`, audit |
| **CT-INT-ORD-09** | Transporte não autorizado | `trans-99` | `updateTransportFailure` "not authorized" |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo | Entrada | Saída Esperada |
| :--- | :--- | :--- | :--- |
| **CT-INT-ORD-10** | Cliente inexistente | `customerId` inválido | `createOrderFailure` |
| **CT-INT-ORD-11** | Terminal ENTREGUE | ENTREGUE → CRIADA | `updateStatusFailure` |
| **CT-INT-ORD-12** | Transport pedido não encontrado | `orderId` inexistente | `updateTransportFailure` |
| **CT-INT-ORD-13** | Transport cliente não encontrado | Order sem customer no banco | `updateTransportFailure` |
