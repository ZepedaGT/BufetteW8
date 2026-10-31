import { useState, type FormEvent } from "react";
import { LockKeyhole, XCircle } from "lucide-react";

interface CloseCaseFormProps {
  estado: string;
  totalActividades: number;
  onClose: (motivo: string, fecha: string) => void;
}

export default function CloseCaseForm({
  estado,
  totalActividades,
  onClose,
}: CloseCaseFormProps) {
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState("");

  const [confirmar, setConfirmar] = useState(false);

  const bloqueado = estado === "Cerrado";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const texto = motivo.trim();

    if (totalActividades < 1) {
      setError(
        "No puedes cerrar el expediente sin registrar al menos una actividad.",
      );
      return;
    }

    if (!texto) {
      setError("Debes ingresar un motivo de cierre.");
      return;
    }

    setError("");
    setConfirmar(true);
  }

  function handleConfirmClose() {
    const texto = motivo.trim();

    if (totalActividades < 1 || !texto || bloqueado) {
      setConfirmar(false);
      return;
    }

    onClose(texto, new Date().toISOString());

    setMotivo("");
    setConfirmar(false);
    setError("");
  }

  if (bloqueado) {
    return (
      <section className="rounded-xl border border-slate-200 bg-slate-100 p-5">
        <div className="flex items-center gap-3">
          <LockKeyhole size={22} className="text-slate-600" />

          <div>
            <h2 className="font-semibold text-slate-800">
              Expediente cerrado
            </h2>

            <p className="text-sm text-slate-600">
              El expediente ya no admite actividades ni cambios de estado.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-red-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-red-100 p-2 text-red-700">
          <LockKeyhole size={20} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Cerrar expediente
          </h2>

          <p className="text-sm text-slate-500">
            El cierre impide registrar nuevas actividades.
          </p>
        </div>
      </div>

      {totalActividades < 1 && (
        <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Debes registrar al menos una actividad antes de cerrar el expediente.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="motivoCierre"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Motivo de cierre *
          </label>

          <textarea
            id="motivoCierre"
            value={motivo}
            onChange={(event) => {
              setMotivo(event.target.value);
              setError("");
            }}
            placeholder="Explica el motivo del cierre..."
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={totalActividades < 1}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Solicitar cierre
        </button>
      </form>

      {confirmar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tituloConfirmacion"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3
              id="tituloConfirmacion"
              className="text-lg font-semibold text-slate-900"
            >
              ¿Confirmar cierre?
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Después del cierre no podrás agregar actividades ni cambiar el
              estado del expediente.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmar(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmClose}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                <span className="inline-flex items-center gap-2">
                  <XCircle size={16} />
                  Confirmar cierre
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}