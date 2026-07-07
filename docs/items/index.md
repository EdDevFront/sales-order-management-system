# Documentação da Página de Itens

Configurações de itens do inventário de mercadorias.

## Funcionalidades
- **Cadastro de Produtos**: Cadastro de novos produtos ou mercadorias informando Nome comercial, código único SKU e Preço Unitário de Venda.
- **Tabela de Inventário**: Visualização de preços e códigos SKU em formato estruturado.

## Componentes e Estrutura
- **Botão de Novo Item**: Abre o `ItemForm`.
- **ItemForm**: Formulário retrátil para detalhes do item (Nome, SKU, Preço).
- **DataTable**: Lista itens.

## Diagramas de Sequência

### 👥 Fluxo do Usuário (Não Técnico)
```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant Tela as Tela de Itens

    Usuario->>Tela: Clica em "Novo Item"
    Tela-->>Usuario: Exibe formulário de criação
    Usuario->>Tela: Preenche nome, SKU, preço e clica em Criar
    Tela-->>Usuario: Fecha formulário e adiciona item na tabela
```

### ⚙️ Arquitetura e Fluxo Técnico
```mermaid
sequenceDiagram
    participant UI as Items Component
    participant Form as ItemForm Component
    participant Repo as saveItem Mutation

    UI->>Form: Abre com defaultValues
    Form->>Repo: mutate(ItemFormData)
    Repo->>UI: invalidateQueries("items")
    UI->>UI: Atualiza DataTable com dados recalculados
```
