# Casos de Teste de Integração - Dashboard

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Arquivo | Status |
| :--- | :--- | :--- | :--- |
| **CT-INT-DASH-01**<br>Métricas com dados mock | React Query + Redux integrados renderizam 4 cards com valores corretos | `dashboard/tests/dashboard.test.tsx` | ✅ |
| **CT-INT-DASH-02**<br>Filtro por status | Selecionar status filtra tabela e atualiza visibilidade | `dashboard/tests/dashboard.test.tsx` | ✅ |
| **CT-INT-DASH-03**<br>Botão Limpar filtros | Aparece/desaparece conforme filtros ativos | `dashboard/tests/dashboard.test.tsx` | ✅ |
| **CT-INT-DASH-04**<br>Empty state sem pedidos | Exibe mensagem "Nenhum registro encontrado" | `dashboard/tests/dashboard.test.tsx` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-INT-DASH-05** | Filtered empty state - filtro sem resultados exibe SearchX + botão limpar |
| **CT-INT-DASH-06** | Botão Aplicar Filtros renderizado e funcional |
| **CT-INT-DASH-07** | Skeletons exibidos durante carregamento dos dados |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-INT-DASH-08** | Paginação para 10+ pedidos (2 páginas) |
| **CT-INT-DASH-09** | Filtro por data - apenas pedidos da data selecionada |
