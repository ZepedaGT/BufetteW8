import { NavLink, Outlet } from "react-router-dom";
import { Scale } from "lucide-react";

export default function Layout() {
  const link = ({ isActive }: { isActive: boolean }) =>
    `rounded px-3 py-1 text-sm ${isActive ? "bg-white text-blue-900 font-semibold" : "text-white hover:bg-blue-800"}`;

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800">
      <header className="bg-blue-900 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="flex items-center gap-2 text-lg font-bold text-white">
            <Scale size={22} /> Bufete Popular · Expedientes
          </h1>
          <nav className="flex gap-2">
            <NavLink to="/" end className={link}>
              Expedientes
            </NavLink>
            <NavLink to="/nuevo" className={link}>
              Nuevo expediente
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  );
}
