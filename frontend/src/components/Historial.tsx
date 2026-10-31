import { ArrowRightLeft, FolderOpen, MessageSquare, RotateCcw } from "lucide-react";
import { formatearFecha } from "../lib/storage";
import type { EntradaHistorial, Expediente } from "../types/expediente";

type Evento = {
  id: string;
  tipo: "apertura" | "actividad" | "estado" | "reapertura";
  fecha: string;
  texto: string;
  detalle?: string;
};

function construirHistorial(expediente: Expediente): Evento[] {
  return expediente.historial
    .map((entrada: EntradaHistorial) => {
      const esReapertura =
        entrada.tipo === "estado" && entrada.estadoAnterior === "Cerrado";
      const tipo: Evento["tipo"] = esReapertura ? "reapertura" : entrada.tipo;

      return {
        id: entrada.id,
        tipo,
        fecha: entrada.fecha,
        texto: entrada.detalle,
        detalle: entrada.tipoActividad ?? entrada.motivo,
      };
    })
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
}

const estilos = {
  apertura: {
    Icono: FolderOpen,
    etiqueta: "Apertura",
    clase: "bg-green-100 text-green-700",
  },
  actividad: {
    Icono: MessageSquare,
    etiqueta: "Actividad",
    clase: "bg-blue-100 text-blue-700",
  },
  estado: {
    Icono: ArrowRightLeft,
    etiqueta: "Cambio de estado",
    clase: "bg-purple-100 text-purple-700",
  },
  reapertura: {
    Icono: RotateCcw,
    etiqueta: "Reapertura",
    clase: "bg-orange-100 text-orange-700",
  },
};

export default function Historial({ expediente }: { expediente: Expediente }) {
  const eventos = construirHistorial(expediente);

  return (
    <ol className="space-y-3">
      {eventos.map((evento) => {
        const { Icono, etiqueta, clase } = estilos[evento.tipo];
        return (
          <li key={evento.id} className="flex gap-3 rounded border border-gray-200 p-3">
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${clase}`}>
              <Icono className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs text-gray-500">
                <span className="font-semibold">{etiqueta}</span> · {formatearFecha(evento.fecha)}
              </p>
              <p>{evento.texto}</p>
              {evento.detalle && (
                <p className="text-sm text-gray-600">
                  {evento.tipo === "actividad"
                    ? "Tipo: "
                    : evento.tipo === "reapertura"
                      ? "Motivo de reapertura: "
                      : "Motivo: "}
                  {evento.detalle}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
