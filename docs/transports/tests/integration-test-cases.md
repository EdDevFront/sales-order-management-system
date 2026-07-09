# Casos de Teste de Integração - Tipos de Transporte (Transports)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Entrada | Saída Esperada | Arquivo | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CT-INT-TRANS-01**<br>saveTransportType cria | Mutation cria transporte | `{ name: "Van", description: "..." }` sem id | Adicionado, toast "criado com sucesso" | `transports/index.tsx` | ✅ |
| **CT-INT-TRANS-02**<br>saveTransportType edita | Mutation atualiza transporte | `{ id: "trans-1", name: "Caminhão Baú" }` | Atualizado, toast "atualizado com sucesso" | `transports/index.tsx` | ✅ |
| **CT-INT-TRANS-03**<br>Cache customers invalidado | `invalidateQueries(["customers"])` na edição | Editar "Caminhão" → "Caminhão Baú" | Cache customers invalidado | `transports/index.tsx` | ✅ |
| **CT-INT-TRANS-04**<br>MultiSelect exibe transportes | Opções no CustomerForm | 3 transportes no banco | "Caminhão", "Carreta", "Bi-truck" visíveis | `customers/index.tsx` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo | Entrada | Saída Esperada |
| :--- | :--- | :--- | :--- |
| **CT-INT-TRANS-05** | Paginação 8 itens | 10+ transportes | Página 1: 8 |
| **CT-INT-TRANS-06** | Dados seed | localStorage vazio | Caminhão, Carreta, Bi-truck |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo | Entrada | Saída Esperada |
| :--- | :--- | :--- | :--- |
| **CT-INT-TRANS-07** | Empty state | Sem transportes | "Nenhum registro encontrado." |
| **CT-INT-TRANS-08** | Fechar modal | Clicar "X" na edição | Modal fecha, alterações descartadas |
