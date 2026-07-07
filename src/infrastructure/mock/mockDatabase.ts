import { Customer } from "@/types/Customer";
import { TransportType } from "@/types/TransportType";
import { Item } from "@/types/Item";
import { SalesOrder } from "@/types/SalesOrder";
import { AuditLog } from "@/types/AuditLog";

const STORAGE_KEY = "ovgs_mock_db";

interface DatabaseSchema {
  customers: Customer[];
  transportTypes: TransportType[];
  items: Item[];
  salesOrders: SalesOrder[];
  auditLogs: AuditLog[];
}

const DEFAULT_TRANSPORT_TYPES: TransportType[] = [
  { id: "trans-1", name: "Caminhão", description: "Standard single unit truck" },
  { id: "trans-2", name: "Carreta", description: "Large semi-trailer" },
  { id: "trans-3", name: "Bi-truck", description: "Double axle front truck" },
];

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "Acme Logistics SA",
    document: "12.345.678/0001-97",
    documentType: "CNPJ",
    authorizedTransportTypeIds: ["trans-1", "trans-2"],
  },
  {
    id: "cust-2",
    name: "John Doe Distribution",
    document: "012.345.678-90",
    documentType: "CPF",
    authorizedTransportTypeIds: ["trans-1"],
  },
  {
    id: "cust-3",
    name: "Global Freight Ltda",
    document: "45.678.901/0001-75",
    documentType: "CNPJ",
    authorizedTransportTypeIds: ["trans-2", "trans-3"],
  },
];

const DEFAULT_ITEMS: Item[] = [
  { id: "item-1", name: "Heavy Duty Engine Part", sku: "HD-ENG-001", price: 1500.0 },
  { id: "item-2", name: "Steel Support Beam 6m", sku: "STL-BEAM-6M", price: 450.0 },
  { id: "item-3", name: "Industrial Air Filter", sku: "IND-FLTR-X", price: 120.0 },
];

const DEFAULT_SALES_ORDERS: SalesOrder[] = [
  {
    id: "so-1",
    customerId: "cust-1",
    transportTypeId: "trans-1",
    items: [{ itemId: "item-1", quantity: 2 }, { itemId: "item-3", quantity: 5 }],
    status: "CRIADA",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: "audit-1",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    actionType: "CREATE_ORDER",
    entityAffected: "SALES_ORDER",
    entityId: "so-1",
    nextState: JSON.stringify(DEFAULT_SALES_ORDERS[0]),
  },
];

const INITIAL_DB: DatabaseSchema = {
  customers: DEFAULT_CUSTOMERS,
  transportTypes: DEFAULT_TRANSPORT_TYPES,
  items: DEFAULT_ITEMS,
  salesOrders: DEFAULT_SALES_ORDERS,
  auditLogs: DEFAULT_AUDIT_LOGS,
};

function getStorage(): Storage | null {
  if (typeof window !== "undefined") {
    return window.localStorage;
  }
  return null;
}

export function loadDatabase(): DatabaseSchema {
  const storage = getStorage();
  if (!storage) return INITIAL_DB;
  const data = storage.getItem(STORAGE_KEY);
  if (!data) {
    storage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DB));
    return INITIAL_DB;
  }
  return JSON.parse(data);
}

export function saveDatabase(db: DatabaseSchema): void {
  const storage = getStorage();
  if (storage) {
    storage.setItem(STORAGE_KEY, JSON.stringify(db));
  }
}
