import { FolderOpen, MessageSquare, ArrowRightLeft } from "lucide-react";
import type { Expediente } from "../types/expediente";

type Evento = {
  id: string;
  tipo: "apertura" | "actividad" | "estado";
  fecha: string;
  texto: string;
  detalle?: string;
};

export const formatearFecha = (f: string) =>
  new Date(f).toLocaleString("es-GT", { dateStyle: "medium", timeStyle: "short" });

function construirHistorial(e: Expediente): Evento[] {
  const eventos: Evento[] = [
    {
      id: "apertura",
      tipo: "apertura",
      fecha: e.fechaApertura,
      texto: "Expediente abierto",
    },
    ...e.actividades.map((a) => ({
      id: a.id,
      tipo: "actividad" as const,
      fecha: a.fecha,
      texto: a.descripcion,
      detalle: a.tipo,
    })),
    ...e.cambiosEstado.map((c) => ({
      id: c.id,
      tipo: "estado" as const,
      fecha: c.fecha,
      texto: `Cambio de estado: ${c.de} → ${c.a}`,
      detalle: c.a === "Cerrado" ? e.motivoCierre : undefined,
    })),
  ];
  return eventos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
}

const estilos = {
  apertura: { Icono: FolderOpen, etiqueta: "Apertura", clase: "bg-green-100 text-green-700" },
  actividad: { Icono: MessageSquare, etiqueta: "Actividad", clase: "bg-blue-100 text-blue-700" },
  estado: { Icono: ArrowRightLeft, etiqueta: "Cambio de estado", clase: "bg-purple-100 text-purple-700" },
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