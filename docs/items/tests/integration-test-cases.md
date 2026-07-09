# Casos de Teste de Integração - Itens (Items)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Arquivo | Status |
| :--- | :--- | :--- | :--- |
| **CT-INT-ITEM-01**<br>saveItem mutation | Mutation salva item e invalida cache | `items/index.tsx` + `mockRepositories` | ✅ |
| **CT-INT-ITEM-02**<br>Listagem após criação | Item criado aparece na tabela com dados corretos | DataTable + React Query | ✅ |
| **CT-INT-ITEM-03**<br>Preço formatado em BRL após load | Preço exibido como `R$ X.XXX,XX` | Renderização no DataTable | ✅ |
| **CT-INT-ITEM-04**<br>Empty state sem itens | Exibe "Nenhum registro encontrado" | `items/index.tsx` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-INT-ITEM-05** | Paginação - 8 itens por página |
| **CT-INT-ITEM-06** | Skeletons durante carregamento |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-INT-ITEM-07** | Modal fecha ao cancelar sem criar |
| **CT-INT-ITEM-08** | SKU em fonte monoespaçada na tabela |
