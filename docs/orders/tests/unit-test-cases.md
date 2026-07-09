# Casos de Teste Unitários - Ordens de Venda (Orders)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Arquivo | Status |
| :--- | :--- | :--- | :--- |
| **CT-UNIT-ORD-01**<br>Transição CRIADA → PLANEJADA | `isValidStatusTransition` retorna `true` | `orders/tests/salesOrderEntities.test.ts` | ✅ |
| **CT-UNIT-ORD-02**<br>Transição inválida (skip) | `isValidStatusTransition("CRIADA", "AGENDADA")` retorna `false` | `orders/tests/salesOrderEntities.test.ts` | ✅ |
| **CT-UNIT-ORD-03**<br>Transição reversa bloqueada | `isValidStatusTransition("AGENDADA", "PLANEJADA")` retorna `false` | `orders/tests/salesOrderEntities.test.ts` | ✅ |
| **CT-UNIT-ORD-04**<br>Status terminal ENTREGUE | Nenhuma transição permitida a partir de ENTREGUE | `orders/tests/salesOrderEntities.test.ts` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-UNIT-ORD-05** | STATUS_LABEL - todos os 5 status têm label em português |
| **CT-UNIT-ORD-06** | Self-transition bloqueada (CRIADA → CRIADA) |
| **CT-UNIT-ORD-07** | Order form schema - cliente vazio rejeitado |
| **CT-UNIT-ORD-08** | Order form schema - items vazio rejeitado |
| **CT-UNIT-ORD-09** | Order form schema - quantity = 0 rejeitado |
| **CT-UNIT-ORD-10** | orderStatusVariant - cada status retorna variante CSS |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-UNIT-ORD-11** | OrderStepper - apenas próximo passo clicável |
| **CT-UNIT-ORD-12** | Order form multiple items - schema aceita array de itens |
