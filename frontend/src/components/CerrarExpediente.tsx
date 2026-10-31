import { useState } from "react";
import CloseCaseForm from "./actividades/CloseCaseForm";
import { cerrarExpediente } from "../lib/storage";
import type { Estado } from "../types/expediente";

interface Props {
  id: string;
  estado: Estado;
  totalActividades: number;
  onCambio: () => void;
}

export default function CerrarExpediente({
  id,
  estado,
  totalActividades,
  onCambio,
}: Props) {
  const [error, setError] = useState("");

  if (estado !== "En seguimiento") return null;

  function cerrar(motivo: string): boolean {
    try {
      const resultado = cerrarExpediente(id, motivo);
      if (!resultado.ok) {
        setError(resultado.mensaje);
        return false;
      }
      setError("");
      onCambio();
      return true;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo cerrar el expediente.",
      );
      return false;
    }
  }

  return (
    <div>
      {error && (
        <p role="alert" className="mb-3 rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <CloseCaseForm
        estado={estado}
        totalActividades={totalActividades}
        onClose={cerrar}
      />
    </div>
  );
}
