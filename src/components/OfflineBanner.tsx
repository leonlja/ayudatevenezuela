"use client";

import { useEffect, useState } from "react";
import { getQueueSize } from "@/lib/offline-queue";

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [queued, setQueued] = useState(0);

  useEffect(() => {
    const update = async () => {
      setIsOnline(navigator.onLine);
      setQueued(await getQueueSize());
    };
    update().catch(() => undefined);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (isOnline && queued === 0) return null;

  return (
    <div className="rounded border border-yellow-400 bg-yellow-200 p-3 text-sm font-semibold text-black">
      {isOnline ? `Reconectado. Pendientes por enviar: ${queued}` : `Sin conexion. Reportes en cola: ${queued}`}
    </div>
  );
}

// authored-by: gpt-5.3-codex
