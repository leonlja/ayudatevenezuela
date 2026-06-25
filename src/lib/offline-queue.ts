import { openDB } from "idb";

export type PendingReport = Record<string, unknown>;

const DB_NAME = "ayuda-venezuela-db";
const STORE_NAME = "reportQueue";

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

export async function queueReport(payload: PendingReport) {
  const db = await getDb();
  await db.add(STORE_NAME, {
    payload,
    createdAt: new Date().toISOString(),
  });
}

export async function flushQueue(deviceId: string) {
  const db = await getDb();
  const all = await db.getAll(STORE_NAME);

  for (const item of all) {
    try {
      const result = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-id": deviceId,
        },
        body: JSON.stringify(item.payload),
      });
      if (result.ok) {
        await db.delete(STORE_NAME, item.id);
      }
    } catch {
      break;
    }
  }
}

export async function getQueueSize() {
  const db = await getDb();
  return db.count(STORE_NAME);
}

// authored-by: gpt-5.3-codex
