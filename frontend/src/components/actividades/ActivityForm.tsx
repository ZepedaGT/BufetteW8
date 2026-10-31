import { useState, type FormEvent } from "react";
import { Plus, ClipboardList } from "lucide-react";

export interface Activity {
  id: string;
  descripcion: string;
  fecha: string;
  tipo?: string;
}

interface ActivityFormProps {
  estado: string;
  onAddActivity: (actividad: Activity) => void;
}

export default function ActivityForm({
  estado,
  onAddActivity,
}: ActivityFormProps) {
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");

  const bloqueado = estado === "Cerrado";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const texto = descripcion.trim();

    if (!texto) {
      setError("La descripción de la actividad es obligatoria.");
      return;
    }

    if (bloqueado) {
      setError("No puedes agregar actividades a un expediente cerrado.");
      return;
    }

    const actividad: Activity = {
      id: crypto.randomUUID(),
      descripcion: texto,
      fecha: new Date().toISOString(),
      tipo: "Actividad",
    };

    onAddActivity(actividad);

    setDescripcion("");
    setError("");
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
          <ClipboardList size={20} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Registrar actividad
          </h2>
          <p className="text-sm text-slate-500">
            Agrega una actuación al expediente.
          </p>
        </div>
      </div>

      {bloqueado ? (
        <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-600">
          Este expediente está cerrado. No admite nuevas actividades.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="descripcionActividad"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Descripción de la actividad *
            </label>

            <textarea
              id="descripcionActividad"
              value={descripcion}
              onChange={(event) => {
                setDescripcion(event.target.value);
                setError("");
              }}
              placeholder="Describe la actividad realizada..."
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Registrar actividad
          </button>
        </form>
      )}
    </section>
  );
}