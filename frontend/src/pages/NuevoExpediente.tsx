import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FilePlus2, CheckCircle2, AlertCircle } from "lucide-react";
import { crearExpediente, formatearFecha } from "../lib/storage";

const esquema = z.object({
  alias: z
    .string()
    .trim()
    .min(
      1,
      "Ingrese el nombre o alias del solicitante (no puede estar vacío ni tener solo espacios).",
    ),
  descripcion: z
    .string()
    .trim()
    .min(
      1,
      "Ingrese una descripción breve del asunto (no puede estar vacía ni tener solo espacios).",
    ),
  responsable: z
    .string()
    .trim()
    .min(
      1,
      "Ingrese el nombre del responsable (no puede estar vacío ni tener solo espacios).",
    ),
  categoria: z.enum(["", "Civil", "Familiar", "Laboral"]),
});

type FormDatos = z.infer<typeof esquema>;

export default function NuevoExpediente() {
  const [exito, setExito] = useState<string | null>(null);
  const [errorGeneral, setErrorGeneral] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormDatos>({
    resolver: zodResolver(esquema),
    defaultValues: {
      alias: "",
      descripcion: "",
      responsable: "",
      categoria: "",
    },
  });

  const onSubmit = (datos: FormDatos) => {
    const exp = crearExpediente(datos);
    setErrorGeneral(false);
    setExito(
      `Expediente ${exp.id} abierto correctamente — ${formatearFecha(exp.fechaApertura)}`,
    );
    reset();
  };

  const onError = () => {
    setExito(null);
    setErrorGeneral(true);
  };

  const inputBase =
    "mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600";
  const clase = (error?: unknown) =>
    `${inputBase} ${error ? "border-red-500 bg-red-50" : "border-gray-300"}`;

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
      <h2 className="mb-1 flex items-center gap-2 text-xl font-bold text-blue-900">
        <FilePlus2 size={22} /> Abrir nuevo expediente
      </h2>
      <p className="mb-4 text-sm text-gray-500">
        Los campos con <span className="text-red-600">*</span> son obligatorios.
        Use solo datos ficticios.
      </p>

      {errorGeneral && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-red-400 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          No se pudo abrir el expediente. Corrija los campos marcados en rojo.
        </div>
      )}

      {exito && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-green-500 bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          {exito}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
        className="space-y-4"
        onChange={() => setExito(null)}
      >
        <div>
          <label htmlFor="alias" className="text-sm font-semibold">
            Nombre ficticio o alias del solicitante{" "}
            <span className="text-red-600">*</span>
          </label>
          <input
            id="alias"
            maxLength={80}
            {...register("alias")}
            className={clase(errors.alias)}
          />
          {errors.alias && (
            <p className="mt-1 text-xs text-red-600">{errors.alias.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="descripcion" className="text-sm font-semibold">
            Descripción breve del asunto <span className="text-red-600">*</span>
          </label>
          <textarea
            id="descripcion"
            rows={3}
            maxLength={300}
            {...register("descripcion")}
            className={clase(errors.descripcion)}
          />
          {errors.descripcion && (
            <p className="mt-1 text-xs text-red-600">
              {errors.descripcion.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="responsable" className="text-sm font-semibold">
            Nombre del responsable <span className="text-red-600">*</span>
          </label>
          <input
            id="responsable"
            maxLength={80}
            {...register("responsable")}
            className={clase(errors.responsable)}
          />
          {errors.responsable && (
            <p className="mt-1 text-xs text-red-600">
              {errors.responsable.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="categoria" className="text-sm font-semibold">
            Categoría (opcional)
          </label>
          <select id="categoria" {...register("categoria")} className={clase()}>
            <option value="">-- Sin categoría --</option>
            <option value="Civil">Civil</option>
            <option value="Familiar">Familiar</option>
            <option value="Laboral">Laboral</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-md bg-blue-900 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Abrir expediente
        </button>
      </form>
    </div>
  );
}
