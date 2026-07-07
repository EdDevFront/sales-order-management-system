# Documentação da Página de Dashboard

Painel de monitoramento operacional contendo métricas, controles de filtro ativos e tabela paginada de Pedidos de Venda.

## Funcionalidades
- **Métricas Operacionais**: Visualização de contadores consolidados para pedidos totais, pendentes de agendamento (PLANEJADA), em trânsito (EM_TRANSPORTE) e entregues (ENTREGUE).
- **Filtros Dinâmicos**: Filtragem instantânea de pedidos por critérios combinados de Status, Cliente, Tipo de Transporte e Data de Criação.
- **Limpeza de Filtros**: Ação rápida de reset de todos os filtros ativos, limpando as seleções em um único clique.
- **Tabela Paginada**: Visualização dos pedidos de venda filtrados com suporte a paginação sob demanda (8 itens por página).

## Componentes e Estrutura
- **Cards de Métrica**: Total de Pedidos, Necessita Agendamento, Em Transporte e Entregues.
- **Controles de Filtro**: Seleções para Status, Cliente, Modo de Transporte e DatePicker para Data de Criação.
- **DataTable**: Lista pedidos filtrados pela seleção, mostrando ID do Pedido, Cliente, Tipo de Transporte, Detalhes de Entrega e Status.
- **Rodapé de Paginação**: Controlador de paginação padrão com 8 itens por página.

## Diagramas de Sequência

### 👥 Fluxo do Usuário (Não Técnico)
```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant Tela as Tela de Dashboard

    Usuario->>Tela: Entra no Dashboard
    Tela-->>Usuario: Mostra resumo de métricas e filtros
    Usuario->>Tela: Escolhe um filtro (ex: Cliente)
    Tela-->>Usuario: Atualiza a tabela com pedidos do cliente
    Usuario->>Tela: Clica em "Limpar Filtros"
    Tela-->>Usuario: Restaura todos os pedidos na tabela
```

### ⚙️ Arquitetura e Fluxo Técnico
```mermaid
sequenceDiagram
    participant UI as Dashboard Component
    participant Store as Redux Store (uiSlice)
    participant Cache as React Query (Orders Cache)

    UI->>Cache: Executa useQuery("orders")
    Cache-->>UI: Retorna lista de SalesOrder[]
    UI->>Store: Despacha setFilter({key, value})
    Store-->>UI: Retorna novos critérios de filtros
    UI->>UI: Executa useMemo para filtrar e paginar pedidos
    UI->>UI: Renderiza DataTable com subcomponentes
```
