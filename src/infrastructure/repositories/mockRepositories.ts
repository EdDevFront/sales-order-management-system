import { loadDatabase, saveDatabase } from "../mock/mockDatabase";
import { Customer } from "@/domain/entities/Customer";
import { TransportType } from "@/domain/entities/TransportType";
import { Item } from "@/domain/entities/Item";
import { SalesOrder } from "@/domain/entities/SalesOrder";
import { AuditLog } from "@/domain/entities/AuditLog";

const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 300));

export async function fetchCustomers(): Promise<Customer[]> {
  await simulateDelay();
  return loadDatabase().customers;
}

export async function saveCustomer(customer: Customer): Promise<Customer> {
  await simulateDelay();
  const db = loadDatabase();
  const index = db.customers.findIndex((c) => c.id === customer.id);
  if (index >= 0) {
    db.customers[index] = customer;
  } else {
    db.customers.push(customer);
  }
  saveDatabase(db);
  return customer;
}

export async function fetchTransportTypes(): Promise<TransportType[]> {
  await simulateDelay();
  return loadDatabase().transportTypes;
}

export async function saveTransportType(transport: TransportType): Promise<TransportType> {
  await simulateDelay();
  const db = loadDatabase();
  const index = db.transportTypes.findIndex((t) => t.id === transport.id);
  if (index >= 0) {
    db.transportTypes[index] = transport;
  } else {
    db.transportTypes.push(transport);
  }
  saveDatabase(db);
  return transport;
}

export async function fetchItems(): Promise<Item[]> {
  await simulateDelay();
  return loadDatabase().items;
}

export async function saveItem(item: Item): Promise<Item> {
  await simulateDelay();
  const db = loadDatabase();
  db.items.push(item);
  saveDatabase(db);
  return item;
}

export async function fetchSalesOrders(): Promise<SalesOrder[]> {
  await simulateDelay();
  return loadDatabase().salesOrders;
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  await simulateDelay();
  return loadDatabase().auditLogs;
}
