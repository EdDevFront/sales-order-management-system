import {
  saveItem,
  fetchItems,
} from "@/infrastructure/repositories/mockRepositories";
import { Item } from "@/types/Item";

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

const SEED_ITEMS: Item[] = [
  {
    id: "item-1",
    name: "Heavy Duty Engine Part",
    sku: "HD-ENG-001",
    price: 1500.0,
  },
  {
    id: "item-2",
    name: "Steel Support Beam 6m",
    sku: "STL-BEAM-6M",
    price: 450.0,
  },
];
const SEED_DB = {
  customers: [],
  transportTypes: [],
  items: SEED_ITEMS,
  salesOrders: [],
  auditLogs: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  store["ovgs_mock_db"] = JSON.stringify(SEED_DB);
});

describe("CT-INT-ITEM-01: saveItem adds new item", () => {
  test("should add a new item to the database", async () => {
    const newItem: Item = {
      id: "item-new",
      name: "Motor Diesel V8",
      sku: "MTR-DSL-V8",
      price: 2500,
    };
    await saveItem(newItem);

    const all = await fetchItems();
    expect(all.length).toBe(3);
    expect(all.find((i) => i.id === "item-new")?.name).toBe("Motor Diesel V8");
  });
});

describe("CT-INT-ITEM-02: fetchItems returns all items", () => {
  test("should return all items from database", async () => {
    const result = await fetchItems();
    expect(result.length).toBe(2);
    expect(result[0].sku).toBe("HD-ENG-001");
  });
});

describe("CT-INT-ITEM-03: saveItem persists price correctly", () => {
  test("should preserve price value", async () => {
    const newItem: Item = {
      id: "item-price",
      name: "Item Preço",
      sku: "PRC-001",
      price: 99.99,
    };
    await saveItem(newItem);

    const all = await fetchItems();
    const saved = all.find((i) => i.id === "item-price");
    expect(saved?.price).toBe(99.99);
  });
});

describe("CT-INT-ITEM-04: Multiple saves accumulate", () => {
  test("should add multiple items sequentially", async () => {
    await saveItem({ id: "item-a", name: "A", sku: "SKU-A", price: 10 });
    await saveItem({ id: "item-b", name: "B", sku: "SKU-B", price: 20 });
    await saveItem({ id: "item-c", name: "C", sku: "SKU-C", price: 30 });

    const all = await fetchItems();
    expect(all.length).toBe(5);
  });
});
