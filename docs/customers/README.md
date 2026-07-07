# Documentação da Página de Clientes

Gerenciamento de perfis e autorizações de logística.

## Funcionalidades
- **Listagem de Clientes**: Exibição em tabela com paginação sob demanda dos clientes cadastrados.
- **Cadastro e Edição**: Formulário expansível para criar novos perfis ou editar registros existentes (Nome, Tipo de Documento CNPJ/CPF e número correspondente).
- **Autorização Logística**: Associação de quais tipos de transporte cada cliente está autorizado a utilizar em suas respectivas entregas (gerenciados através de tags multi-selecionáveis).

## Componentes e Estrutura
- **Botão de Novo Cliente**: Abre o `CustomerForm` para criação.
- **CustomerForm**: Formulário retrátil para dados do cliente (Nome, Tipo de Documento, Número do Documento e tags de Transportes Autorizados).
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
