# Casos de Teste Unitários - Ordens de Venda (Orders)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário                                       | Objetivo                                  | Entrada                                    | Saída Esperada     | Arquivo                                   | Status |
| :------------------------------------------------- | :---------------------------------------- | :----------------------------------------- | :----------------- | :---------------------------------------- | :----- |
| **CT-UNIT-ORD-01**<br>Transição CRIADA → PLANEJADA | `isValidStatusTransition` retorna `true`  | `current: "CRIADA"`, `next: "PLANEJADA"`   | `true`             | `orders/tests/salesOrderEntities.test.ts` | ✅     |
| **CT-UNIT-ORD-02**<br>Transição inválida (skip)    | `isValidStatusTransition` retorna `false` | `current: "CRIADA"`, `next: "AGENDADA"`    | `false`            | `orders/tests/salesOrderEntities.test.ts` | ✅     |
| **CT-UNIT-ORD-03**<br>Transição reversa            | `isValidStatusTransition` retorna `false` | `current: "AGENDADA"`, `next: "PLANEJADA"` | `false`            | `orders/tests/salesOrderEntities.test.ts` | ✅     |
| **CT-UNIT-ORD-04**<br>Terminal ENTREGUE            | Nenhuma transição de ENTREGUE             | `current: "ENTREGUE"`, qualquer `next`     | `false` para todos | `orders/tests/salesOrderEntities.test.ts` | ✅     |

## 🟡 Casos de Teste Importantes

| ID / Cenário       | Objetivo              | Entrada                        | Saída Esperada                     |
| :----------------- | :-------------------- | :----------------------------- | :--------------------------------- |
| **CT-UNIT-ORD-05** | STATUS_LABEL completo | `STATUS_LABEL` dict            | 5 status com labels em português   |
| **CT-UNIT-ORD-06** | Self-transition       | `CRIADA → CRIADA`              | `false`                            |
| **CT-UNIT-ORD-07** | Schema cliente vazio  | `{ customerId: "" }`           | Erro "Selecione um cliente"        |
| **CT-UNIT-ORD-08** | Schema items vazio    | `{ items: [] }`                | Erro "Adicione pelo menos um item" |
| **CT-UNIT-ORD-09** | Schema quantity = 0   | `{ items: [{ quantity: 0 }] }` | Erro "pelo menos 1"                |
| **CT-UNIT-ORD-10** | orderStatusVariant    | Cada status                    | Classe CSS específica por status   |

## 🔵 Casos de Teste Complementares

| ID / Cenário       | Objetivo              | Entrada         | Saída Esperada              |
| :----------------- | :-------------------- | :-------------- | :-------------------------- |
| **CT-UNIT-ORD-11** | OrderStepper clicável | Status "CRIADA" | Apenas "PLANEJADA" clicável |
| **CT-UNIT-ORD-12** | Múltiplos itens       | 2 itens válidos | `success: true`             |
