# Casos de Teste Unitários - Dashboard

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Arquivo | Status |
| :--- | :--- | :--- | :--- |
| **CT-UNIT-DASH-01**<br>Formatação BRL | `formatCurrencyBR` retorna formato `R$ 1.500,00` | `utils/formatCurrency.test.ts` | ✅ |
| **CT-UNIT-DASH-02**<br>Filtro de pedidos por status | `filteredOrders` com `reduxFilters.status` filtra corretamente | `dashboard/tests/dashboard.test.tsx` | ✅ |
| **CT-UNIT-DASH-03**<br>Filtro combinado | Filtros de status + cliente + transporte funcionam juntos | `dashboard/tests/dashboard.test.tsx` | ✅ |
| **CT-UNIT-DASH-04**<br>Métricas calculadas | `metricCards` calcula Total, Requer Agendamento, Em Transporte, Entregues | `dashboard/tests/dashboard.test.tsx` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-UNIT-DASH-05** | Paginação - 8 itens por página com `paginatedOrders` |
| **CT-UNIT-DASH-06** | Filtro por data - prefix match em `createdAt` |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-UNIT-DASH-07** | Botão "Limpar filtros" visível apenas quando filtros ativos |
| **CT-UNIT-DASH-08** | Reset de página para 1 ao aplicar filtros |
