import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuditLogs from "../index";
import { AuditLog } from "@/types/AuditLog";

jest.mock("@/infrastructure/repositories/mockRepositories", () => ({
  fetchAuditLogs: jest.fn(),
}));

const mockRepos = jest.requireMock<typeof import("@/infrastructure/repositories/mockRepositories")>("@/infrastructure/repositories/mockRepositories");

Object.assign(navigator, { clipboard: { writeText: jest.fn() } });

// Only 5 logs to avoid pagination and keep tests fast
const logs: AuditLog[] = [
  { id: "a1", timestamp: "2026-07-08T14:00:00.000Z", actionType: "CREATE_ORDER", entityAffected: "SALES_ORDER", entityId: "so-1", nextState: JSON.stringify({ id: "so-1" }) },
  { id: "a2", timestamp: "2026-07-08T15:00:00.000Z", actionType: "UPDATE_STATUS", entityAffected: "SALES_ORDER", entityId: "so-1", previousState: JSON.stringify({ status: "CRIADA" }), nextState: JSON.stringify({ status: "PLANEJADA" }) },
  { id: "a3", timestamp: "2026-07-08T16:00:00.000Z", actionType: "UPDATE_DELIVERY", entityAffected: "SALES_ORDER", entityId: "so-1", previousState: JSON.stringify({ status: "PLANEJADA" }), nextState: JSON.stringify({ status: "AGENDADA", deliveryDate: "2026-07-15" }) },
  { id: "a4", timestamp: "2026-07-08T17:00:00.000Z", actionType: "UPDATE_TRANSPORT", entityAffected: "SALES_ORDER", entityId: "so-1", previousState: JSON.stringify({ transportTypeId: "trans-1" }), nextState: JSON.stringify({ transportTypeId: "trans-2" }) },
  { id: "a5", timestamp: "2026-07-08T18:00:00.000Z", actionType: "CREATE_ORDER", entityAffected: "SALES_ORDER", entityId: "so-2", nextState: JSON.stringify({ id: "so-2" }) },
];

function renderAudit() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(<QueryClientProvider client={qc}><AuditLogs /></QueryClientProvider>);
}

describe("Audit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRepos.fetchAuditLogs.mockResolvedValue(logs);
  });

  it("CT-AUD-01: renders CREATE_ORDER badge", async () => {
    renderAudit();
    await waitFor(() => expect(screen.getAllByText("CREATE_ORDER").length).toBeGreaterThanOrEqual(1), { timeout: 5000 });
  });

  it("CT-AUD-02: renders UPDATE_STATUS badge", async () => {
    renderAudit();
    await waitFor(() => expect(screen.getAllByText("UPDATE_STATUS").length).toBeGreaterThanOrEqual(1), { timeout: 5000 });
  });

  it("CT-AUD-03: renders UPDATE_DELIVERY badge", async () => {
    renderAudit();
    await waitFor(() => expect(screen.getByText("UPDATE_DELIVERY")).toBeInTheDocument(), { timeout: 5000 });
  });

  it("CT-AUD-04: renders UPDATE_TRANSPORT badge", async () => {
    renderAudit();
    await waitFor(() => expect(screen.getByText("UPDATE_TRANSPORT")).toBeInTheDocument(), { timeout: 5000 });
  });

  it("CT-AUD-05: expands row on Inspecionar click", async () => {
    renderAudit();
    await waitFor(() => expect(screen.getByText("UPDATE_TRANSPORT")).toBeInTheDocument(), { timeout: 5000 });
    fireEvent.click(screen.getAllByText("Inspecionar")[0]);
    await waitFor(() => expect(screen.getByText("Estado Anterior")).toBeInTheDocument());
  });

  it("CT-AUD-06: collapses row on Ocultar click", async () => {
    renderAudit();
    await waitFor(() => expect(screen.getByText("UPDATE_TRANSPORT")).toBeInTheDocument(), { timeout: 5000 });
    fireEvent.click(screen.getAllByText("Inspecionar")[0]);
    await waitFor(() => expect(screen.getByText("Ocultar")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Ocultar"));
    await waitFor(() => expect(screen.queryByText("Estado Anterior")).not.toBeInTheDocument());
  });

  it("CT-AUD-07: copies JSON to clipboard", async () => {
    renderAudit();
    await waitFor(() => expect(screen.getByText("UPDATE_TRANSPORT")).toBeInTheDocument(), { timeout: 5000 });
    fireEvent.click(screen.getAllByText("Inspecionar")[1]); // a2 has previousState
    await waitFor(() => expect(screen.getAllByText("Copiar").length).toBeGreaterThanOrEqual(1));
    fireEvent.click(screen.getAllByText("Copiar")[0]);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it("CT-AUD-08: shows NULL for CREATE_ORDER previousState", async () => {
    mockRepos.fetchAuditLogs.mockResolvedValue([logs[0]]);
    renderAudit();
    await waitFor(() => expect(screen.getByText("CREATE_ORDER")).toBeInTheDocument(), { timeout: 5000 });
    fireEvent.click(screen.getByText("Inspecionar"));
    await waitFor(() => expect(screen.getAllByText("NULL").length).toBeGreaterThanOrEqual(1));
  });

  it("CT-AUD-10: badges have border class", async () => {
    renderAudit();
    await waitFor(() => expect(screen.getAllByText("CREATE_ORDER").length).toBeGreaterThanOrEqual(1), { timeout: 5000 });
    expect(screen.getAllByText("CREATE_ORDER")[0].className).toContain("border");
  });

  it("CT-AUD-13: only one row expanded at a time", async () => {
    renderAudit();
    await waitFor(() => expect(screen.getByText("UPDATE_TRANSPORT")).toBeInTheDocument(), { timeout: 5000 });
    const btns = screen.getAllByText("Inspecionar");
    fireEvent.click(btns[0]);
    await waitFor(() => expect(screen.getByText("Ocultar")).toBeInTheDocument());
    fireEvent.click(btns[1]);
    await waitFor(() => {
      expect(screen.getAllByText("Ocultar").length).toBe(1);
    });
  });
});
