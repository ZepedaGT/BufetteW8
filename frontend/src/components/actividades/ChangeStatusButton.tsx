import { ArrowRight, CheckCircle2 } from "lucide-react";

interface ChangeStatusButtonProps {
  estado: string;
  onChangeStatus: () => void;
}

export default function ChangeStatusButton({
  estado,
  onChangeStatus,
}: ChangeStatusButtonProps) {
  if (estado === "Cerrado") {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-100 p-4">
        <p className="font-medium text-slate-700">
          El expediente está cerrado.
        </p>

        <p className="mt-1 text-sm text-slate-500">
          No se permiten más cambios de estado.
        </p>
      </div>
    );
  }

  if (estado === "En seguimiento") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <CheckCircle2 className="shrink-0 text-blue-600" size={22} />

        <div>
          <p className="font-medium text-blue-900">
            Expediente en seguimiento
          </p>

          <p className="text-sm text-blue-700">
            El expediente ya se encuentra en seguimiento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-800">
        Cambiar estado
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Cambia el estado del expediente para indicar que está en seguimiento.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
          Abierto
        </span>

        <ArrowRight size={18} className="text-slate-400" />

        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          En seguimiento
        </span>
      </div>

      <button
        type="button"
        onClick={onChangeStatus}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Pasar a seguimiento
      </button>
    </section>
  );
}