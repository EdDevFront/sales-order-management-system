import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import uiReducer from "@/stores/uiSlice";
import ordersReducer from "@/stores/ordersSlice";
import Dashboard from "../index";

jest.mock("@/infrastructure/repositories/mockRepositories", () => ({
  fetchSalesOrders: jest.fn(),
  fetchCustomers: jest.fn(),
  fetchTransportTypes: jest.fn(),
}));

const mockRepos = jest.requireMock<typeof import("@/infrastructure/repositories/mockRepositories")>("@/infrastructure/repositories/mockRepositories");

const mockOrders = [
  { id: "so-1", customerId: "cust-1", transportTypeId: "trans-1", items: [{ itemId: "item-1", quantity: 2 }], status: "CRIADA" as const, createdAt: "2026-07-01T10:00:00.000Z" },
  { id: "so-2", customerId: "cust-2", transportTypeId: "trans-1", items: [{ itemId: "item-2", quantity: 1 }], status: "PLANEJADA" as const, createdAt: "2026-07-02T10:00:00.000Z" },
  { id: "so-3", customerId: "cust-1", transportTypeId: "trans-2", items: [{ itemId: "item-3", quantity: 5 }], status: "EM_TRANSPORTE" as const, createdAt: "2026-07-03T10:00:00.000Z" },
  { id: "so-4", customerId: "cust-3", transportTypeId: "trans-3", items: [{ itemId: "item-1", quantity: 1 }], status: "ENTREGUE" as const, createdAt: "2026-07-04T10:00:00.000Z" },
];

const mockCustomers = [
  { id: "cust-1", name: "Acme SA", document: "12.345.678/0001-97", documentType: "CNPJ" as const, authorizedTransportTypeIds: ["trans-1", "trans-2"] },
  { id: "cust-2", name: "John Doe", document: "012.345.678-90", documentType: "CPF" as const, authorizedTransportTypeIds: ["trans-1"] },
  { id: "cust-3", name: "Global Freight", document: "45.678.901/0001-75", documentType: "CNPJ" as const, authorizedTransportTypeIds: ["trans-2", "trans-3"] },
];

const mockTransports = [
  { id: "trans-1", name: "Caminhão", description: "Truck" },
  { id: "trans-2", name: "Carreta", description: "Semi-trailer" },
  { id: "trans-3", name: "Bi-truck", description: "Double axle" },
];

function createTestStore(preloadedFilters?: Record<string, string>) {
  return configureStore({
    reducer: { ui: uiReducer, orders: ordersReducer },
    preloadedState: {
      ui: { activeTab: "dashboard", selectedOrderId: null, filters: { status: "ALL", clientId: "ALL", transportType: "ALL", date: "", ...preloadedFilters } },
      orders: { loading: false, error: null, successMessage: null },
    },
  });
}

function renderComponent(store: ReturnType<typeof createTestStore>) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(<Provider store={store}><QueryClientProvider client={qc}><Dashboard /></QueryClientProvider></Provider>);
}

describe("Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRepos.fetchSalesOrders.mockResolvedValue(mockOrders);
    mockRepos.fetchCustomers.mockResolvedValue(mockCustomers);
    mockRepos.fetchTransportTypes.mockResolvedValue(mockTransports);
  });

  it("CT-DASH-01: renders 4 metric cards with correct values", async () => {
    renderComponent(createTestStore());
    await waitFor(() => expect(screen.getByText("4")).toBeInTheDocument(), { timeout: 5000 });
    expect(screen.getByText("Total de Pedidos")).toBeInTheDocument();
    expect(screen.getByText("Requer Agendamento")).toBeInTheDocument();
    expect(screen.getAllByText("Em Transporte")[0]).toBeInTheDocument();
    expect(screen.getByText("Entregues")).toBeInTheDocument();
  });

  it("CT-DASH-02: filters orders by status and client", async () => {
    renderComponent(createTestStore({ status: "CRIADA", clientId: "cust-1" }));
    await waitFor(() => expect(screen.getByText("so-1")).toBeInTheDocument(), { timeout: 5000 });
    expect(screen.queryByText("so-2")).not.toBeInTheDocument();
    expect(screen.queryByText("so-3")).not.toBeInTheDocument();
    expect(screen.queryByText("so-4")).not.toBeInTheDocument();
  });

  it("CT-DASH-03: shows clear filters button when filters active", async () => {
    renderComponent(createTestStore({ status: "CRIADA" }));
    await waitFor(() => expect(screen.getByText("Limpar filtros")).toBeInTheDocument(), { timeout: 5000 });
  });

  it("CT-DASH-06: shows empty state when no orders", async () => {
    mockRepos.fetchSalesOrders.mockResolvedValue([]);
    renderComponent(createTestStore());
    expect(await screen.findByText("Nenhum registro encontrado.", {}, { timeout: 5000 })).toBeInTheDocument();
  });

  it("CT-DASH-07: shows filtered empty state", async () => {
    renderComponent(createTestStore({ status: "ENTREGUE", clientId: "cust-2" }));
    await waitFor(() => expect(screen.getByText("Nenhum resultado corresponde aos filtros ativos.")).toBeInTheDocument(), { timeout: 5000 });
  });

  it("CT-DASH-08: renders Apply Filters button", async () => {
    const store = createTestStore();
    renderComponent(store);
    await waitFor(() => expect(screen.getByText("4")).toBeInTheDocument(), { timeout: 5000 });
    expect(screen.getByText("Aplicar Filtros")).toBeInTheDocument();
  });

  it("CT-DASH-09: shows skeletons while loading", () => {
    mockRepos.fetchSalesOrders.mockReturnValue(new Promise(() => {}));
    renderComponent(createTestStore());
    expect(document.querySelectorAll('[class*="animate-pulse"]').length).toBeGreaterThan(0);
  });
});
