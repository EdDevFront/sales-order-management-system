# Casos de Teste de Integração - Dashboard

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário                                  | Objetivo                               | Entrada                                               | Saída Esperada                                              | Arquivo                              | Status |
| :-------------------------------------------- | :------------------------------------- | :---------------------------------------------------- | :---------------------------------------------------------- | :----------------------------------- | :----- |
| **CT-INT-DASH-01**<br>Métricas com dados mock | React Query + Redux renderizam 4 cards | 4 orders (CRIADA, PLANEJADA, EM_TRANSPORTE, ENTREGUE) | Total=4, Requer Agendamento=1, Em Transporte=1, Entregues=1 | `dashboard/tests/dashboard.test.tsx` | ✅     |
| **CT-INT-DASH-02**<br>Filtro por status       | Filtrar tabela por status              | PreloadedState `status: "CRIADA"`                     | Apenas order "so-1" visível                                 | `dashboard/tests/dashboard.test.tsx` | ✅     |
| **CT-INT-DASH-03**<br>Botão Limpar filtros    | Aparece/desaparece com filtros         | `status: "CRIADA"` → sem filtros                      | Com filtro: visível. Sem filtro: oculto                     | `dashboard/tests/dashboard.test.tsx` | ✅     |
| **CT-INT-DASH-04**<br>Empty state             | Mensagem sem pedidos                   | `fetchSalesOrders` → array vazio                      | "Nenhum registro encontrado." visível                       | `dashboard/tests/dashboard.test.tsx` | ✅     |

## 🟡 Casos de Teste Importantes

| ID / Cenário       | Objetivo             | Entrada                                  | Saída Esperada                       |
| :----------------- | :------------------- | :--------------------------------------- | :----------------------------------- |
| **CT-INT-DASH-05** | Filtered empty state | Filtro `ENTREGUE` + `cust-2` (sem match) | "Nenhum resultado..." + botão limpar |
| **CT-INT-DASH-06** | Aplicar Filtros      | Clique em "Aplicar Filtros"              | Dispatch de `setFilter`              |
| **CT-INT-DASH-07** | Skeletons loading    | Promise pendente                         | Elementos `animate-pulse` no DOM     |

## 🔵 Casos de Teste Complementares

| ID / Cenário       | Objetivo              | Entrada               | Saída Esperada            |
| :----------------- | :-------------------- | :-------------------- | :------------------------ |
| **CT-INT-DASH-08** | Paginação 10+ pedidos | 10 orders             | "Página 1 de 2"           |
| **CT-INT-DASH-09** | Filtro data           | `date = "2026-07-01"` | Order da data selecionada |
