import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CerrarExpediente from "../components/CerrarExpediente";
import EstadoBadge from "../components/EstadoBadge";
import Historial from "../components/Historial";
import ActivityForm from "../components/actividades/ActivityForm";
import ActivityList from "../components/actividades/ActivityList";
import ChangeStatusButton from "../components/actividades/ChangeStatusButton";
import ReabrirExpediente from "../components/ReabrirExpediente";
import {
  agregarActividad,
  formatearFecha,
  obtenerActividades,
  obtenerExpediente,
  pasarASeguimiento,
} from "../lib/storage";
import type { Actividad, Resultado } from "../types/expediente";

export default function DetalleExpediente() {
  const { id } = useParams();
  const [, actualizarVista] = useState(0);
  const [error, setError] = useState("");
  const expediente = id ? obtenerExpediente(id) : undefined;
  const actividades = expediente ? obtenerActividades(expediente) : [];

  function ejecutarAccion(accion: () => Resultado): boolean {
    try {
      const resultado = accion();
      if (!resultado.ok) {
        setError(resultado.mensaje);
        return false;
      }
      actualizarVista((valor) => valor + 1);
      setError("");
      return true;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el expediente.",
      );
      return false;
    }
  }

  function agregarUnaActividad(actividad: Actividad): boolean {
    return id
      ? ejecutarAccion(() =>
          agregarActividad(id, actividad.descripcion, actividad.tipo),
        )
      : false;
  }

  if (!expediente) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <p className="rounded bg-red-50 p-6 text-red-700">
          Expediente no encontrado.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-1 text-blue-600 hover:underline"
        >
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
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-blue-600 hover:underline"
      >
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
        <div className="sm:col-span-2">
          {dato("Descripción", expediente.descripcion)}
        </div>
      </dl>

      {expediente.cierres.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">
            Historial de cierres ({expediente.cierres.length})
          </h2>
          <ul className="space-y-2">
            {expediente.cierres.map((cierre, indice) => (
              <li
                key={`${cierre.fecha}-${indice}`}
                className="rounded border border-gray-200 p-3"
              >
                <p className="text-xs text-gray-500">
                  Cierre {indice + 1} · {formatearFecha(cierre.fecha)}
                </p>
                <p>{cierre.motivo || "Motivo no disponible"}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {error && (
        <p
          role="alert"
          className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mb-6 grid gap-4">
        <ChangeStatusButton
          estado={expediente.estado}
          onChangeStatus={() => {
            if (id) ejecutarAccion(() => pasarASeguimiento(id));
          }}
        />
        <ActivityForm
          estado={expediente.estado}
          onAddActivity={agregarUnaActividad}
        />
        <CerrarExpediente
          id={expediente.id}
          estado={expediente.estado}
          totalActividades={actividades.length}
          onCambio={() => actualizarVista((valor) => valor + 1)}
        />
        <ReabrirExpediente
          id={expediente.id}
          estado={expediente.estado}
          onCambio={() => actualizarVista((valor) => valor + 1)}
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
