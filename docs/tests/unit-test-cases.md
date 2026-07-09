# Casos de Teste Unitários

Este documento define os cenários de teste unitário para validação de funções puras, regras de domínio e schemas de validação da aplicação.

---

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Arquivo | Status |
| :--- | :--- | :--- | :--- |
| **CT-UNIT-01**<br>Transição de status válida CRIADA → PLANEJADA | `isValidStatusTransition("CRIADA", "PLANEJADA")` retorna `true` | `orders/tests/salesOrderEntities.test.ts` | ✅ |
| **CT-UNIT-02**<br>Transição de status inválida (skip) | `isValidStatusTransition("CRIADA", "AGENDADA")` retorna `false` | `orders/tests/salesOrderEntities.test.ts` | ✅ |
| **CT-UNIT-03**<br>Transição reversa bloqueada | `isValidStatusTransition("AGENDADA", "PLANEJADA")` retorna `false` | `orders/tests/salesOrderEntities.test.ts` | ✅ |
| **CT-UNIT-04**<br>Status terminal ENTREGUE sem saída | Nenhuma transição é permitida a partir de ENTREGUE | `orders/tests/salesOrderEntities.test.ts` | ✅ |
| **CT-UNIT-05**<br>STATUS_LABEL completo | Todos os 5 status têm label em português | `orders/tests/salesOrderEntities.test.ts` | ✅ |
| **CT-UNIT-06**<br>isLegalPerson CNPJ | CNPJ → `true`, CPF → `false` | `customers/tests/customerEntities.test.ts` | ✅ |
| **CT-UNIT-07**<br>Transporte autorizado | `isTransportTypeAuthorizedForCustomer` retorna `true/false` corretamente | `customers/tests/customerEntities.test.ts` | ✅ |
| **CT-UNIT-08**<br>CPF válido (algoritmo) | CPF com dígitos verificadores corretos | `customers/tests/customerSchema.test.ts` | ✅ |
| **CT-UNIT-09**<br>CPF inválido (dígitos errados) | CPF com dígitos verificadores incorretos | `customers/tests/customerSchema.test.ts` | ✅ |
| **CT-UNIT-10**<br>CPF sequência repetida rejeitado | CPFs como `111.111.111-11` são rejeitados | `customers/tests/customerSchema.test.ts` | ✅ |
| **CT-UNIT-11**<br>CNPJ válido (algoritmo) | CNPJ com dígitos verificadores corretos | `customers/tests/customerSchema.test.ts` | ✅ |
| **CT-UNIT-12**<br>CNPJ inválido (dígitos errados) | CNPJ com dígitos verificadores incorretos | `customers/tests/customerSchema.test.ts` | ✅ |
| **CT-UNIT-13**<br>Schema Customer - nome curto | `customerSchema` rejeita nome < 3 caracteres | `customers/tests/customerSchema.test.ts` | ✅ |
| **CT-UNIT-14**<br>Schema Customer - documento vazio | `customerSchema` rejeita documento vazio | `customers/tests/customerSchema.test.ts` | ✅ |
| **CT-UNIT-15**<br>Schema Customer - transportes vazio | `customerSchema` rejeita lista de transportes vazia | `customers/tests/customerSchema.test.ts` | ✅ |
| **CT-UNIT-16**<br>Schema Item - nome curto | `itemSchema` rejeita nome < 2 caracteres | `items/tests/itemSchema.test.ts` | ✅ |
| **CT-UNIT-17**<br>Schema Item - SKU curto | `itemSchema` rejeita SKU < 3 caracteres | `items/tests/itemSchema.test.ts` | ✅ |
| **CT-UNIT-18**<br>Schema Item - preço zero | `itemSchema` rejeita preço = 0 | `items/tests/itemSchema.test.ts` | ✅ |
| **CT-UNIT-19**<br>Schema Transport - nome curto | `transportSchema` rejeita nome < 2 caracteres | `transports/tests/transportSchema.test.ts` | ✅ |
| **CT-UNIT-20**<br>Schema Transport - descrição curta | `transportSchema` rejeita descrição < 5 caracteres | `transports/tests/transportSchema.test.ts` | ✅ |
| **CT-UNIT-21**<br>Schema Order - cliente vazio | `orderFormSchema` rejeita `customerId` vazio | `orders/tests/orderFormSchema.test.ts` | ✅ |
| **CT-UNIT-22**<br>Schema Order - items vazio | `orderFormSchema` rejeita `items` array vazio | `orders/tests/orderFormSchema.test.ts` | ✅ |
| **CT-UNIT-23**<br>Schema Order - quantidade zero | `orderFormSchema` rejeita `quantity = 0` | `orders/tests/orderFormSchema.test.ts` | ✅ |
| **CT-UNIT-24**<br>Formatação BRL | `formatCurrencyBR(1500)` retorna `R$ 1.500,00` | `utils/formatCurrency.test.ts` | ✅ |
| **CT-UNIT-25**<br>auditActionVariant - mapeado | CREATE_ORDER e UPDATE_STATUS retornam variante específica | `audit/tests/auditUtils.test.ts` | ✅ |
| **CT-UNIT-26**<br>auditActionVariant - fallback | Ação não mapeada retorna variante âmbar (fallback) | `audit/tests/auditUtils.test.ts` | ✅ |
| **CT-UNIT-27**<br>orderStatusVariant - todos os status | Cada status retorna sua variante CSS específica | `audit/tests/auditUtils.test.ts` | ✅ |
| **CT-UNIT-28**<br>Máscara CPF - formatação correta | `maskDocument` aplica máscara `000.000.000-00` para CPF | `customers/tests/customerSchema.test.ts` | ✅ |
| **CT-UNIT-29**<br>Máscara CNPJ - formatação correta | `maskDocument` aplica máscara `00.000.000/0000-00` para CNPJ | `customers/tests/customerSchema.test.ts` | ✅ |

---

## 🟡 Casos de Teste Importantes — Documentados (não implementados)

| ID / Cenário | Objetivo | Sugestão de implementação |
| :--- | :--- | :--- |
| **CT-UNIT-30**<br>Pagination component - não renderiza se totalPages <= 1 | `Pagination` retorna `null` quando há apenas 1 página | Testar o componente `Pagination` isoladamente |
| **CT-UNIT-31**<br>DataTable - empty state | `DataTable.Body` com `isEmpty=true` exibe mensagem | Renderizar `DataTable` com props mockadas |
| **CT-UNIT-32**<br>DataTable - filtered empty state | `DataTable.Body` com `isFilteredEmpty=true` exibe SearchX + botão | Renderizar `DataTable` com `onClearFilters` |
| **CT-UNIT-33**<br>Select - onChange dispara onValueChange | `Select` com `onValueChange` callback é chamado | Simular clique em opção do dropdown |
| **CT-UNIT-34**<br>MultiSelect - toggle option | `MultiSelect` adiciona/remove items da lista selecionada | Simular clique em checkbox |
| **CT-UNIT-35**<br>DatePicker - seleciona data | `DatePicker` com `onDateChange` callback é chamado | Simular clique em dia do calendário |
| **CT-UNIT-36**<br>OrderStepper - step clicável | Apenas o próximo passo é clicável | Renderizar `OrderStepper` com `onStepClick` |
| **CT-UNIT-37**<br>Toast - auto-dismiss após 5s | `Toast` com `setTimeout` de 5s e `clearNotification` | Mockar `setTimeout` e verificar dispatch |

---

## 🔵 Casos de Teste Complementares — Documentados (não implementados)

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-UNIT-38** | Button - renderiza variantes (primary, outline, ghost, danger) |
| **CT-UNIT-39** | Input - forwardRef funcionando |
| **CT-UNIT-40** | DataTable.SkeletonRows - renderiza N linhas |
| **CT-UNIT-41** | Toast - não renderiza quando não há notificação |
| **CT-UNIT-42** | Toast - não renderiza quando modal está aberto |
| **CT-UNIT-43** | OrderStatusBadge - renderiza label correta para cada status |
| **CT-UNIT-44** | AuditLog actionType enum - todos os tipos possuem variante |
| **CT-UNIT-45** | formatCurrencyBR - valores com centavos, zero, grandes números |
