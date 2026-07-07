# Documentação da Página de Itens

Configurações de itens do inventário de mercadorias.

## Componentes e Estrutura
- **Botão de Novo Item**: Abre o `ItemForm`.
- **ItemForm**: Formulário retrátil para detalhes do item (Nome, SKU, Preço).
- **DataTable**: Lista itens.

## Diagrama de Fluxo (Sequência)
```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant UI as Itens (UI)
    participant Repo as React Query (Repository)

    Usuario->>UI: Clica em "Novo Item"
    UI->>UI: Abre formulário ItemForm
    Usuario->>UI: Insere nome, SKU e preço do item
    Usuario->>UI: Clica em "Criar"
    UI->>Repo: Dispara mutação saveItem(payload)
    Repo-->>UI: Invalida consulta de itens e atualiza DataTable
    UI->>UI: Fecha ItemForm
```
