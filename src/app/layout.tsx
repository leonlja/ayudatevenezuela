import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "Ayuda Venezuela",
  description: "Reportes de crisis tras terremoto en Venezuela",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ServiceWorkerRegister />
        <Header />
        <main className="mx-auto max-w-4xl space-y-4 p-4">{children}</main>
      </body>
    </html>
  );
}

// authored-by: gpt-5.3-codex
