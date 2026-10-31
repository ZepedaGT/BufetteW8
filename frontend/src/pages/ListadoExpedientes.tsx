import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { obtenerExpedientes } from "../lib/storage";
import EstadoBadge from "../components/EstadoBadge";

export default function ListadoExpedientes() {
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("Todos"); // filtro opcional
  const expedientes = obtenerExpedientes();

  const resultados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return expedientes.filter((e) => {
      const coincideTexto =
        q === "" || e.id.toLowerCase().includes(q) || e.alias.toLowerCase().includes(q);
      const coincideEstado = estado === "Todos" || e.estado === estado;
      return coincideTexto && coincideEstado;
    });
  }, [expedientes, busqueda, estado]);

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Expedientes</h1>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por identificador o nombre/alias"
            aria-label="Buscar expedientes"
            className="w-full rounded border border-gray-300 py-2 pl-9 pr-3"
          />
        </div>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          aria-label="Filtrar por estado"
          className="rounded border border-gray-300 px-3 py-2"
        >
          <option>Todos</option>
          <option>Abierto</option>
          <option>En seguimiento</option>
          <option>Cerrado</option>
        </select>
      </div>

      {expedientes.length === 0 ? (
        <p className="rounded bg-gray-50 p-6 text-center text-gray-600">
          Aún no hay expedientes. Crea el primero desde "Nuevo expediente".
        </p>
      ) : resultados.length === 0 ? (
        <p className="rounded bg-yellow-50 p-6 text-center text-yellow-800">
          No se encontraron resultados{busqueda ? ` para "${busqueda}"` : ""}.
        </p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Persona</th>
                <th className="p-3">Responsable</th>
                <th className="p-3">Estado</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((e) => (
                <tr key={e.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono">{e.id}</td>
                  <td className="p-3">{e.alias}</td>
                  <td className="p-3">{e.responsable}</td>
                  <td className="p-3"><EstadoBadge estado={e.estado} /></td>
                  <td className="p-3 text-right">
                    <Link to={`/expediente/${e.id}`} className="text-blue-600 hover:underline">
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}