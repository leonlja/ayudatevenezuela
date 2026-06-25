"use client";

import { useEffect, useState } from "react";
import { flushQueue, getQueueSize } from "@/lib/offline-queue";

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [queued, setQueued] = useState(0);
  const [flushing, setFlushing] = useState(false);

  useEffect(() => {
    const update = async () => {
      setIsOnline(navigator.onLine);
      const size = await getQueueSize();
      setQueued(size);

      if (navigator.onLine && size > 0 && !flushing) {
        setFlushing(true);
        try {
          const deviceId = localStorage.getItem("ayuda-device-id") || "unknown-device";
          await flushQueue(deviceId);
          setQueued(await getQueueSize());
        } finally {
          setFlushing(false);
        }
      }
    };
    update().catch(() => undefined);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, [flushing]);

  if (isOnline && queued === 0) return null;

  return (
    <div className="rounded border border-yellow-400 bg-yellow-200 p-3 text-sm font-semibold text-black">
      {flushing
        ? "Enviando reportes en cola..."
        : isOnline
          ? `Reconectado. Pendientes por enviar: ${queued}`
          : `Sin conexion. Reportes en cola: ${queued}`}
    </div>
  );
}

// authored-by: claude-opus-4-6
