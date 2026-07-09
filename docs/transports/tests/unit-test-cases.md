# Casos de Teste Unitários - Tipos de Transporte (Transports)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Arquivo | Status |
| :--- | :--- | :--- | :--- |
| **CT-UNIT-TRANS-01**<br>Schema nome curto | `transportSchema` rejeita nome < 2 caracteres | `transports/tests/transportSchema.test.ts` | ✅ |
| **CT-UNIT-TRANS-02**<br>Schema descrição curta | `transportSchema` rejeita descrição < 5 caracteres | `transports/tests/transportSchema.test.ts` | ✅ |
| **CT-UNIT-TRANS-03**<br>Schema dados válidos | `transportSchema` aceita transporte completo | `transports/tests/transportSchema.test.ts` | ✅ |
| **CT-UNIT-TRANS-04**<br>Schema id opcional | `transportSchema` aceita `id` para edição | `transports/tests/transportSchema.test.ts` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-UNIT-TRANS-05** | Cache de customers invalidado ao editar transporte |
| **CT-UNIT-TRANS-06** | Nome e descrição não podem ser vazios |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-UNIT-TRANS-07** | Paginação na listagem (8 itens) |
| **CT-UNIT-TRANS-08** | Dados seed padrão no primeiro acesso |
