export default function EmergenciasPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Telefonos de emergencia en Caracas</h1>
      <div className="space-y-4">
        <Section title="Numeros de emergencia">
          <Item label="Desde fijo Cantv" number="171" />
          <Item label="Desde Movilnet" number="*1" />
          <Item label="Desde Digitel" number="112" />
          <Item label="Desde Movistar" number="911" />
        </Section>

        <Section title="Hospitales y clinicas">
          <Item label="Hospital Andres Herrera Vegas (El Algodonal)" number="(212) 472 31 38" />
          <Item label="Hospital Centro Medico IVSS (Caricuao)" number="(212) 432 55 11" />
          <Item label="Hospital Clinico Universitario (Chaguaramos)" number="(212) 606 71 11" />
          <Item label="Hospital de Clinicas Caracas (San Bernardino)" number="(212) 508 61 11" />
          <Item label="Hospital de Ninos J.M. de Los Rios (San Bernardino)" number="(212) 574 35 11" />
          <Item label="Hospital Dr. Domingo Luciani (El Llanito)" number="(212) 257 87 12" />
          <Item label="Hospital El Algodonal (Antimano)" number="(212) 472 54 10" />
          <Item label="Hospital Jose Gregorio Hernandez (Los Magallanes)" number="(212) 870 78 97" />
          <Item label="Hospital Miguel Perez Carreno (Bella Vista)" number="(212) 472 84 72" />
          <Item label="Hospital Militar (San Martin)" number="(212) 406 12 41" />
          <Item label="Hospital Periferico de Catia" number="(212) 870 27 71" />
          <Item label="Hospital Periferico de Coche" number="(212) 681 11 33" />
          <Item label="Policlinica David Lobo (Santa Rosalia)" number="(212) 541 54 65" />
          <Item label="Policlinica La Arboleda (San Bernardino)" number="(212) 550 18 11" />
          <Item label="Policlinica Las Mercedes" number="(212) 993 23 23" />
          <Item label="Policlinica Santiago de Leon (Sabana Grande)" number="(212) 762 90 25" />
          <Item label="Centro Clinico Razetti (La Candelaria)" number="(212) 597 02 48" />
          <Item label="Centro Medico de Caracas (San Bernardino)" number="(212) 555 91 11" />
          <Item label="Clinica La Floresta (Los Palos Grandes)" number="(212) 285 60 58" />
          <Item label="Clinica Leopoldo Aguerrevere (Prados del Este)" number="(212) 907 08 11" />
          <Item label="Clinica Rescarven (Santa Cecilia)" number="(212) 239 56 86" />
        </Section>

        <Section title="Ambulancias">
          <Item label="Aeroambulancias" number="(0212) 993 25 41 / 992 89 80" />
          <Item label="Rescarven" number="(0212) 993 69 11 / 993 69 91" />
          <Item label="Servicio Ambulancia Metropolitano" number="(0212) 545 45 45 / 545 46 55" />
        </Section>

        <Section title="Bomberos">
          <Item label="Bomberos Antimano" number="(0212) 472 20 54" />
          <Item label="Bomberos Catia la Mar" number="(0212) 351 99 66" />
          <Item label="Bomberos Chacao" number="(0212) 265 32 61" />
          <Item label="Bomberos del Este (Cafetal)" number="(0212) 987 43 34 / 985 50 60" />
          <Item label="Bomberos Sucre" number="(0212) 985 36 40" />
          <Item label="Bomberos El Paraiso" number="(0212) 481 09 61" />
          <Item label="Bomberos El Valle" number="(0212) 672 01 75 / 672 06 36" />
          <Item label="Bomberos La Guaira" number="(0212) 332 76 20 / 331 04 45" />
          <Item label="Bomberos La Trinidad" number="(0212) 943 43 61" />
          <Item label="Bomberos La Urbina" number="(0212) 241 66 41" />
          <Item label="Bomberos Metropolitanos" number="(0212) 545 45 45" />
          <Item label="Bomberos Plaza Venezuela" number="(0212) 793 00 39 / 793 64 57" />
          <Item label="Bomberos San Bernardino" number="(0212) 577 92 09" />
        </Section>

        <Section title="Proteccion Civil">
          <Item label="Proteccion Civil" number="0800-5588427 / 0800-2668446" />
          <Item label="Instituto Proteccion Civil" number="(0212) 631 86 62 / 631 90 58" />
          <Item label="Defensa Civil Alcaldia Mayor" number="(0212) 662 67 59 / 662 32 05" />
          <Item label="Defensa Civil Nacional" number="0800 28326 / 0800 24845" />
        </Section>

        <Section title="Policia">
          <Item label="CICPC" number="(0212) 571 35 33 / 571 38 44" />
          <Item label="Policia Metropolitana" number="(0212) 862 58 71 / 862 58 72" />
          <Item label="Policia Municipal Chacao" number="(0212) 264 12 56 / 264 00 50" />
          <Item label="Policia Municipal Baruta" number="(0212) 943 28 55 / 943 62 77" />
          <Item label="Policia Municipal Sucre" number="(0212) 242 21 11 / 242 22 11" />
          <Item label="Policia Municipal El Hatillo" number="(0212) 961 16 82" />
        </Section>

        <Section title="Rescate">
          <Item label="Emergencias Rescate y Transmisiones" number="(0212) 545 47 47" />
          <Item label="Grupo Rescate Caracas (El Avila)" number="(0212) 615 63 86 / 415 46 61" />
          <Item label="Grupo Rescate Venezuela" number="(0212) 977 47 10" />
          <Item label="Rescate Humboldt" number="(0212) 234 22 34 / 0414 926 21 39" />
          <Item label="Cruz Roja Socorristas" number="(0212) 571 47 13" />
          <Item label="Brigada Restablecimiento Vias (Min. Transporte)" number="(0212) 537 26 77" />
          <Item label="Rescate Humboldt (actualizado)" number="0414 305 68 68" />
        </Section>

        <Section title="Transito">
          <Item label="Inspeccion Nacional de Transito (INT)" number="167" />
          <Item label="Vivex (Vigilancia Vias Expresas)" number="(0212) 471 60 01 / 471 14 81" />
        </Section>
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border border-slate-700 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-bold text-[#FFD100]">{title}</h2>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function Item({ label, number }: { label: string; number: string }) {
  const firstNumber = number.split("/")[0].trim().replace(/[^0-9*+]/g, "");
  return (
    <li className="flex flex-col gap-0.5 border-b border-slate-800 pb-2 last:border-0 last:pb-0">
      <span className="text-sm text-slate-300">{label}</span>
      <a href={`tel:${firstNumber}`} className="font-mono text-sm text-white no-underline">
        {number}
      </a>
    </li>
  );
}

// authored-by: claude-opus-4-6
