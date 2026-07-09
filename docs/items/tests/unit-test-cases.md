# Casos de Teste Unitários - Itens (Items)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Entrada | Saída Esperada | Arquivo | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CT-UNIT-ITEM-01**<br>Schema nome curto | `itemSchema` rejeita nome < 2 caracteres | `{ name: "A", sku: "SKU-001", price: 10 }` | `success: false`, erro `"2 caracteres"` | `items/tests/itemSchema.test.ts` | ✅ |
| **CT-UNIT-ITEM-02**<br>Schema SKU curto | `itemSchema` rejeita SKU < 3 caracteres | `{ name: "Item", sku: "AB", price: 10 }` | `success: false`, erro `"3 caracteres"` | `items/tests/itemSchema.test.ts` | ✅ |
| **CT-UNIT-ITEM-03**<br>Schema preço zero | `itemSchema` rejeita `price = 0` | `{ name: "Item", sku: "SKU-001", price: 0 }` | `success: false`, erro `"positivo"` | `items/tests/itemSchema.test.ts` | ✅ |
| **CT-UNIT-ITEM-04**<br>Schema preço negativo | `itemSchema` rejeita `price = -10` | `{ name: "Item", sku: "SKU-001", price: -10 }` | `success: false` | `items/tests/itemSchema.test.ts` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo | Entrada | Saída Esperada |
| :--- | :--- | :--- | :--- |
| **CT-UNIT-ITEM-05** | Preço mínimo aceito | `price: 0.01` | `success: true` |
| **CT-UNIT-ITEM-06** | Dados válidos completos | Nome, SKU, Preço válidos | `success: true` |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo | Entrada | Saída Esperada |
| :--- | :--- | :--- | :--- |
| **CT-UNIT-ITEM-07** | Formatação BRL | `formatCurrencyBR(1500)` | `"R$ 1.500,00"` |
| **CT-UNIT-ITEM-08** | SKU monoespaçado | Item na tabela | Classe `font-mono` |
