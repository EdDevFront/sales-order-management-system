# Casos de Teste Unitários - Dashboard

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário                               | Objetivo                                 | Entrada                                                            | Saída Esperada                                              | Arquivo                              | Status |
| :----------------------------------------- | :--------------------------------------- | :----------------------------------------------------------------- | :---------------------------------------------------------- | :----------------------------------- | :----- |
| **CT-UNIT-DASH-01**<br>Formatação BRL      | `formatCurrencyBR` retorna `R$ 1.500,00` | `1500`                                                             | `"R$ 1.500,00"`                                             | `utils/formatCurrency.test.ts`       | ✅     |
| **CT-UNIT-DASH-02**<br>Filtro por status   | `filteredOrders` filtra por status       | Orders com status variados + filtro `status: "CRIADA"`             | Apenas orders com status `"CRIADA"`                         | `dashboard/tests/dashboard.test.tsx` | ✅     |
| **CT-UNIT-DASH-03**<br>Filtro combinado    | Filtros de status + cliente juntos       | Orders de `cust-1` + filtro `status: "CRIADA", clientId: "cust-1"` | Apenas `"so-1"` (cust-1 + CRIADA)                           | `dashboard/tests/dashboard.test.tsx` | ✅     |
| **CT-UNIT-DASH-04**<br>Métricas calculadas | 4 cards com valores corretos             | 4 orders com status diferentes                                     | Total=4, Requer Agendamento=1, Em Transporte=1, Entregues=1 | `dashboard/tests/dashboard.test.tsx` | ✅     |

## 🟡 Casos de Teste Importantes

| ID / Cenário        | Objetivo          | Entrada                            | Saída Esperada                                      |
| :------------------ | :---------------- | :--------------------------------- | :-------------------------------------------------- |
| **CT-UNIT-DASH-05** | Paginação 8 itens | 10 orders                          | Página 1: 8, Página 2: 2                            |
| **CT-UNIT-DASH-06** | Filtro por data   | `reduxFilters.date = "2026-07-01"` | Orders com `createdAt` começando com `"2026-07-01"` |

## 🔵 Casos de Teste Complementares

| ID / Cenário        | Objetivo                                    | Entrada                             | Saída Esperada    |
| :------------------ | :------------------------------------------ | :---------------------------------- | :---------------- |
| **CT-UNIT-DASH-07** | "Limpar filtros" visível com filtros ativos | `reduxFilters` com status != ALL    | Botão renderizado |
| **CT-UNIT-DASH-08** | Reset página ao aplicar filtros             | `currentPage = 3` + aplicar filtros | `currentPage = 1` |
