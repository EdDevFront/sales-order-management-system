# Orders Page Documentation

Lifecycle management for Sales Orders, scheduling operations, and details inspections.

## Components & Structure
- **New Order Button**: Opens `OrderForm` to create orders.
- **DataTable**: Lists orders, displaying Order ID, Customer, Status, Order Total, and Inspect button.
- **OrderDetailPanel**: Appears side-by-side when an order is selected, displaying customer data, transport type selectors (for mutable states), items breakdown, and status transition controls.
- **SchedulingModal**: Modal form to specify delivery date and windows (morning/afternoon/night) for planned orders.

## Flow Diagram
```mermaid
graph TD
    A[Orders Hub] --> B[DataTable Lists Orders]
    B --> C[Click New Order]
    C --> D[Render OrderForm Modal]
    D --> E[User Selects Customer, Transport & Items]
    E --> F[Submit Order -> Dispatch createOrderRequest -> Invalidate Query]
    B --> G[Click Inspect on Row]
    G --> H[Open OrderDetailPanel]
    H --> I{Is Order in CRIADA / PLANEJADA?}
    I -- Yes --> J[Enable Transport Type edit dropdown]
    I -- No --> K[Transport Type read-only]
    H --> L[Click Transition Status]
    L --> M[Dispatch updateStatusRequest]
    H --> N[Click Schedule / Reschedule]
    N --> O[Open SchedulingModal]
    O --> P[Submit Schedule Details -> Dispatch updateStatusRequest with scheduling payload]
```
