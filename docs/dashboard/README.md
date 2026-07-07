# Documentação da Página de Dashboard

Painel de monitoramento operacional contendo métricas, controles de filtro ativos e tabela paginada de Pedidos de Venda.

## Componentes e Estrutura
- **Cards de Métrica**: Total de Pedidos, Necessita Agendamento (PLANEJADA), Em Transporte (EM_TRANSPORTE) e Entregues (ENTREGUE).
- **Controles de Filtro**: Seleções para Status, Cliente, Modo de Transporte e DatePicker para Data de Criação.
- **DataTable**: Lista pedidos filtrados pela seleção, mostrando ID do Pedido, Cliente, Tipo de Transporte, Detalhes de Entrega e Status.
- **Rodapé de Paginação**: Controlador de paginação padrão com 8 itens por página.

## Diagrama de Fluxo (Sequência)
```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant UI as Dashboard (UI)
    participant Store as Redux (Store)
    participant Repo as React Query (Repository)

    Usuario->>UI: Acessa a página de Dashboard
    activate UI
    UI->>Repo: Consulta Pedidos, Clientes e Transportes
    Repo-->>UI: Retorna dados cadastrados
    UI->>UI: Calcula métricas e renderiza componentes
    deactivate UI

    Usuario->>UI: Altera critério de Filtro
    activate UI
    UI->>Store: Despacha setFilter(key, value)
    Store-->>UI: Retorna novo estado de filtros
    UI->>UI: Filtra e divide a lista em useMemo
    UI->>Usuario: Atualiza DataTable (Linhas ou Estado Vazio)
    deactivate UI
```
