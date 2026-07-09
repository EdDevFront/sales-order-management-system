# Casos de Teste Unitários - Auditoria (Audit)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Arquivo | Status |
| :--- | :--- | :--- | :--- |
| **CT-UNIT-AUD-01**<br>auditActionVariant - CREATE_ORDER | `auditActionVariant("CREATE_ORDER")` retorna variante verde (emerald) | `audit/tests/auditUtils.test.ts` | ✅ |
| **CT-UNIT-AUD-02**<br>auditActionVariant - fallback desconhecido | `auditActionVariant("UNKNOWN")` retorna variante âmbar (fallback) | `audit/tests/auditUtils.test.ts` | ✅ |
| **CT-UNIT-AUD-03**<br>auditActionVariant - UPDATE_DELIVERY | `auditActionVariant("UPDATE_DELIVERY")` retorna fallback (não mapeado) | `audit/tests/auditUtils.test.ts` | ✅ |
| **CT-UNIT-AUD-04**<br>auditActionVariant - UPDATE_TRANSPORT | `auditActionVariant("UPDATE_TRANSPORT")` retorna fallback (não mapeado) | `audit/tests/auditUtils.test.ts` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-UNIT-AUD-05** | AuditLog actionType enum - todos os 4 tipos possuem variante mapeada ou fallback |
| **CT-UNIT-AUD-06** | Audit columns constantes - `AUDIT_COLUMNS` contém as 5 colunas esperadas |
| **CT-UNIT-AUD-07** | Audit skeleton widths - `AUDIT_SKELETON_WIDTHS` tem 5 valores |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-UNIT-AUD-08** | ITEMS_PER_PAGE = 8 constante |
| **CT-UNIT-AUD-09** | Expanded log ID único - apenas um log expandido por vez |
