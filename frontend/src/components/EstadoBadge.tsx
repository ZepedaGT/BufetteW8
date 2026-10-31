import type { Estado } from "../types/expediente";

const colores: Record<Estado, string> = {
  Abierto: "bg-green-100 text-green-800",
  "En seguimiento": "bg-yellow-100 text-yellow-800",
  Cerrado: "bg-gray-200 text-gray-700",
};

export default function EstadoBadge({ estado }: { estado: Estado }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colores[estado]}`}>
      {estado}
    </span>
  );
}