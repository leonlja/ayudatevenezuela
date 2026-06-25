import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 p-4 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/" className="text-lg font-bold text-[#FFD100] no-underline">
          Ayúdate Venezuela
        </Link>
        <nav className="flex gap-3 text-sm">
          <Link href="/reportar">Reportar</Link>
          <Link href="/mapa">Mapa</Link>
          <Link href="/emergencias">SOS</Link>
          <a
            href="https://github.com/leonlja/ayudatevenezuela/issues/new?labels=bug&template=bug_report.md"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-slate-200"
          >
            Bug
          </a>
        </nav>
      </div>
    </header>
  );
}

// authored-by: claude-opus-4-6
