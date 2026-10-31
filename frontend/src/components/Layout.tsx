import { NavLink, Outlet } from "react-router-dom";
import { Gavel, FolderOpen, FilePlus2 } from "lucide-react";

export default function Layout() {
  const link = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-amber-400 text-blue-950 shadow"
        : "text-blue-100 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 text-gray-800">
      <header className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 shadow-lg">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Mazo animado */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-2 ring-amber-400/60">
              <span className="onda absolute bottom-2 left-2 h-4 w-4 rounded-full border-2 border-amber-300" />
              <Gavel size={30} className="mazo text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white">
                Bufete Popular
              </h1>
              <p className="text-xs text-blue-200">
                Gestión de expedientes · Datos ficticios
              </p>
            </div>
          </div>

          <nav className="flex gap-2 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
            <NavLink to="/" end className={link}>
              <FolderOpen size={16} /> Expedientes
            </NavLink>
            <NavLink to="/nuevo" className={link}>
              <FilePlus2 size={16} /> Nuevo expediente
            </NavLink>
          </nav>
        </div>
        <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 p-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-300 bg-white/60 py-3 text-center text-xs text-gray-500">
        AI Code Wars · UMG 2026 · Prototipo académico, no brinda asesoría
        jurídica
      </footer>
    </div>
  );
}
