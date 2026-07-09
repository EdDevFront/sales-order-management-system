# Casos de Teste Unitários - Auditoria (Audit)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário                                                     | Objetivo                                                                | Entrada                           | Saída Esperada                                             | Arquivo                          | Status |
| :--------------------------------------------------------------- | :---------------------------------------------------------------------- | :-------------------------------- | :--------------------------------------------------------- | :------------------------------- | :----- |
| **CT-UNIT-AUD-01**<br>auditActionVariant - CREATE_ORDER          | `auditActionVariant("CREATE_ORDER")` retorna variante verde (emerald)   | `actionType = "CREATE_ORDER"`     | String contendo `"bg-emerald-50"` e `"border-emerald-200"` | `audit/tests/auditUtils.test.ts` | ✅     |
| **CT-UNIT-AUD-02**<br>auditActionVariant - fallback desconhecido | `auditActionVariant("UNKNOWN")` retorna variante âmbar (fallback)       | `actionType = "UNKNOWN"`          | String contendo `"bg-amber-50"` e `"border-amber-200"`     | `audit/tests/auditUtils.test.ts` | ✅     |
| **CT-UNIT-AUD-03**<br>auditActionVariant - UPDATE_DELIVERY       | `auditActionVariant("UPDATE_DELIVERY")` retorna fallback (não mapeado)  | `actionType = "UPDATE_DELIVERY"`  | String contendo `"bg-amber-50"` (fallback)                 | `audit/tests/auditUtils.test.ts` | ✅     |
| **CT-UNIT-AUD-04**<br>auditActionVariant - UPDATE_TRANSPORT      | `auditActionVariant("UPDATE_TRANSPORT")` retorna fallback (não mapeado) | `actionType = "UPDATE_TRANSPORT"` | String contendo `"bg-amber-50"` (fallback)                 | `audit/tests/auditUtils.test.ts` | ✅     |

## 🟡 Casos de Teste Importantes

| ID / Cenário       | Objetivo                                                     | Entrada                                                                        | Saída Esperada                                               |
| :----------------- | :----------------------------------------------------------- | :----------------------------------------------------------------------------- | :----------------------------------------------------------- |
| **CT-UNIT-AUD-05** | AuditLog actionType enum - todos os 4 tipos possuem variante | `"CREATE_ORDER"`, `"UPDATE_STATUS"`, `"UPDATE_DELIVERY"`, `"UPDATE_TRANSPORT"` | CREATE_ORDER → emerald, UPDATE_STATUS → blue, demais → amber |
| **CT-UNIT-AUD-06** | Audit columns constantes                                     | `AUDIT_COLUMNS`                                                                | `["Data e Hora", "Ação", "Entidade", "ID", "Detalhes"]`      |
| **CT-UNIT-AUD-07** | Audit skeleton widths                                        | `AUDIT_SKELETON_WIDTHS`                                                        | Array com 5 strings de largura                               |

## 🔵 Casos de Teste Complementares

| ID / Cenário       | Objetivo                     | Entrada                                                       | Saída Esperada                |
| :----------------- | :--------------------------- | :------------------------------------------------------------ | :---------------------------- |
| **CT-UNIT-AUD-08** | ITEMS_PER_PAGE = 8 constante | `ITEMS_PER_PAGE`                                              | `8`                           |
| **CT-UNIT-AUD-09** | Expanded log ID único        | `setExpandedLogId("audit-1")` → `setExpandedLogId("audit-2")` | `expandedLogId` = `"audit-2"` |
