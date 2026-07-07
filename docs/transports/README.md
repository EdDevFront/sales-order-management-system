# Documentação da Página de Transportes

Configurações de modos de transporte logístico.

## Componentes e Estrutura
- **Botão de Novo Tipo de Transporte**: Abre o `TransportForm`.
- **TransportForm**: Formulário retrátil para detalhes (Nome, Descrição).
- **DataTable**: Lista modos de transporte com ação de Editar.

## Diagrama de Fluxo
```mermaid
graph TD
    A[Visualização de Transportes] --> B[DataTable Lista Modos de Transporte]
    B --> C[Clique em Novo Tipo de Transporte / Editar]
    C --> D[Abre TransportForm]
    D --> E[Usuário insere nome e descrição]
    E --> F[Clique em Salvar -> Dispara Mutação -> Invalida query de transportes/clientes -> Fecha Formulário]
```
