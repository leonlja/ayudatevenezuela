import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 p-4 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/" className="text-lg font-bold text-[#FFD100] no-underline">
          Ayuda Venezuela
        </Link>
        <nav className="flex gap-3 text-sm">
          <Link href="/reportar">Reportar</Link>
          <Link href="/mapa">Mapa</Link>
        </nav>
      </div>
    </header>
  );
}

// authored-by: gpt-5.3-codex
