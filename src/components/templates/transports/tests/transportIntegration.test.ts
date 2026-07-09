import {
  saveTransportType,
  fetchTransportTypes,
} from "@/infrastructure/repositories/mockRepositories";
import { TransportType } from "@/types/TransportType";

// Mock localStorage
const store: Record<string, string> = {};
const mockStorage: Storage = {
  getItem: jest.fn((key: string) => store[key] ?? null),
  setItem: jest.fn((key: string, value: string) => {
    store[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete store[key];
  }),
  clear: jest.fn(() => {
    Object.keys(store).forEach((k) => delete store[k]);
  }),
  get length() {
    return Object.keys(store).length;
  },
  key: jest.fn((index: number) => Object.keys(store)[index] ?? null),
};
Object.defineProperty(global, "localStorage", {
  value: mockStorage,
  writable: true,
});

const SEED_TRANSPORTS: TransportType[] = [
  {
    id: "trans-1",
    name: "Caminhão",
    description: "Standard single unit truck",
  },
  { id: "trans-2", name: "Carreta", description: "Large semi-trailer" },
];
const SEED_DB = {
  customers: [],
  transportTypes: SEED_TRANSPORTS,
  items: [],
  salesOrders: [],
  auditLogs: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  store["ovgs_mock_db"] = JSON.stringify(SEED_DB);
});

describe("CT-INT-TRANS-01: saveTransportType creates new", () => {
  test("should add a new transport type", async () => {
    const newTransport: TransportType = {
      id: "trans-new",
      name: "Van",
      description: "Veículo leve para entregas urbanas",
    };
    await saveTransportType(newTransport);

    const all = await fetchTransportTypes();
    expect(all.length).toBe(3);
    expect(all.find((t) => t.id === "trans-new")?.name).toBe("Van");
  });
});

describe("CT-INT-TRANS-02: saveTransportType updates existing", () => {
  test("should update existing transport type by id", async () => {
    const updated: TransportType = {
      id: "trans-1",
      name: "Caminhão Baú",
      description: "Caminhão com carroceria fechada",
    };
    await saveTransportType(updated);

    const all = await fetchTransportTypes();
    expect(all.length).toBe(2); // same count
    expect(all.find((t) => t.id === "trans-1")?.name).toBe("Caminhão Baú");
  });
});

describe("CT-INT-TRANS-03: fetchTransportTypes returns all", () => {
  test("should return all transport types", async () => {
    const result = await fetchTransportTypes();
    expect(result.length).toBe(2);
    expect(result[0].name).toBe("Caminhão");
  });
});

describe("CT-INT-TRANS-04: Multiple transport types", () => {
  test("should handle multiple creates and updates", async () => {
    await saveTransportType({
      id: "trans-a",
      name: "Type A",
      description: "Desc A",
    });
    await saveTransportType({
      id: "trans-b",
      name: "Type B",
      description: "Desc B",
    });
    await saveTransportType({
      id: "trans-1",
      name: "Caminhão Updated",
      description: "Updated",
    });

    const all = await fetchTransportTypes();
    expect(all.length).toBe(4);
    expect(all.find((t) => t.id === "trans-1")?.name).toBe("Caminhão Updated");
  });
});
