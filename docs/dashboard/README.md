# Dashboard Page Documentation

Operational monitoring dashboard containing metrics, active filter controls, and paginated Sales Orders table.

## Components & Structure
- **Metric Cards**: Total Sales Orders, Needs Scheduling (PLANEJADA), In Transit (EM_TRANSPORTE), and Delivered (ENTREGUE).
- **Filter Controls**: Select dropdowns for Status, Customer, Transport Mode, and DatePicker for Creation Date.
- **DataTable**: Lists orders filtered by the selection, showing Order ID, Customer, Transport Type, Delivery details, and Status.
- **Pagination Footer**: Default 8 items per page pagination controller.

## Flow Diagram
```mermaid
graph TD
    A[User visits Dashboard] --> B[React Query loads Orders, Customers, Transports]
    B --> C{Is loading?}
    C -- Yes --> D[Render Skeleton cards & Skeleton rows]
    C -- No --> E[Render Metrics & Filter controls]
    E --> F[User updates Filters]
    F --> G[Filter criteria updated in Redux Store]
    G --> H[Derive filteredOrders via useMemo]
    H --> I[Slice filteredOrders to paginatedOrders]
    I --> J{Are there matches?}
    J -- No and filters active --> K[Render Filtered-Empty State with Clear Filters button]
    J -- No and no filters active --> L[Render Empty State]
    J -- Yes --> M[Render DataTable rows + pagination controls]
    K -- Click Clear --> N[Reset Redux Filters & currentpage = 1]
    N --> G
```
