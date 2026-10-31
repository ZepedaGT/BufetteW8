<<<<<<< HEAD
import { FolderOpen, MessageSquare, ArrowRightLeft, RotateCcw } from "lucide-react";
=======
import { FolderOpen, MessageSquare, ArrowRightLeft } from "lucide-react";
import { formatearFecha } from "../lib/storage";
>>>>>>> 3d0fccf4cb6cc83e4b21665e3c2f3334485dd1fb
import type { Expediente } from "../types/expediente";

export type Cierre = { fecha: string; motivo?: string };

type Evento = {
  id: string;
  tipo: "apertura" | "actividad" | "estado" | "reapertura";
  fecha: string;
  texto: string;
  detalle?: string;
};

<<<<<<< HEAD
export const formatearFecha = (f: string) =>
  new Date(f).toLocaleString("es-GT", { dateStyle: "medium", timeStyle: "short" });

// Lista de todos los cierres (usa `cierres` si existe; si no, los deduce de cambiosEstado)
export function obtenerCierres(e: Expediente): Cierre[] {
  const guardados = (e as unknown as { cierres?: Cierre[] }).cierres;
  if (guardados && guardados.length > 0) return guardados;
  const cierres = e.cambiosEstado.filter((c) => c.a === "Cerrado");
  return cierres.map((c, i) => ({
    fecha: c.fecha,
    motivo:
      (c as unknown as { motivo?: string }).motivo ??
      (i === cierres.length - 1 ? e.motivoCierre : undefined),
  }));
}

function construirHistorial(e: Expediente): Evento[] {
  const cierres = obtenerCierres(e);
  const eventos: Evento[] = [
    { id: "apertura", tipo: "apertura", fecha: e.fechaApertura, texto: "Expediente abierto" },
    ...e.actividades.map((a) => ({
      id: a.id,
      tipo: "actividad" as const,
      fecha: a.fecha,
      texto: a.descripcion,
      detalle: a.tipo,
    })),
    ...e.cambiosEstado.map((c) => {
      const esReapertura = c.de === "Cerrado" && c.a !== "Cerrado";
      return {
        id: c.id,
        tipo: esReapertura ? ("reapertura" as const) : ("estado" as const),
        fecha: c.fecha,
        texto: esReapertura
          ? `Expediente reabierto: ${c.de} → ${c.a}`
          : `Cambio de estado: ${c.de} → ${c.a}`,
        detalle: c.a === "Cerrado" ? cierres.find((x) => x.fecha === c.fecha)?.motivo : undefined,
      };
    }),
  ];
  return eventos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
=======
function construirHistorial(e: Expediente): Evento[] {
  return e.historial
    .map((entrada) => ({
      id: entrada.id,
      tipo: entrada.tipo,
      fecha: entrada.fecha,
      texto: entrada.detalle,
      detalle: entrada.tipoActividad,
    }))
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
>>>>>>> 3d0fccf4cb6cc83e4b21665e3c2f3334485dd1fb
}

const estilos = {
  apertura: { Icono: FolderOpen, etiqueta: "Apertura", clase: "bg-green-100 text-green-700" },
  actividad: { Icono: MessageSquare, etiqueta: "Actividad", clase: "bg-blue-100 text-blue-700" },
  estado: { Icono: ArrowRightLeft, etiqueta: "Cambio de estado", clase: "bg-purple-100 text-purple-700" },
  reapertura: { Icono: RotateCcw, etiqueta: "Reapertura", clase: "bg-orange-100 text-orange-700" },
};

export default function Historial({ expediente }: { expediente: Expediente }) {
  const eventos = construirHistorial(expediente);

  return (
    <ol className="space-y-3">
      {eventos.map((ev) => {
        const { Icono, etiqueta, clase } = estilos[ev.tipo];
        return (
          <li key={ev.id} className="flex gap-3 rounded border border-gray-200 p-3">
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${clase}`}>
              <Icono className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs text-gray-500">
                <span className="font-semibold">{etiqueta}</span> · {formatearFecha(ev.fecha)}
              </p>
              <p>{ev.texto}</p>
              {ev.detalle && (
                <p className="text-sm text-gray-600">
                  {ev.tipo === "estado" ? "Motivo de cierre: " : "Tipo: "}
                  {ev.detalle}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}