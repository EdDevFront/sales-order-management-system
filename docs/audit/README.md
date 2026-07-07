# Audit Page Documentation

System Audit Trail log viewer.

## Components & Structure
- **DataTable**: Lists logs, displaying Timestamp, Action Type, Entity Affected, ID, and Details inspection action.
- **Inspect Action**: Toggles an expandable row beneath the entry, rendering raw `previousState` and `nextState` JSON payloads side-by-side.

## Flow Diagram
```mermaid
graph TD
    A[Audit Trail View] --> B[DataTable Lists Audit Logs]
    B --> C[Click Inspect on Log entry]
    C --> D{Is Expanded?}
    D -- No --> E[Open expandable row details pane]
    E --> F[Parse previousState & nextState JSONs]
    F --> G[Render JSON pre blocks side-by-side]
    D -- Yes --> H[Close expandable row details pane]
```
