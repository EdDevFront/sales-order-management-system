# Casos de Teste de Integração - Itens (Items)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Entrada | Saída Esperada | Arquivo | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CT-INT-ITEM-01**<br>saveItem mutation | Mutation salva item e invalida cache | `saveItem({ name: "Motor", sku: "MTR-001", price: 100 })` | Item adicionado, `invalidateQueries(["items"])` | `items/index.tsx` | ✅ |
| **CT-INT-ITEM-02**<br>Listagem pós-criação | Item aparece na tabela | Item salvo + recarregado via React Query | Item visível com Nome, SKU, Preço | `items/index.tsx` | ✅ |
| **CT-INT-ITEM-03**<br>Preço formatado BRL | Preço como `R$ X.XXX,XX` | `price: 1500` | Coluna Preço: `"R$ 1.500,00"` | `items/index.tsx` | ✅ |
| **CT-INT-ITEM-04**<br>Empty state | Mensagem sem itens | `fetchItems` → array vazio | "Nenhum registro encontrado." | `items/index.tsx` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo | Entrada | Saída Esperada |
| :--- | :--- | :--- | :--- |
| **CT-INT-ITEM-05** | Paginação 8 itens | 10+ itens | Página 1: 8 itens |
| **CT-INT-ITEM-06** | Skeletons loading | Promise pendente | `animate-pulse` no DOM |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo | Entrada | Saída Esperada |
| :--- | :--- | :--- | :--- |
| **CT-INT-ITEM-07** | Fechar modal sem salvar | Clicar "X" no formulário | Modal fecha, nenhum item criado |
| **CT-INT-ITEM-08** | SKU monoespaçado | SKU "HD-ENG-001" | Classe `font-mono` |
