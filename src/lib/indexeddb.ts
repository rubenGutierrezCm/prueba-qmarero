import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Bill, PersonSplit } from "@/types/bill";

interface BillSplitterDB extends DBSchema {
  sessions: {
    key: string;
    value: {
      sessionId: string;
      bill: Bill;
      people: (PersonSplit & { email: string; paid: boolean })[];
      createdAt: number;
      updatedAt: number;
    };
  };
  payments: {
    key: string;
    value: {
      paymentId: string;
      sessionId: string;
      personId: string;
      personName: string;
      personEmail: string;
      amount: number;
      currency: string;
      products: {
        itemId: string;
        itemName: string;
        quantity: number;
        unitPrice: number;
      }[];
      paid: boolean;
      paymentIntentId?: string;
      paidAt?: number;
      createdAt: number;
    };
    indexes: {
      sessionId: string;
      personId: string;
      personEmail: string;
    };
  };
}

let dbInstance: IDBPDatabase<BillSplitterDB> | null = null;

export async function getDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<BillSplitterDB>("bill-splitter-db", 1, {
    upgrade(db) {
      // Store para sesiones de división
      if (!db.objectStoreNames.contains("sessions")) {
        db.createObjectStore("sessions", { keyPath: "sessionId" });
      }

      // Store para pagos individuales
      if (!db.objectStoreNames.contains("payments")) {
        const paymentStore = db.createObjectStore("payments", {
          keyPath: "paymentId",
        });
        paymentStore.createIndex("sessionId", "sessionId", { unique: false });
        paymentStore.createIndex("personId", "personId", { unique: false });
        paymentStore.createIndex("personEmail", "personEmail", {
          unique: false,
        });
      }
    },
  });

  return dbInstance;
}

// ===== SESIONES =====
export async function saveSession(session: {
  sessionId: string;
  bill: Bill;
  people: (PersonSplit & { email: string; paid: boolean })[];
  createdAt?: number;
}) {
  const db = await getDB();
  const now = Date.now();
  await db.put("sessions", {
    ...session,
    createdAt: session.createdAt || now,
    updatedAt: now,
  });
}

export async function loadSession(sessionId: string) {
  const db = await getDB();
  return db.get("sessions", sessionId);
}

export async function deleteSession(sessionId: string) {
  const db = await getDB();
  await db.delete("sessions", sessionId);
  
  // También eliminar todos los pagos asociados
  const payments = await getPaymentsBySession(sessionId);
  for (const payment of payments) {
    await db.delete("payments", payment.paymentId);
  }
}

// ===== PAGOS =====
export async function createPayment(payment: {
  sessionId: string;
  personId: string;
  personName: string;
  personEmail: string;
  amount: number;
  currency: string;
  products: {
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
  }[];
}) {
  const db = await getDB();
  const paymentId = `payment_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const paymentData = {
    paymentId,
    ...payment,
    paid: false,
    createdAt: Date.now(),
  };

  await db.add("payments", paymentData);
  return paymentId;
}

export async function getPayment(paymentId: string) {
  const db = await getDB();
  return db.get("payments", paymentId);
}

export async function getPaymentsBySession(sessionId: string) {
  const db = await getDB();
  const index = db.transaction("payments").store.index("sessionId");
  return index.getAll(IDBKeyRange.only(sessionId));
}

export async function getPaymentsByEmail(email: string) {
  const db = await getDB();
  const index = db.transaction("payments").store.index("personEmail");
  return index.getAll(IDBKeyRange.only(email));
}

export async function markPaymentAsPaid(
  paymentId: string,
  paymentIntentId: string
) {
  const db = await getDB();
  const payment = await db.get("payments", paymentId);
  
  if (payment) {
    payment.paid = true;
    payment.paymentIntentId = paymentIntentId;
    payment.paidAt = Date.now();
    await db.put("payments", payment);
    
    // Actualizar también el estado en la sesión
    const session = await loadSession(payment.sessionId);
    if (session) {
      const person = session.people.find((p) => p.id === payment.personId);
      if (person) {
        person.paid = true;
        await saveSession(session);
      }
    }
  }
}

export async function getAllPayments() {
  const db = await getDB();
  return db.getAll("payments");
}
