# Items Page Documentation

Order inventory items configurations.

## Components & Structure
- **New Item Button**: Opens `ItemForm`.
- **ItemForm**: Collapsible form for item details (Name, SKU, Price).
- **DataTable**: Lists items.

## Flow Diagram
```mermaid
graph TD
    A[Items View] --> B[DataTable Lists Items]
    B --> C[Click New Item]
    C --> D[Open ItemForm]
    D --> E[User enters name, SKU, price]
    E --> F[Click Create -> Mutation trigger -> Invalidate items query -> Close Form]
```
