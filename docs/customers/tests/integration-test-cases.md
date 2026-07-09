# Casos de Teste de Integração - Clientes (Customers)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário                                     | Objetivo                                         | Entrada                                                 | Saída Esperada                                                       | Arquivo               | Status |
| :----------------------------------------------- | :----------------------------------------------- | :------------------------------------------------------ | :------------------------------------------------------------------- | :-------------------- | :----- |
| **CT-INT-CUST-01**<br>saveCustomer mutation      | Mutation salva cliente e invalida cache          | `saveCustomer({ name: "Teste", documentType: "CNPJ" })` | Cliente salvo no banco, `invalidateQueries(["customers"])` disparado | `customers/index.tsx` | ✅     |
| **CT-INT-CUST-02**<br>Transportes no MultiSelect | Lista de transportes populada no formulário      | `fetchTransportTypes()` retorna 3 transportes           | MultiSelect exibe "Caminhão", "Carreta", "Bi-truck"                  | `customers/index.tsx` | ✅     |
| **CT-INT-CUST-03**<br>Badges de autorização      | `authorizedTransportTypeIds` exibida como badges | Cliente com `authorizedTransportTypeIds: ["trans-1"]`   | Badge "Caminhão" visível na linha da tabela                          | `customers/index.tsx` | ✅     |
| **CT-INT-CUST-04**<br>Documento formatado        | Documento exibe CPF/CNPJ com máscara             | `document: "12.345.678/0001-97"`                        | Texto exato exibido na coluna Documento                              | `customers/index.tsx` | ✅     |

## 🟡 Casos de Teste Importantes

| ID / Cenário       | Objetivo                   | Entrada                                | Saída Esperada                                           |
| :----------------- | :------------------------- | :------------------------------------- | :------------------------------------------------------- |
| **CT-INT-CUST-05** | Edição pré-preenche dados  | Clicar "Editar" em "Acme Logistics SA" | Formulário com nome, documento e transportes preenchidos |
| **CT-INT-CUST-06** | Cache invalidado ao salvar | `saveCustomer` com sucesso             | `invalidateQueries(["customers"])` chamado               |

## 🔵 Casos de Teste Complementares

| ID / Cenário       | Objetivo            | Entrada        | Saída Esperada                      |
| :----------------- | :------------------ | :------------- | :---------------------------------- |
| **CT-INT-CUST-07** | Paginação na tabela | 10+ clientes   | Página 1: 8, rodapé "Página 1 de X" |
| **CT-INT-CUST-08** | Empty state         | Nenhum cliente | "Nenhum registro encontrado."       |
