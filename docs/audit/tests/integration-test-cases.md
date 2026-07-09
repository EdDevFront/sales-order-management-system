# Casos de Teste de Integração - Auditoria (Audit)

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário                                           | Objetivo                                  | Entrada                                                     | Saída Esperada                                          | Arquivo                      | Status |
| :----------------------------------------------------- | :---------------------------------------- | :---------------------------------------------------------- | :------------------------------------------------------ | :--------------------------- | :----- |
| **CT-INT-AUD-01**<br>Exibir CREATE_ORDER na tabela     | Renderizar log com badge CREATE_ORDER     | AuditLog `{ actionType: "CREATE_ORDER", entityId: "so-1" }` | Badge "CREATE_ORDER" visível com classe `bg-emerald-50` | `audit/tests/audit.test.tsx` | ✅     |
| **CT-INT-AUD-02**<br>Exibir UPDATE_STATUS na tabela    | Renderizar log com badge UPDATE_STATUS    | AuditLog `{ actionType: "UPDATE_STATUS" }`                  | Badge "UPDATE_STATUS" visível com classe `bg-blue-50`   | `audit/tests/audit.test.tsx` | ✅     |
| **CT-INT-AUD-03**<br>Exibir UPDATE_DELIVERY na tabela  | Renderizar log com badge UPDATE_DELIVERY  | AuditLog `{ actionType: "UPDATE_DELIVERY" }`                | Badge "UPDATE_DELIVERY" visível                         | `audit/tests/audit.test.tsx` | ✅     |
| **CT-INT-AUD-04**<br>Exibir UPDATE_TRANSPORT na tabela | Renderizar log com badge UPDATE_TRANSPORT | AuditLog `{ actionType: "UPDATE_TRANSPORT" }`               | Badge "UPDATE_TRANSPORT" visível                        | `audit/tests/audit.test.tsx` | ✅     |

## 🟡 Casos de Teste Importantes

| ID / Cenário      | Objetivo                             | Entrada                                                           | Saída Esperada                                            |
| :---------------- | :----------------------------------- | :---------------------------------------------------------------- | :-------------------------------------------------------- |
| **CT-INT-AUD-05** | Expandir linha com Inspecionar       | Clique em "Inspecionar" no registro com previousState e nextState | Painel expandido com "Estado Anterior" e "Próximo Estado" |
| **CT-INT-AUD-06** | Recolher linha com Ocultar           | Clique em "Ocultar" na linha expandida                            | Painel recolhido, "Estado Anterior" não está no DOM       |
| **CT-INT-AUD-07** | Copiar JSON para clipboard           | Clique em "Copiar" no painel expandido                            | `navigator.clipboard.writeText` chamado com JSON          |
| **CT-INT-AUD-08** | NULL previousState para CREATE_ORDER | CREATE_ORDER sem `previousState` → clicar Inspecionar             | Texto "NULL" exibido no lugar do estado anterior          |

## 🔵 Casos de Teste Complementares

| ID / Cenário      | Objetivo                   | Entrada                              | Saída Esperada                        |
| :---------------- | :------------------------- | :----------------------------------- | :------------------------------------ |
| **CT-INT-AUD-09** | Paginação com 9 logs       | `fetchAuditLogs` retorna 9 logs      | Texto "Página 1 de 2" visível         |
| **CT-INT-AUD-10** | Empty state sem logs       | `fetchAuditLogs` retorna array vazio | "Nenhum registro encontrado." visível |
| **CT-INT-AUD-11** | Apenas uma linha expandida | Clicar Inspecionar A → Inspecionar B | Apenas 1 botão "Ocultar" visível      |
