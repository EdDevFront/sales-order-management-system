# Casos de Teste de Integração - Clientes (Customers)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Arquivo | Status |
| :--- | :--- | :--- | :--- |
| **CT-INT-CUST-01**<br>saveCustomer mutation | Mutation salva cliente e invalida cache corretamente | Testado via `mockRepositories` | ✅ |
| **CT-INT-CUST-02**<br>Transportes carregados no MultiSelect | Lista de transportes é populada no formulário | `customers/index.tsx` + `fetchTransportTypes` | ✅ |
| **CT-INT-CUST-03**<br>Autorização vinculada ao cliente | `authorizedTransportTypeIds` persiste e é exibida como badges | Dados mock + renderização | ✅ |
| **CT-INT-CUST-04**<br>Documento formatado na tabela | Documento exibe CPF/CNPJ com máscara correta | Renderização no `DataTable` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-INT-CUST-05** | Edição de cliente - dados antigos são pré-preenchidos no formulário |
| **CT-INT-CUST-06** | Cache invalidado ao salvar - `invalidateQueries(["customers"])` é disparado |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-INT-CUST-07** | Paginação na tabela de clientes |
| **CT-INT-CUST-08** | Empty state sem clientes cadastrados |
