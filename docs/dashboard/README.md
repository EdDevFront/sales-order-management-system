# Documentação da Página de Dashboard

Painel de monitoramento operacional contendo métricas, controles de filtro ativos e tabela paginada de Pedidos de Venda.

## Componentes e Estrutura
- **Cards de Métrica**: Total de Pedidos, Necessita Agendamento (PLANEJADA), Em Transporte (EM_TRANSPORTE) e Entregues (ENTREGUE).
- **Controles de Filtro**: Seleções para Status, Cliente, Modo de Transporte e DatePicker para Data de Criação.
- **DataTable**: Lista pedidos filtrados pela seleção, mostrando ID do Pedido, Cliente, Tipo de Transporte, Detalhes de Entrega e Status.
- **Rodapé de Paginação**: Controlador de paginação padrão com 8 itens por página.

## Diagrama de Fluxo
```mermaid
graph TD
    A[Usuário acessa o Dashboard] --> B[React Query carrega Pedidos, Clientes, Transportes]
    B --> C{Está carregando?}
    C -- Sim --> D[Renderiza Cards de Skeleton & Linhas de Skeleton]
    C -- Não --> E[Renderiza Métricas & Controles de Filtro]
    E --> F[Usuário altera os Filtros]
    F --> G[Critérios de filtro atualizados na Store do Redux]
    G --> H[Deriva filteredOrders via useMemo]
    H --> I[Divide filteredOrders em paginatedOrders]
    I --> J{Existem correspondências?}
    J -- Não e filtros ativos --> K[Renderiza Estado Filtrado-Vazio com botão de Limpar Filtros]
    J -- Não e sem filtros ativos --> L[Renderiza Estado Vazio]
    J -- Sim --> M[Renderiza linhas da DataTable + controles de paginação]
    K -- Clique em Limpar --> N[Reseta Filtros no Redux & currentPage = 1]
    N --> G
```
