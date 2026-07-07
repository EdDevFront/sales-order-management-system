<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Coding Guidelines & Technical Constraints

All coding agents working on this project must strictly adhere to the following rules:

1. **Coding Style & Limits**:
   - Keep all functions under **20 lines** of code.
   - Keep all components under **200 lines** of code. If a component grows larger, break it down into subcomponents.
2. **Variable & Function Naming**:
   - Variables representing checks, conditions, or business rules must have highly descriptive and specific names (e.g., `isLegalPerson` or `isTransportTypeAuthorizedForCustomer` instead of generic names).
3. **Architecture Principles**:
   - Strictly follow **SOLID** design principles.
   - Adhere to **Domain-Driven Design (DDD)** practices. Segregate core business logic (Domain), data layers (Infrastructure), state workflows (Application), and components (Presentation).
4. **Language & Commits**:
   - All code, comments, variables, and documentation must be written in **English**.
   - Git commits must strictly follow **Conventional Commits** in English.
