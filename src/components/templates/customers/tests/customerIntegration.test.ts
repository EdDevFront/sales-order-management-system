import { saveCustomer, fetchCustomers } from "@/infrastructure/repositories/mockRepositories";
import { Customer } from "@/types/Customer";

// Mock localStorage
const store: Record<string, string> = {};
const mockStorage: Storage = {
  getItem: jest.fn((key: string) => store[key] ?? null),
  setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: jest.fn((key: string) => { delete store[key]; }),
  clear: jest.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
  get length() { return Object.keys(store).length; },
  key: jest.fn((index: number) => Object.keys(store)[index] ?? null),
};
Object.defineProperty(global, "localStorage", { value: mockStorage, writable: true });

// Seed data (same as DEFAULT in mockDatabase)
const SEED_CUSTOMERS: Customer[] = [
  { id: "cust-1", name: "Acme Logistics SA", document: "12.345.678/0001-97", documentType: "CNPJ", authorizedTransportTypeIds: ["trans-1", "trans-2"] },
  { id: "cust-2", name: "John Doe Distribution", document: "012.345.678-90", documentType: "CPF", authorizedTransportTypeIds: ["trans-1"] },
  { id: "cust-3", name: "Global Freight Ltda", document: "45.678.901/0001-75", documentType: "CNPJ", authorizedTransportTypeIds: ["trans-2", "trans-3"] },
];
const SEED_TRANSPORTS = [
  { id: "trans-1", name: "Caminhão", description: "Truck" },
  { id: "trans-2", name: "Carreta", description: "Semi-trailer" },
  { id: "trans-3", name: "Bi-truck", description: "Double axle" },
];
const SEED_ITEMS = [{ id: "item-1", name: "Engine Part", sku: "HD-ENG-001", price: 1500 }];
const SEED_DB = { customers: SEED_CUSTOMERS, transportTypes: SEED_TRANSPORTS, items: SEED_ITEMS, salesOrders: [], auditLogs: [] };

beforeEach(() => {
  jest.clearAllMocks();
  store["ovgs_mock_db"] = JSON.stringify(SEED_DB);
});

describe("CT-INT-CUST-01: saveCustomer creates new customer", () => {
  test("should add a new customer to the database", async () => {
    const newCustomer: Customer = {
      id: "cust-new",
      name: "Transportadora Beta Ltda",
      document: "11.222.333/0001-81",
      documentType: "CNPJ",
      authorizedTransportTypeIds: ["trans-1"],
    };
    const result = await saveCustomer(newCustomer);
    expect(result.id).toBe("cust-new");

    const all = await fetchCustomers();
    expect(all.length).toBe(4);
    expect(all.find((c) => c.id === "cust-new")?.name).toBe("Transportadora Beta Ltda");
  });
});

describe("CT-INT-CUST-02: saveCustomer updates existing customer", () => {
  test("should update an existing customer in the database", async () => {
    const updated: Customer = { ...SEED_CUSTOMERS[0], name: "Acme Atualizada" };
    await saveCustomer(updated);

    const all = await fetchCustomers();
    expect(all.length).toBe(3);
    expect(all.find((c) => c.id === "cust-1")?.name).toBe("Acme Atualizada");
  });
});

describe("CT-INT-CUST-03: fetchCustomers returns all", () => {
  test("should return all customers from database", async () => {
    const result = await fetchCustomers();
    expect(result.length).toBe(3);
    expect(result[0].name).toBe("Acme Logistics SA");
  });
});

describe("CT-INT-CUST-04: saveCustomer with authorized transports", () => {
  test("should persist authorizedTransportTypeIds", async () => {
    const customer: Customer = {
      id: "cust-trans-test",
      name: "Transporte Teste",
      document: "12.345.678/0001-97",
      documentType: "CNPJ",
      authorizedTransportTypeIds: ["trans-1", "trans-3"],
    };
    await saveCustomer(customer);

    const all = await fetchCustomers();
    const saved = all.find((c) => c.id === "cust-trans-test");
    expect(saved?.authorizedTransportTypeIds).toEqual(["trans-1", "trans-3"]);
  });
});
