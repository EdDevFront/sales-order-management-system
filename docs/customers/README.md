# Documentação da Página de Clientes

Gerenciamento de perfis e autorizações de logística.

## Componentes e Estrutura
- **Botão de Novo Cliente**: Abre o `CustomerForm` para criação.
- **CustomerForm**: Formulário retrátil para dados do cliente (Nome, Tipo de Documento, Número do Documento e tags multi-seleção de Transportes Autorizados).
- **DataTable**: Lista clientes com detalhes e ação de Editar.

## Diagrama de Fluxo (Sequência)
```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant UI as Clientes (UI)
    participant Repo as React Query (Repository)

    Usuario->>UI: Clica em "Novo Cliente" ou "Editar"
    UI->>UI: Abre formulário CustomerForm
    Usuario->>UI: Insere dados e seleciona transportes autorizados
    Usuario->>UI: Clica em "Salvar"
    UI->>Repo: Dispara mutação saveCustomer(payload)
    Repo-->>UI: Invalida consulta de clientes e atualiza DataTable
    UI->>UI: Fecha CustomerForm
```
