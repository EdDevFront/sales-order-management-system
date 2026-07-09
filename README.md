# Portal de Gestão de Ordens de Venda (OVGS)

Implementação frontend do **Sistema de Gestão de Ordens de Venda (OVGS)**, desenvolvida como desafio técnico para Senior Frontend Developer.

Projeto construído com React/Next.js priorizando **Clean Code**, **SOLID**, **Domain-Driven Design (DDD)** e restrições de modularização (funções ≤ 20 linhas, componentes ≤ 200 linhas).

---

## 🚀 Instruções de Execução

### Servidor de Desenvolvimento Local

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Executar Testes

```bash
npm run test
```

### Build de Produção

```bash
npm run build
```

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Estado Global**: Redux Toolkit & Redux Saga
- **Cache de Dados**: React Query (TanStack Query)
- **Formulários**: React Hook Form + Zod
- **Ícones**: Lucide React
- **Testes**: Jest & React Testing Library (ts-jest)

---

## 🏛️ Arquitetura e Modelagem (DDD)

Estrutura do projeto seguindo **DDD** e **Clean Architecture**:

1. **Camada de Domínio** (`src/types/`):
   - Regras de negócio puras (`Customer`, `SalesOrder`, `Item`, `TransportType`, `AuditLog`).
   - Validação de transições de status (`isValidStatusTransition`) e autorização de transporte por cliente (`isTransportTypeAuthorizedForCustomer`).
2. **Camada de Infraestrutura** (`src/infrastructure/`):
   - Banco de dados simulado em memória com persistência em `localStorage` (`mockDatabase.ts`).
   - Repositórios com delay simulado (`mockRepositories.ts`) para emular requisições de rede.
3. **Camada de Aplicação** (`src/stores/`):
   - Redux slices para estado de UI (filtros, abas ativas) e notificações.
   - **Redux Saga** coordena operações transacionais multi-step (ex: atualizar pedido + registrar auditoria atomicamente).
4. **Camada de Apresentação** (`src/components/`):
   - Componentes React com composition pattern (`DataTable`, `DataTable.Head`, `DataTable.Body`).
   - Todos os componentes respeitam o limite de < 200 linhas.

---

## ⚙️ Persistência & Auditoria

- **Persistência**: Banco simulado via `localStorage`.
- **Audit Logs**: Qualquer modificação (criação, transição de status, agendamento, troca de transporte) é interceptada pelo **Redux Saga**, que captura os snapshots anterior/próximo estado, gera um registro de auditoria e persiste. O portal inclui painel de inspeção para visualizar os payloads lado a lado.

---

## 🧪 Testes

### Documentação de Testes

Cada domínio possui documentação de cenários em `docs/<page>/tests/`:

| Arquivo | Descrição |
| :--- | :--- |
| `e2e-test-cases.md` | Cenários de ponta a ponta com Pré-condições, Passos e Resultado Esperado |
| `unit-test-cases.md` | Testes unitários com Entrada e Saída Esperada |
| `integration-test-cases.md` | Testes de integração entre camadas |

### Cobertura de Testes

Os testes automatizados estão em `src/components/templates/<page>/tests/`:

- **14 suites de teste**, **123 testes** no total
- Testes unitários: schemas Zod, regras de domínio, formatação, funções utilitárias
- Testes de integração: sagas Redux, repositórios mock
- Testes de componente: Dashboard, Audit com Redux + React Query

---

## 🔄 Release Flow (CI/CD)

Versionamento automático via **Semantic Release** e GitHub Actions.

**⚠️ Versões são geradas SOMENTE quando o commit contém um dos marcadores:**

| Marcador | Versão |
| :--- | :--- |
| `[FEATURE]` | **Minor** (v1.0.0 → v1.1.0) |
| `[PATCH]` | **Patch** (v1.0.0 → v1.0.1) |
| `[BREAKING]` | **Major** (v1.0.0 → v2.0.0) |
| _(nenhum)_ | _Nenhuma versão gerada_ |

Exemplos:
- `feat: [FEATURE] add customer export` → ✅ Minor
- `fix: [PATCH] resolve pagination bug` → ✅ Patch
- `docs: update readme` → ❌ sem release

## 📈 Escalabilidade & Trade-offs

- **Separação de Estado**: Estado de UI (Redux) separado de dados cacheados (React Query).
- **Micro-animações**: Hover transforms, indicadores de aba ativa, toast com bounce.
- **Trade-offs**: localStorage para prototipação rápida; em produção seria substituído por API REST.

1. **Quality** — lint, test, build
2. **Release** — generate changelog, bump version, create Git tag, publish GitHub Release
