# Casos de Teste Unitários - Clientes (Customers)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Entrada | Saída Esperada | Arquivo | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CT-UNIT-CUST-01**<br>isLegalPerson CNPJ | `isLegalPerson` retorna `true` para CNPJ, `false` para CPF | `{ documentType: "CNPJ" }` e `{ documentType: "CPF" }` | CNPJ → `true`, CPF → `false` | `customers/tests/customerEntities.test.ts` | ✅ |
| **CT-UNIT-CUST-02**<br>Transporte autorizado | `isTransportTypeAuthorizedForCustomer` retorna correto | `["trans-1","trans-2"]`, testar `"trans-1"` (autorizado) e `"trans-3"` (não) | `"trans-1"` → `true`, `"trans-3"` → `false` | `customers/tests/customerEntities.test.ts` | ✅ |
| **CT-UNIT-CUST-03**<br>CPF válido (algoritmo) | CPF com dígitos verificadores corretos é aceito | `"529.982.247-25"` | `true` | `customers/tests/customerSchema.test.ts` | ✅ |
| **CT-UNIT-CUST-04**<br>CNPJ válido (algoritmo) | CNPJ com dígitos verificadores corretos é aceito | `"11.222.333/0001-81"` | `true` | `customers/tests/customerSchema.test.ts` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo | Entrada | Saída Esperada |
| :--- | :--- | :--- | :--- |
| **CT-UNIT-CUST-05** | CPF/CNPJ inválido rejeitado | CPF `"529.982.247-00"`, CNPJ `"11.222.333/0001-00"` | `false` |
| **CT-UNIT-CUST-06** | CPF/CNPJ sequência rejeitada | `"111.111.111-11"`, `"00.000.000/0000-00"` | `false` |
| **CT-UNIT-CUST-07** | Schema nome curto | `{ name: "AB" }` | Erro `"O nome deve ter pelo menos 3 caracteres"` |
| **CT-UNIT-CUST-08** | Schema documento vazio | `{ document: "" }` | Erro `"O documento é obrigatório"` |
| **CT-UNIT-CUST-09** | Schema transportes vazio | `{ authorizedTransportTypeIds: [] }` | Erro `"pelo menos um tipo de transporte"` |
| **CT-UNIT-CUST-10** | Máscara CPF | `"52998224725"` + `type: "CPF"` | `"529.982.247-25"` |
| **CT-UNIT-CUST-11** | Máscara CNPJ | `"11222333000181"` + `type: "CNPJ"` | `"11.222.333/0001-81"` |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo | Entrada | Saída Esperada |
| :--- | :--- | :--- | :--- |
| **CT-UNIT-CUST-12** | Schema aceita id opcional (edição) | `{ id: "cust-1" }` + dados válidos | `success: true` |
| **CT-UNIT-CUST-13** | Documento vazio com type incorreto | `{ documentType: "RG" }` | Erro de enum inválido |
