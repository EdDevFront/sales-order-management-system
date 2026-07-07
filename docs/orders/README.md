# Documentação da Página de Pedidos

Gerenciamento de ciclo de vida para Pedidos de Venda, operações de agendamento e inspeções de detalhes.

## Componentes e Estrutura
- **Botão de Novo Pedido**: Abre o modal `OrderForm` para criar pedidos.
- **DataTable**: Lista pedidos, exibindo ID do Pedido, Cliente, Status, Total do Pedido e botão de Inspecionar.
- **OrderDetailPanel**: Painel lateral que aparece quando um pedido é selecionado, exibindo dados do cliente, seleção de tipo de transporte (para estados mutáveis), detalhamento de itens e controles de transição de status.
- **SchedulingModal**: Modal para especificar a data de entrega e períodos (manhã/tarde/noite) para pedidos planejados.

## Diagrama de Fluxo (Sequência)
```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant UI as Pedidos (UI)
    participant Store as Redux (Store / Actions)
    participant Repo as React Query (Cache)

    Usuario->>UI: Clica em "Novo Pedido"
    UI->>UI: Abre modal OrderForm
    Usuario->>UI: Preenche dados e clica em Salvar
    UI->>Store: Despacha createOrderRequest(payload)
    Store->>Repo: Atualiza dados e invalida cache
    Repo-->>UI: Atualiza lista da DataTable

    Usuario->>UI: Clica em "Inspecionar" na linha
    UI->>UI: Renderiza OrderDetailPanel lateral

    Usuario->>UI: Clica em Transicionar Status
    UI->>Store: Despacha updateStatusRequest(newStatus)
    Store->>Repo: Atualiza status do pedido

    Usuario->>UI: Clica em Agendar / Reagendar
    UI->>UI: Abre modal SchedulingModal
    Usuario->>UI: Informa Data/Janela e clica em Agendar
    UI->>Store: Despacha updateStatusRequest com dados de entrega
    Store->>Repo: Atualiza informações de entrega do pedido
```
