# Documentação da Página de Auditoria

Visualizador de registros da trilha de auditoria do sistema.

## Componentes e Estrutura
- **DataTable**: Lista logs, exibindo Data e Hora, Tipo de Ação, Entidade Afetada, ID e ação de Inspeção de Detalhes.
- **Ação de Inspeção**: Abre uma linha expansível abaixo do registro, renderizando os payloads JSON brutos do `previousState` (estado anterior) e `nextState` (próximo estado) lado a lado.

## Diagrama de Fluxo
```mermaid
graph TD
    A[Visualização de Auditoria] --> B[DataTable Lista Logs de Auditoria]
    B --> C[Clique em Inspecionar no log]
    C --> D{Está Expandido?}
    D -- Não --> E[Abre painel de detalhes na linha expansível]
    E --> F[Analisa os JSONs de previousState & nextState]
    F --> G[Renderiza blocos pre formatados do JSON lado a lado]
    D -- Sim --> H[Fecha painel de detalhes na linha expansível]
```
