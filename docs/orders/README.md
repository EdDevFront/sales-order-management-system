# Documentação da Página de Pedidos

Gerenciamento de ciclo de vida para Pedidos de Venda, operações de agendamento e inspeções de detalhes.

## Componentes e Estrutura
- **Botão de Novo Pedido**: Abre o modal `OrderForm` para criar pedidos.
- **DataTable**: Lista pedidos, exibindo ID do Pedido, Cliente, Status, Total do Pedido e botão de Inspecionar.
- **OrderDetailPanel**: Painel lateral que aparece quando um pedido é selecionado, exibindo dados do cliente, seleção de tipo de transporte (para estados mutáveis), detalhamento de itens e controles de transição de status.
- **SchedulingModal**: Modal para especificar a data de entrega e períodos (manhã/tarde/noite) para pedidos planejados.

## Diagramas de Sequência

### 👥 Fluxo do Usuário (Não Técnico)
```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant Tela as Tela de Pedidos

    Usuario->>Tela: Clica em "Novo Pedido"
    Tela-->>Usuario: Exibe formulário do pedido
    Usuario->>Tela: Preenche dados e clica em Salvar
    Tela-->>Usuario: Fecha formulário e exibe pedido na tabela
    Usuario->>Tela: Seleciona pedido e clica em Inspecionar
    Tela-->>Usuario: Exibe detalhes do pedido no painel lateral
    Usuario->>Tela: Clica em "Transicionar Status" ou "Agendar"
    Tela-->>Usuario: Atualiza status/entrega no painel e na tabela
```

### ⚙️ Arquitetura e Fluxo Técnico
```mermaid
sequenceDiagram
    participant UI as Orders Component
    participant Panel as OrderDetailPanel
    participant Modal as SchedulingModal
    participant Store as Redux (Sagas / Actions)
    participant Cache as React Query Cache

    UI->>Store: dispatch(createOrderRequest(data))
    Store->>Cache: Grava novo pedido e invalida consultas
    UI->>Panel: Abre selecionando order
    Panel->>Store: dispatch(updateStatusRequest(newStatus))
    Panel->>Modal: Abre para agendamento
    Modal->>Store: dispatch(updateStatusRequest(status + data/janela))
```
