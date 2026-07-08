import { runSaga } from "redux-saga";
import { updateStatusWorker } from "./orderSaga";
import * as actions from "../ordersActions";
import * as mockDb from "@/infrastructure/mock/mockDatabase";

jest.mock("@/infrastructure/mock/mockDatabase", () => ({
  loadDatabase: jest.fn(),
  saveDatabase: jest.fn(),
}));

describe("Saga Integration Flow - Sales Order Status Transitions", () => {
  let mockDatabaseState: ReturnType<typeof mockDb.loadDatabase>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDatabaseState = {
      customers: [],
      transportTypes: [],
      items: [],
      salesOrders: [
        {
          id: "so-1",
          customerId: "cust-1",
          transportTypeId: "trans-1",
          items: [],
          status: "CRIADA",
          createdAt: new Date().toISOString(),
        },
      ],
      auditLogs: [],
    };
    (mockDb.loadDatabase as jest.Mock).mockReturnValue(mockDatabaseState);
  });

  test("should transition status from CRIADA to PLANEJADA and record audit log", async () => {
    const dispatchedActions: unknown[] = [];
    const action = actions.updateStatusRequest({
      orderId: "so-1",
      newStatus: "PLANEJADA",
    });

    await runSaga(
      {
        dispatch: (act) => dispatchedActions.push(act),
        getState: () => ({}),
      },
      updateStatusWorker,
      action,
    ).toPromise();

    // Verify success actions dispatched
    expect(dispatchedActions).toContainEqual(
      expect.objectContaining({
        type: actions.updateStatusSuccess.type,
        payload: expect.objectContaining({
          id: "so-1",
          status: "PLANEJADA",
        }),
      }),
    );

    expect(dispatchedActions).toContainEqual(
      expect.objectContaining({
        type: actions.refreshOrders.type,
      }),
    );

    // Verify mock database was updated and saved
    expect(mockDb.saveDatabase).toHaveBeenCalledWith(
      expect.objectContaining({
        salesOrders: expect.arrayContaining([
          expect.objectContaining({
            id: "so-1",
            status: "PLANEJADA",
          }),
        ]),
        auditLogs: expect.arrayContaining([
          expect.objectContaining({
            actionType: "UPDATE_STATUS",
            entityId: "so-1",
          }),
        ]),
      }),
    );
  });
});
