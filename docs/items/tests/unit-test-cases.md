# Casos de Teste Unitários - Itens (Items)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Arquivo | Status |
| :--- | :--- | :--- | :--- |
| **CT-UNIT-ITEM-01**<br>Schema nome curto | `itemSchema` rejeita nome < 2 caracteres | `items/tests/itemSchema.test.ts` | ✅ |
| **CT-UNIT-ITEM-02**<br>Schema SKU curto | `itemSchema` rejeita SKU < 3 caracteres | `items/tests/itemSchema.test.ts` | ✅ |
| **CT-UNIT-ITEM-03**<br>Schema preço zero | `itemSchema` rejeita `price = 0` | `items/tests/itemSchema.test.ts` | ✅ |
| **CT-UNIT-ITEM-04**<br>Schema preço negativo | `itemSchema` rejeita `price = -10` | `items/tests/itemSchema.test.ts` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-UNIT-ITEM-05** | Schema aceita preço mínimo (0.01) |
| **CT-UNIT-ITEM-06** | Schema aceita dados válidos completos |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-UNIT-ITEM-07** | Formatação BRL do preço na tabela |
| **CT-UNIT-ITEM-08** | SKU exibido em fonte monoespaçada |
