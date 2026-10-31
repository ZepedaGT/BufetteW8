import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ActivityForm from "../components/actividades/ActivityForm";
import ActivityList from "../components/actividades/ActivityList";
import ChangeStatusButton from "../components/actividades/ChangeStatusButton";
import CloseCaseForm from "../components/actividades/CloseCaseForm";
import {
  cambiarEstado,
  cerrarExpediente,
  obtenerActividades,
  obtenerExpediente,
  registrarActividad,
  formatearFecha,
} from "../lib/storage";
import type { Actividad, Expediente } from "../types/expediente";
import EstadoBadge from "../components/EstadoBadge";
import Historial from "../components/Historial";

export default function DetalleExpediente() {
  const { id } = useParams();
  const [, actualizarVista] = useState(0);
  const expediente = id ? obtenerExpediente(id) : undefined;
  const [error, setError] = useState("");

  function ejecutarAccion(accion: () => Expediente): boolean {
    try {
      accion();
      actualizarVista((valor) => valor + 1);
      setError("");
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo actualizar el expediente.");
      return false;
    }
  }

  function agregarActividad(actividad: Actividad): boolean {
    if (id) {
      return ejecutarAccion(() => registrarActividad(id, actividad));
    }
    return false;
  }

  const actividades = expediente ? obtenerActividades(expediente) : [];

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

      {error && (
        <p role="alert" className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mb-6 grid gap-4">
        <ChangeStatusButton
          estado={expediente.estado}
          onChangeStatus={() => {
            if (id) ejecutarAccion(() => cambiarEstado(id));
          }}
        />
        <ActivityForm estado={expediente.estado} onAddActivity={agregarActividad} />
        <CloseCaseForm
          estado={expediente.estado}
          totalActividades={actividades.length}
          onClose={(motivo, fecha) => {
            if (id) return ejecutarAccion(() => cerrarExpediente(id, motivo, fecha));
            return false;
          }}
        />
      </div>

      <div className="mb-6">
        <ActivityList actividades={actividades} />
      </div>
      <h2 className="mb-3 text-lg font-semibold">Historial completo</h2>
      <Historial expediente={expediente} />
    </div>
  );
}