# Customers Page Documentation

Profiles and logistics authorization management.

## Components & Structure
- **New Customer Button**: Toggles `CustomerForm` for creation.
- **CustomerForm**: Collapsible form for customer details (Name, Document Type, Document number, and multi-select tags of Authorized Transports).
- **DataTable**: Lists customers with details and Edit action button.

## Flow Diagram
```mermaid
graph TD
    A[Customers View] --> B[DataTable Lists Customers]
    B --> C[Click New Customer / Edit]
    C --> D[Open CustomerForm]
    D --> E[User enters name, doc, and selects transport badges]
    E --> F[Click Save -> Mutation trigger -> Invalidate customers query -> Close Form]
```
