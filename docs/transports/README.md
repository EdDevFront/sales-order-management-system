# Documentação da Página de Transportes

Configurações de modos de transporte logístico.

## Componentes e Estrutura
- **Botão de Novo Tipo de Transporte**: Abre o `TransportForm`.
- **TransportForm**: Formulário retrátil para detalhes (Nome, Descrição).
- **DataTable**: Lista modos de transporte com ação de Editar.

## Diagrama de Fluxo (Sequência)
```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant UI as Transportes (UI)
    participant Repo as React Query (Repository)

    Usuario->>UI: Clica em "Novo Tipo de Transporte" ou "Editar"
    UI->>UI: Abre formulário TransportForm
    Usuario->>UI: Insere nome e descrição do transporte
    Usuario->>UI: Clica em "Salvar"
    UI->>Repo: Dispara mutação saveTransportType(payload)
    Repo-->>UI: Invalida consultas de transportes/clientes e atualiza DataTable
    UI->>UI: Fecha TransportForm
```
