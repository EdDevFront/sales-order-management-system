# Casos de Teste de Integração

Este documento define os cenários de teste de integração para validação dos fluxos completos entre componentes, sagas Redux, repositórios mock e o banco de dados local (localStorage).

---

## 🔴 Casos de Teste Críticos — Implementados

| ID / Cenário | Objetivo | Arquivo | Status |
| :--- | :--- | :--- | :--- |
| **CT-INT-01**<br>createOrderWorker - sucesso | Criar pedido, validar transporte autorizado, gerar audit log | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-02**<br>createOrderWorker - transporte não autorizado | Rejeitar criação com transporte não autorizado para o cliente | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-03**<br>createOrderWorker - cliente inexistente | Rejeitar criação quando cliente não existe no banco | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-04**<br>updateStatusWorker - CRIADA → PLANEJADA | Transicionar status e registrar audit log | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-05**<br>updateStatusWorker - PLANEJADA → AGENDADA | Transicionar status válido | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-06**<br>updateStatusWorker - transição inválida | Rejeitar CRIADA → AGENDADA com erro | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-07**<br>updateStatusWorker - pedido não encontrado | Rejeitar transição quando orderId não existe | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-08**<br>updateStatusWorker - terminal bloqueado | Rejeitar transição a partir de ENTREGUE | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-09**<br>updateDeliveryWorker - PLANEJADA → AGENDADA | Agendar entrega, transicionar status e registrar audit | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-10**<br>updateDeliveryWorker - reagendamento | Atualizar entrega sem mudar status (AGENDADA → AGENDADA) | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-11**<br>updateDeliveryWorker - pedido não encontrado | Rejeitar agendamento quando orderId não existe | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-12**<br>updateTransportWorker - sucesso | Alterar tipo de transporte e registrar audit | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-13**<br>updateTransportWorker - não autorizado | Rejeitar troca de transporte não autorizado para o cliente | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-14**<br>updateTransportWorker - pedido não encontrado | Rejeitar troca quando orderId não existe | `orders/tests/orderSaga.test.ts` | ✅ |
| **CT-INT-15**<br>updateTransportWorker - cliente não encontrado | Rejeitar troca quando cliente do pedido não existe | `orders/tests/orderSaga.test.ts` | ✅ |

---

## 🟡 Casos de Teste Importantes — Documentados (não implementados)

| ID / Cenário | Objetivo | Sugestão de implementação |
| :--- | :--- | :--- |
| **CT-INT-16**<br>Dashboard - métricas refletem dados do repositório mock | React Query + Redux integrados renderizam cards corretos | Component test com mockResolvedValue |
| **CT-INT-17**<br>Dashboard - filtro + paginação integrados | Filtrar orders e paginar resultados juntos | Component test com múltiplos orders |
| **CT-INT-18**<br>Audit - expandir linha com dados de diferentes actionTypes | Inspecionar CREATE_ORDER vs UPDATE_STATUS | Component test com múltiplos audit logs |
| **CT-INT-19**<br>Customer - máscara de documento + validação integradas | Digitar CPF → máscara aplicada → schema válido | Teste de formulário com userEvent |
| **CT-INT-20**<br>Order - multi-step: criar → transicionar → agendar → entregar | Fluxo completo de ponta a ponta | Sequência de sagas com estado compartilhado |

---

## 🔵 Casos de Teste Complementares — Documentados (não implementados)

| ID / Cenário | Objetivo |
| :--- | :--- |
| **CT-INT-21** | mockDatabase - load/save com localStorage |
| **CT-INT-22** | mockDatabase - dados padrão (seed) na primeira execução |
| **CT-INT-23** | Redux store - configureStore com sagas |
| **CT-INT-24** | AppProviders - Provider + QueryClientProvider integrados |
| **CT-INT-25** | Audit - apenas uma linha expandida por vez (integração) |
