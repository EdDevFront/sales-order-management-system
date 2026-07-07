# Documentação da Página de Clientes

Gerenciamento de perfis e autorizações de logística.

## Componentes e Estrutura
- **Botão de Novo Cliente**: Abre o `CustomerForm` para criação.
- **CustomerForm**: Formulário retrátil para dados do cliente (Nome, Tipo de Documento, Número do Documento e tags multi-seleção de Transportes Autorizados).
- **DataTable**: Lista clientes com detalhes e ação de Editar.

## Diagramas de Sequência

### 👥 Fluxo do Usuário (Não Técnico)
```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant Tela as Tela de Clientes

    Usuario->>Tela: Clica em "Novo Cliente" ou "Editar"
    Tela-->>Usuario: Exibe formulário do cliente
    Usuario->>Tela: Preenche dados e badges de transporte
    Usuario->>Tela: Clica em "Salvar"
    Tela-->>Usuario: Fecha formulário e exibe cliente atualizado na tabela
```

### ⚙️ Arquitetura e Fluxo Técnico
```mermaid
sequenceDiagram
    participant UI as Customers Component
    participant Form as CustomerForm Component
    participant Repo as saveCustomer Mutation

    UI->>Form: Abre passando editingCustomer (defaultValues)
    Form->>Repo: mutate(CustomerFormData)
    Repo->>UI: invalidateQueries("customers")
    UI->>UI: Atualiza DataTable com novos dados do cache
```
