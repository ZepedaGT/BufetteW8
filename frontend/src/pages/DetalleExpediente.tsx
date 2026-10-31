import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { obtenerExpediente } from "../lib/storage";
import EstadoBadge from "../components/EstadoBadge";
import Historial, { formatearFecha } from "../components/Historial";

export default function DetalleExpediente() {
  const { id } = useParams();
  const expediente = id ? obtenerExpediente(id) : undefined;

  if (!expediente) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <p className="rounded bg-red-50 p-6 text-red-700">Expediente no encontrado.</p>
        <Link to="/" className="mt-4 inline-flex items-center gap-1 text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Volver al listado
        </Link>
      </div>
    );
  }

  const dato = (titulo: string, valor?: string) => (
    <div>
      <dt className="text-xs uppercase text-gray-500">{titulo}</dt>
      <dd>{valor || "—"}</dd>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-blue-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Volver al listado
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <h1 className="font-mono text-2xl font-bold">{expediente.id}</h1>
        <EstadoBadge estado={expediente.estado} />
      </div>

      <dl className="mb-6 grid gap-4 rounded border border-gray-200 p-4 sm:grid-cols-2">
        {dato("Persona solicitante", expediente.alias)}
        {dato("Responsable", expediente.responsable)}
        {dato("Categoría", expediente.categoria)}
        {dato("Fecha de apertura", formatearFecha(expediente.fechaApertura))}
        <div className="sm:col-span-2">{dato("Descripción", expediente.descripcion)}</div>
        {expediente.estado === "Cerrado" && (
          <>
            {dato("Fecha de cierre", expediente.fechaCierre ? formatearFecha(expediente.fechaCierre) : undefined)}
            {dato("Motivo de cierre", expediente.motivoCierre)}
          </>
        )}
      </dl>

      {/* Integrante 3: agregar aquí los botones de cambio de estado y el formulario de actividad */}

      <h2 className="mb-3 text-lg font-semibold">Historial</h2>
      <Historial expediente={expediente} />
    </div>
  );
}