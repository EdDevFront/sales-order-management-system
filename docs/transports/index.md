# Documentação da Página de Transportes

Configurações de modos de transporte logístico.

## Funcionalidades
- **Configuração de Modos**: Cadastro de novas categorias ou tipos de veículos logísticos autorizados no fluxo operacional.
- **Edição Cadastral**: Atualização rápida de nomes ou descrições dos tipos de transportes.
- **Tabela Paginada**: Visualização consolidada dos tipos com limite de itens configurável.

## Componentes e Estrutura
- **Botão de Novo Tipo de Transporte**: Abre o `TransportForm`.
- **TransportForm**: Formulário retrátil para detalhes (Nome, Descrição).
- **DataTable**: Lista modos de transporte com ação de Editar.

## Diagramas de Sequência

### 👥 Fluxo do Usuário (Não Técnico)
```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant Tela as Tela de Transportes

    Usuario->>Tela: Clica em "Novo Tipo de Transporte" ou "Editar"
    Tela-->>Usuario: Exibe formulário de transporte
    Usuario->>Tela: Preenche nome/descrição e clica em Salvar
    Tela-->>Usuario: Fecha formulário e exibe transporte na tabela
```

### ⚙️ Arquitetura e Fluxo Técnico
```mermaid
sequenceDiagram
    participant UI as Transports Component
    participant Form as TransportForm Component
    participant Repo as saveTransportType Mutation

    UI->>Form: Abre com editingTransport (defaultValues)
    Form->>Repo: mutate(TransportFormData)
    Repo->>UI: invalidateQueries("transports" e "customers")
    UI->>UI: Recarrega DataTable com dados do cache
```
