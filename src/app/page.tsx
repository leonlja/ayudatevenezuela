import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-extrabold text-[#FFD100]">Ayúdate Venezuela</h1>
      <p className="rounded border border-slate-700 bg-slate-900 p-4">
        Dos terremotos (M7.2 y M7.5) afectaron Venezuela. Esta plataforma conecta reportes de afectados con
        voluntarios y centros de acopio.
      </p>
      <div className="grid gap-3">
        <Link
          className="min-h-12 rounded bg-[#CF142B] p-4 text-center text-lg font-bold text-white no-underline"
          href="/reportar"
        >
          Necesito Ayuda
        </Link>
        <Link
          className="min-h-12 rounded bg-[#0033A0] p-4 text-center text-lg font-bold text-white no-underline"
          href="/mapa"
        >
          Quiero Ayudar
        </Link>
      </div>
      <div className="rounded border border-slate-700 bg-slate-900 p-4">
        <h2 className="mb-2 text-lg font-bold">Numeros de emergencia</h2>
        <ul className="space-y-1">
          <li>911</li>
          <li>Bomberos: 171</li>
          <li>Proteccion Civil: 0800-PCIVIL1</li>
        </ul>
      </div>
      <p>
        Canal alterno:{" "}
        <a href="https://t.me/AyudaVenezuelaBot" target="_blank" rel="noreferrer">
          @AyudaVenezuelaBot
        </a>
      </p>
    </section>
  );
}

// authored-by: gpt-5.3-codex
