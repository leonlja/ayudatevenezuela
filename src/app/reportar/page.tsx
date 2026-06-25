import OfflineBanner from "@/components/OfflineBanner";
import ReportForm from "@/components/ReportForm";

export default function ReportarPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Reportar necesidad</h1>
      <p className="text-sm text-slate-300">Solo nombre de pila se muestra publicamente. Telefono y GPS exacto son privados.</p>
      <OfflineBanner />
      <ReportForm />
    </section>
  );
}

// authored-by: gpt-5.3-codex
