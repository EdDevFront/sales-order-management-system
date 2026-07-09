import { runSaga } from "redux-saga";
import {
  updateStatusWorker,
  createOrderWorker,
  updateDeliveryWorker,
  updateTransportWorker,
} from "./orderSaga";
import * as actions from "../ordersActions";
import * as mockDb from "@/infrastructure/mock/mockDatabase";
import { SalesOrder } from "@/types/SalesOrder";

jest.mock("@/infrastructure/mock/mockDatabase", () => ({
  loadDatabase: jest.fn(),
  saveDatabase: jest.fn(),
}));

type MockDb = ReturnType<typeof mockDb.loadDatabase>;

function makeMockDb(overrides: Partial<MockDb> = {}): MockDb {
  return {
    customers: [],
    transportTypes: [],
    items: [],
    salesOrders: [],
    auditLogs: [],
    ...overrides,
  };
}

const sampleOrder: SalesOrder = {
  id: "so-1",
  customerId: "cust-1",
  transportTypeId: "trans-1",
  items: [{ itemId: "item-1", quantity: 2 }],
  status: "CRIADA",
  createdAt: new Date().toISOString(),
};

// ─── Create Order ─────────────────────────────────────────────────────────────

describe("Saga - createOrderWorker", () => {
  let dispatched: unknown[];

  beforeEach(() => {
    dispatched = [];
    jest.clearAllMocks();
  });

  test("should create order and record CREATE_ORDER audit log", async () => {
    const db = makeMockDb({
      customers: [
        {
          id: "cust-1",
          name: "Acme",
          document: "12.345.678/0001-97",
          documentType: "CNPJ",
          authorizedTransportTypeIds: ["trans-1"],
        },
      ],
    });
    (mockDb.loadDatabase as jest.Mock).mockReturnValue(db);

    await runSaga(
      { dispatch: (a) => dispatched.push(a), getState: () => ({}) },
      createOrderWorker,
      actions.createOrderRequest({
        customerId: "cust-1",
        transportTypeId: "trans-1",
        items: [{ itemId: "item-1", quantity: 2 }],
      }),
    ).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({
        type: actions.createOrderSuccess.type,
        payload: expect.objectContaining({
          customerId: "cust-1",
          transportTypeId: "trans-1",
          status: "CRIADA",
        }),
      }),
    );

    expect(mockDb.saveDatabase).toHaveBeenCalledWith(
      expect.objectContaining({
        auditLogs: expect.arrayContaining([
          expect.objectContaining({
            actionType: "CREATE_ORDER",
            entityAffected: "SALES_ORDER",
          }),
        ]),
      }),
    );
  });

  test("should fail when transport is not authorized for customer", async () => {
    const db = makeMockDb({
      customers: [
        {
          id: "cust-1",
          name: "Acme",
          document: "12.345.678/0001-97",
          documentType: "CNPJ",
          authorizedTransportTypeIds: ["trans-1"], // only trans-1
        },
      ],
    });
    (mockDb.loadDatabase as jest.Mock).mockReturnValue(db);

    await runSaga(
      { dispatch: (a) => dispatched.push(a), getState: () => ({}) },
      createOrderWorker,
      actions.createOrderRequest({
        customerId: "cust-1",
        transportTypeId: "trans-99", // not authorized
        items: [{ itemId: "item-1", quantity: 1 }],
      }),
    ).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({
        type: actions.createOrderFailure.type,
        payload: expect.stringContaining("not authorized"),
      }),
    );
  });

  test("should fail when customer does not exist", async () => {
    const db = makeMockDb({ customers: [] });
    (mockDb.loadDatabase as jest.Mock).mockReturnValue(db);

    await runSaga(
      { dispatch: (a) => dispatched.push(a), getState: () => ({}) },
      createOrderWorker,
      actions.createOrderRequest({
        customerId: "cust-nonexistent",
        transportTypeId: "trans-1",
        items: [{ itemId: "item-1", quantity: 1 }],
      }),
    ).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({ type: actions.createOrderFailure.type }),
    );
  });
});

// ─── Update Status ────────────────────────────────────────────────────────────

describe("Saga - updateStatusWorker", () => {
  let dispatched: unknown[];

  beforeEach(() => {
    dispatched = [];
    jest.clearAllMocks();
  });

  test("should transition CRIADA → PLANEJADA and record audit", async () => {
    const db = makeMockDb({ salesOrders: [sampleOrder] });
    (mockDb.loadDatabase as jest.Mock).mockReturnValue(db);

    await runSaga(
      { dispatch: (a) => dispatched.push(a), getState: () => ({}) },
      updateStatusWorker,
      actions.updateStatusRequest({ orderId: "so-1", newStatus: "PLANEJADA" }),
    ).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({
        type: actions.updateStatusSuccess.type,
        payload: expect.objectContaining({ id: "so-1", status: "PLANEJADA" }),
      }),
    );

    expect(dispatched).toContainEqual(
      expect.objectContaining({ type: actions.refreshOrders.type }),
    );

    expect(mockDb.saveDatabase).toHaveBeenCalledWith(
      expect.objectContaining({
        auditLogs: expect.arrayContaining([
          expect.objectContaining({
            actionType: "UPDATE_STATUS",
            entityId: "so-1",
          }),
        ]),
      }),
    );
  });

  test("should transition PLANEJADA → AGENDADA", async () => {
    const db = makeMockDb({
      salesOrders: [{ ...sampleOrder, status: "PLANEJADA" }],
    });
    (mockDb.loadDatabase as jest.Mock).mockReturnValue(db);

    await runSaga(
      { dispatch: (a) => dispatched.push(a), getState: () => ({}) },
      updateStatusWorker,
      actions.updateStatusRequest({ orderId: "so-1", newStatus: "AGENDADA" }),
    ).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({
        type: actions.updateStatusSuccess.type,
        payload: expect.objectContaining({ status: "AGENDADA" }),
      }),
    );
  });

  test("should fail on invalid transition (CRIADA → AGENDADA)", async () => {
    const db = makeMockDb({ salesOrders: [sampleOrder] });
    (mockDb.loadDatabase as jest.Mock).mockReturnValue(db);

    await runSaga(
      { dispatch: (a) => dispatched.push(a), getState: () => ({}) },
      updateStatusWorker,
      actions.updateStatusRequest({ orderId: "so-1", newStatus: "AGENDADA" }),
    ).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({
        type: actions.updateStatusFailure.type,
        payload: expect.stringContaining("Invalid status transition"),
      }),
    );
  });

  test("should fail when order not found", async () => {
    const db = makeMockDb({ salesOrders: [] });
    (mockDb.loadDatabase as jest.Mock).mockReturnValue(db);

    await runSaga(
      { dispatch: (a) => dispatched.push(a), getState: () => ({}) },
      updateStatusWorker,
      actions.updateStatusRequest({
        orderId: "so-nonexistent",
        newStatus: "PLANEJADA",
      }),
    ).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({
        type: actions.updateStatusFailure.type,
        payload: "Order not found",
      }),
    );
  });

  test("should fail transition from ENTREGUE (terminal)", async () => {
    const db = makeMockDb({
      salesOrders: [{ ...sampleOrder, status: "ENTREGUE" }],
    });
    (mockDb.loadDatabase as jest.Mock).mockReturnValue(db);

    await runSaga(
      { dispatch: (a) => dispatched.push(a), getState: () => ({}) },
      updateStatusWorker,
      actions.updateStatusRequest({
        orderId: "so-1",
        newStatus: "CRIADA",
      }),
    ).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({ type: actions.updateStatusFailure.type }),
    );
  });
});

// ─── Update Delivery ──────────────────────────────────────────────────────────

describe("Saga - updateDeliveryWorker", () => {
  let dispatched: unknown[];

  beforeEach(() => {
    dispatched = [];
    jest.clearAllMocks();
  });

  test("should set delivery data and transition PLANEJADA → AGENDADA", async () => {
    const db = makeMockDb({
      salesOrders: [{ ...sampleOrder, status: "PLANEJADA" }],
    });
    (mockDb.loadDatabase as jest.Mock).mockReturnValue(db);

    await runSaga(
      { dispatch: (a) => dispatched.push(a), getState: () => ({}) },
      updateDeliveryWorker,
      actions.updateDeliveryRequest({
        orderId: "so-1",
        deliveryDate: "2026-07-15",
        deliveryWindow: "Manhã (08:00 - 12:00)",
      }),
    ).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({
        type: actions.updateDeliverySuccess.type,
        payload: expect.objectContaining({
          id: "so-1",
          status: "AGENDADA",
          deliveryDate: "2026-07-15",
          deliveryWindow: "Manhã (08:00 - 12:00)",
        }),
      }),
    );

    expect(mockDb.saveDatabase).toHaveBeenCalledWith(
      expect.objectContaining({
        auditLogs: expect.arrayContaining([
          expect.objectContaining({
            actionType: "UPDATE_DELIVERY",
            entityId: "so-1",
          }),
        ]),
      }),
    );
  });

  test("should update delivery without changing status if not PLANEJADA", async () => {
    const db = makeMockDb({
      salesOrders: [
        {
          ...sampleOrder,
          status: "AGENDADA",
          deliveryDate: "2026-07-10",
          deliveryWindow: "Manhã (08:00 - 12:00)",
        },
      ],
    });
    (mockDb.loadDatabase as jest.Mock).mockReturnValue(db);

    await runSaga(
      { dispatch: (a) => dispatched.push(a), getState: () => ({}) },
      updateDeliveryWorker,
      actions.updateDeliveryRequest({
        orderId: "so-1",
        deliveryDate: "2026-07-20",
        deliveryWindow: "Tarde (13:00 - 18:00)",
      }),
    ).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({
        type: actions.updateDeliverySuccess.type,
        payload: expect.objectContaining({
          status: "AGENDADA", // status unchanged
          deliveryDate: "2026-07-20",
        }),
      }),
    );
  });

  test("should fail when order not found", async () => {
    const db = makeMockDb({ salesOrders: [] });
    (mockDb.loadDatabase as jest.Mock).mockReturnValue(db);

    await runSaga(
      { dispatch: (a) => dispatched.push(a), getState: () => ({}) },
      updateDeliveryWorker,
      actions.updateDeliveryRequest({
        orderId: "so-nonexistent",
        deliveryDate: "2026-07-15",
        deliveryWindow: "Manhã (08:00 - 12:00)",
      }),
    ).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({
        type: actions.updateDeliveryFailure.type,
        payload: "Order not found",
      }),
    );
  });
});

// ─── Update Transport ─────────────────────────────────────────────────────────

describe("Saga - updateTransportWorker", () => {
  let dispatched: unknown[];

  beforeEach(() => {
    dispatched = [];
    jest.clearAllMocks();
  });

  test("should update transport type and record audit", async () => {
    const db = makeMockDb({
      customers: [
        {
          id: "cust-1",
          name: "Acme",
          document: "12.345.678/0001-97",
          documentType: "CNPJ",
          authorizedTransportTypeIds: ["trans-1", "trans-2"],
        },
      ],
      salesOrders: [sampleOrder],
    });
    (mockDb.loadDatabase as jest.Mock).mockReturnValue(db);

    await runSaga(
      { dispatch: (a) => dispatched.push(a), getState: () => ({}) },
      updateTransportWorker,
      actions.updateTransportRequest({
        orderId: "so-1",
        transportTypeId: "trans-2",
      }),
    ).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({
        type: actions.updateTransportSuccess.type,
        payload: expect.objectContaining({
          id: "so-1",
          transportTypeId: "trans-2",
        }),
      }),
    );

    expect(mockDb.saveDatabase).toHaveBeenCalledWith(
      expect.objectContaining({
        auditLogs: expect.arrayContaining([
          expect.objectContaining({
            actionType: "UPDATE_TRANSPORT",
            entityId: "so-1",
          }),
        ]),
      }),
    );
  });

  test("should fail when new transport is not authorized for customer", async () => {
    const db = makeMockDb({
      customers: [
        {
          id: "cust-1",
          name: "Acme",
          document: "12.345.678/0001-97",
          documentType: "CNPJ",
          authorizedTransportTypeIds: ["trans-1"], // only trans-1
        },
      ],
      salesOrders: [sampleOrder],
    });
    (mockDb.loadDatabase as jest.Mock).mockReturnValue(db);

    await runSaga(
      { dispatch: (a) => dispatched.push(a), getState: () => ({}) },
      updateTransportWorker,
      actions.updateTransportRequest({
        orderId: "so-1",
        transportTypeId: "trans-99",
      }),
    ).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({
        type: actions.updateTransportFailure.type,
        payload: expect.stringContaining("not authorized"),
      }),
    );
  });

  test("should fail when order not found", async () => {
    const db = makeMockDb({ salesOrders: [] });
    (mockDb.loadDatabase as jest.Mock).mockReturnValue(db);

    await runSaga(
      { dispatch: (a) => dispatched.push(a), getState: () => ({}) },
      updateTransportWorker,
      actions.updateTransportRequest({
        orderId: "so-nonexistent",
        transportTypeId: "trans-1",
      }),
    ).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({
        type: actions.updateTransportFailure.type,
        payload: "Order not found",
      }),
    );
  });

  test("should fail when customer not found for the order", async () => {
    const db = makeMockDb({
      customers: [], // no customers
      salesOrders: [sampleOrder], // order references cust-1
    });
    (mockDb.loadDatabase as jest.Mock).mockReturnValue(db);

    await runSaga(
      { dispatch: (a) => dispatched.push(a), getState: () => ({}) },
      updateTransportWorker,
      actions.updateTransportRequest({
        orderId: "so-1",
        transportTypeId: "trans-1",
      }),
    ).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({
        type: actions.updateTransportFailure.type,
        payload: expect.stringContaining("not authorized"),
      }),
    );
  });
});
