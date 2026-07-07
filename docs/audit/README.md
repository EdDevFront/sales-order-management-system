# Documentação da Página de Auditoria

Visualizador de registros da trilha de auditoria do sistema.

## Componentes e Estrutura
- **DataTable**: Lista logs, exibindo Data e Hora, Tipo de Ação, Entidade Afetada, ID e ação de Inspeção de Detalhes.
- **Ação de Inspeção**: Abre uma linha expansível abaixo do registro, renderizando os payloads JSON brutos do `previousState` (estado anterior) e `nextState` (próximo estado) lado a lado.

## Diagrama de Fluxo (Sequência)
```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant UI as Auditoria (UI)

    Usuario->>UI: Clica em "Inspecionar" no registro do log
    activate UI
    UI->>UI: Analisa previousState e nextState JSONs
    UI->>UI: Abre painel expansível abaixo da linha
    UI->>Usuario: Exibe JSONs lado a lado de forma formatada
    deactivate UI

    Usuario->>UI: Clica em "Ocultar"
    UI->>UI: Fecha o painel expansível da linha
```
