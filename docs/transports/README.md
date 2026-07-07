# Transports Page Documentation

Logistics transport mode configurations.

## Components & Structure
- **New Transport Type Button**: Opens `TransportForm`.
- **TransportForm**: Collapsible form for details (Name, Description).
- **DataTable**: Lists transport modes with Edit action.

## Flow Diagram
```mermaid
graph TD
    A[Transports View] --> B[DataTable Lists Transport Modes]
    B --> C[Click New Transport Type / Edit]
    C --> D[Open TransportForm]
    D --> E[User enters name and description]
    E --> F[Click Save -> Mutation trigger -> Invalidate transports/customers query -> Close Form]
```
