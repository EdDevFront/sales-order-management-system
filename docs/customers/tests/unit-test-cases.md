# Casos de Teste Unitários - Clientes (Customers)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Arquivo | Status |
| :--- | :--- | :--- | :--- |
| **CT-UNIT-CUST-01**<br>isLegalPerson CNPJ | `isLegalPerson` retorna `true` para CNPJ, `false` para CPF | `customers/tests/customerEntities.test.ts` | ✅ |
| **CT-UNIT-CUST-02**<br>Transporte autorizado | `isTransportTypeAuthorizedForCustomer` retorna correto | `customers/tests/customerEntities.test.ts` | ✅ |
| **CT-UNIT-CUST-03**<br>CPF válido (algoritmo) | CPF com dígitos verificadores corretos é aceito | `customers/tests/customerSchema.test.ts` | ✅ |
| **CT-UNIT-CUST-04**<br>CNPJ válido (algoritmo) | CNPJ com dígitos verificadores corretos é aceito | `customers/tests/customerSchema.test.ts` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-UNIT-CUST-05** | CPF/CNPJ inválido - dígitos errados são rejeitados |
| **CT-UNIT-CUST-06** | CPF/CNPJ sequência - repetições como `111.111.111-11` rejeitadas |
| **CT-UNIT-CUST-07** | Schema nome curto - `customerSchema` rejeita nome < 3 caracteres |
| **CT-UNIT-CUST-08** | Schema documento vazio - `customerSchema` rejeita documento vazio |
| **CT-UNIT-CUST-09** | Schema transportes vazio - rejeita lista vazia |
| **CT-UNIT-CUST-10** | Máscara CPF - formata `000.000.000-00` |
| **CT-UNIT-CUST-11** | Máscara CNPJ - formata `00.000.000/0000-00` |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-UNIT-CUST-12** | Schema aceita id opcional (edição) |
| **CT-UNIT-CUST-13** | CPF/CNPJ com caracteres especiais - `isValidCPF` aceita com pontuação |
