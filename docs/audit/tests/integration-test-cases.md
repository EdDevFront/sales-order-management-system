# Casos de Teste de Integração - Auditoria (Audit)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Arquivo | Status |
| :--- | :--- | :--- | :--- |
| **CT-INT-AUD-01**<br>Exibir CREATE_ORDER na tabela | Renderizar log de criação com badge e dados corretos | `audit/tests/audit.test.tsx` | ✅ |
| **CT-INT-AUD-02**<br>Exibir UPDATE_STATUS na tabela | Renderizar log de transição com badge azul | `audit/tests/audit.test.tsx` | ✅ |
| **CT-INT-AUD-03**<br>Exibir UPDATE_DELIVERY na tabela | Renderizar log de agendamento com badge âmbar | `audit/tests/audit.test.tsx` | ✅ |
| **CT-INT-AUD-04**<br>Exibir UPDATE_TRANSPORT na tabela | Renderizar log de transporte com badge âmbar | `audit/tests/audit.test.tsx` | ✅ |

## 🟡 Casos de Teste Importantes

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-INT-AUD-05** | Expandir linha - clicar Inspecionar exibe JSON lado a lado |
| **CT-INT-AUD-06** | Recolher linha - clicar Ocultar esconde detalhes |
| **CT-INT-AUD-07** | Copiar JSON - botão Copiar escreve no clipboard |
| **CT-INT-AUD-08** | NULL previousState - CREATE_ORDER exibe NULL no estado anterior |

## 🔵 Casos de Teste Complementares

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-INT-AUD-09** | Paginação - 9 logs geram 2 páginas |
| **CT-INT-AUD-10** | Empty state - sem logs exibe mensagem |
| **CT-INT-AUD-11** | Apenas uma linha expandida - clicar segunda recolhe primeira |
