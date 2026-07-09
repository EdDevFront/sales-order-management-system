# Casos de Teste de Integração - Tipos de Transporte (Transports)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Arquivo | Status |
| :--- | :--- | :--- | :--- |
| **CT-INT-TRANS-01**<br>saveTransportType cria novo | Mutation cria transporte e invalida cache | `transports/index.tsx` + mock | ✅ |
| **CT-INT-TRANS-02**<br>saveTransportType edita existente | Mutation atualiza transporte com id existente | `transports/index.tsx` + mock | ✅ |
| **CT-INT-TRANS-03**<br>Cache customers invalidado | `invalidateQueries(["customers"])` ao editar transporte | `transports/index.tsx` | ✅ |
| **CT-INT-TRANS-04**<br>MultiSelect exibe transportes | Transportes carregados como opções no formulário de cliente | `customers/index.tsx` + `fetchTransportTypes` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-INT-TRANS-05** | Paginação - 8 transportes por página |
| **CT-INT-TRANS-06** | Dados seed carregados no primeiro acesso (Caminhão, Carreta, Bi-truck) |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-INT-TRANS-07** | Empty state sem transportes |
| **CT-INT-TRANS-08** | Modal fecha ao cancelar sem salvar |
