# Casos de Teste Unitários - Tipos de Transporte (Transports)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário                                   | Objetivo                         | Entrada                                                              | Saída Esperada                          | Arquivo                                    | Status |
| :--------------------------------------------- | :------------------------------- | :------------------------------------------------------------------- | :-------------------------------------- | :----------------------------------------- | :----- |
| **CT-UNIT-TRANS-01**<br>Schema nome curto      | Rejeita nome < 2 caracteres      | `{ name: "A", description: "Descrição válida" }`                     | `success: false`, erro `"2 caracteres"` | `transports/tests/transportSchema.test.ts` | ✅     |
| **CT-UNIT-TRANS-02**<br>Schema descrição curta | Rejeita descrição < 5 caracteres | `{ name: "Van", description: "Abc" }`                                | `success: false`, erro `"5 caracteres"` | `transports/tests/transportSchema.test.ts` | ✅     |
| **CT-UNIT-TRANS-03**<br>Schema dados válidos   | Aceita transporte completo       | `{ name: "Van", description: "Veículo leve para entregas urbanas" }` | `success: true`                         | `transports/tests/transportSchema.test.ts` | ✅     |
| **CT-UNIT-TRANS-04**<br>Schema id opcional     | Aceita id para edição            | `{ id: "trans-1", name: "Van", description: "..." }`                 | `success: true`                         | `transports/tests/transportSchema.test.ts` | ✅     |

## 🟡 Casos de Teste Importantes

| ID / Cenário         | Objetivo                   | Entrada                            | Saída Esperada                     |
| :------------------- | :------------------------- | :--------------------------------- | :--------------------------------- |
| **CT-UNIT-TRANS-05** | Cache customers invalidado | Editar transporte com id existente | `invalidateQueries(["customers"])` |
| **CT-UNIT-TRANS-06** | Nome e descrição vazios    | `{ name: "", description: "" }`    | Erros de validação                 |

## 🔵 Casos de Teste Complementares

| ID / Cenário         | Objetivo          | Entrada            | Saída Esperada              |
| :------------------- | :---------------- | :----------------- | :-------------------------- |
| **CT-UNIT-TRANS-07** | Paginação 8 itens | 10+ transportes    | Página 1: 8                 |
| **CT-UNIT-TRANS-08** | Dados seed padrão | localStorage vazio | Caminhão, Carreta, Bi-truck |
