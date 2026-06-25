import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-extrabold text-ve-yellow">Ayúdate Venezuela</h1>
      <p className="rounded-lg border border-slate-700 bg-slate-900 p-4 leading-relaxed">
        Dos terremotos (M7.2 y M7.5) afectaron Venezuela. Esta plataforma conecta reportes de afectados con
        voluntarios y centros de acopio.
      </p>
      <div className="grid gap-3">
        <Link
          className="min-h-14 rounded-lg bg-ve-red p-4 text-center text-lg font-bold text-white no-underline shadow-lg shadow-red-900/30 transition-transform active:scale-[0.98]"
          href="/reportar"
        >
          🆘 Necesito Ayuda
        </Link>
        <Link
          className="min-h-14 rounded-lg bg-ve-blue p-4 text-center text-lg font-bold text-white no-underline shadow-lg shadow-blue-900/30 transition-transform active:scale-[0.98]"
          href="/mapa"
        >
          🤝 Quiero Ayudar
        </Link>
      </div>
      <Link
        className="block min-h-14 rounded-lg border border-slate-700 bg-slate-900 p-4 text-center text-lg font-bold no-underline transition-colors hover:bg-slate-800"
        href="/emergencias"
      >
        📞 Telefonos de emergencia
      </Link>
    </section>
  );
}

// authored-by: claude-opus-4-6
