# Documentação da Página de Itens

Configurações de itens do inventário de mercadorias.

## Componentes e Estrutura
- **Botão de Novo Item**: Abre o `ItemForm`.
- **ItemForm**: Formulário retrátil para detalhes do item (Nome, SKU, Preço).
- **DataTable**: Lista itens.

## Diagrama de Fluxo
```mermaid
graph TD
    A[Visualização de Itens] --> B[DataTable Lista Itens]
    B --> C[Clique em Novo Item]
    C --> D[Abre ItemForm]
    D --> E[Usuário insere nome, SKU, preço]
    E --> F[Clique em Criar -> Dispara Mutação -> Invalida query de itens -> Fecha Formulário]
```
