import { ClipboardList, Clock3 } from "lucide-react";
import type { Actividad } from "../../types/expediente";

interface ActivityListProps {
  actividades: Actividad[];
}

function formatDate(fecha: string) {
  const date = new Date(fecha);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function ActivityList({
  actividades,
}: ActivityListProps) {
  const ordenadas = [...actividades].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-lg bg-indigo-100 p-2 text-indigo-700">
          <ClipboardList size={20} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Actividades registradas
          </h2>
          <p className="text-sm text-slate-500">
            {actividades.length}{" "}
            {actividades.length === 1 ? "actividad" : "actividades"}
          </p>
        </div>
      </div>

      {ordenadas.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 py-8 text-center">
          <ClipboardList
            size={32}
            className="mx-auto mb-2 text-slate-400"
          />

          <p className="font-medium text-slate-700">
            No hay actividades registradas
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Las actividades aparecerán aquí cuando se registren.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {ordenadas.map((actividad) => (
            <article
              key={actividad.id}
              className="relative border-l-2 border-blue-200 pb-2 pl-5"
            >
              <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-blue-500 bg-white" />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-800">
                  {actividad.tipo || "Actividad"}
                </span>

                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock3 size={14} />
                  {formatDate(actividad.fecha)}
                </span>
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {actividad.descripcion}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}