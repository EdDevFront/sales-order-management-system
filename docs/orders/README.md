# Documentação da Página de Pedidos

Gerenciamento de ciclo de vida para Pedidos de Venda, operações de agendamento e inspeções de detalhes.

## Componentes e Estrutura
- **Botão de Novo Pedido**: Abre o modal `OrderForm` para criar pedidos.
- **DataTable**: Lista pedidos, exibindo ID do Pedido, Cliente, Status, Total do Pedido e botão de Inspecionar.
- **OrderDetailPanel**: Painel lateral que aparece quando um pedido é selecionado, exibindo dados do cliente, seleção de tipo de transporte (para estados mutáveis), detalhamento de itens e controles de transição de status.
- **SchedulingModal**: Modal para especificar a data de entrega e períodos (manhã/tarde/noite) para pedidos planejados.

## Diagrama de Fluxo
```mermaid
graph TD
    A[Central de Pedidos] --> B[DataTable Lista Pedidos]
    B --> C[Clique em Novo Pedido]
    C --> D[Renderiza Modal do OrderForm]
    D --> E[Usuário Seleciona Cliente, Transporte & Itens]
    E --> F[Enviar Pedido -> Dispara createOrderRequest -> Invalida Query]
    B --> G[Clique em Inspecionar na Linha]
    G --> H[Abre OrderDetailPanel]
    H --> I{Pedido está em CRIADA / PLANEJADA?}
    I -- Sim --> J[Habilita dropdown de edição do Tipo de Transporte]
    I -- Não --> K[Tipo de Transporte apenas leitura]
    H --> L[Clique em Transicionar Status]
    L --> M[Dispara updateStatusRequest]
    H --> N[Clique em Agendar / Reagendar]
    N --> O[Abre SchedulingModal]
    O --> P[Enviar Detalhes do Agendamento -> Dispara updateStatusRequest com dados de agendamento]
```
