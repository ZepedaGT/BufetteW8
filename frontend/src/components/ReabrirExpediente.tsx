import { useState } from 'react'
import { reabrirExpediente } from '../lib/storage'
import type { Estado } from '../types/expediente'

interface Props {
  id: string
  estado: Estado
  onCambio: () => void // el detalle vuelve a leer el expediente
}

export default function ReabrirExpediente({ id, estado, onCambio }: Props) {
  const [abierto, setAbierto] = useState(false)
  const [motivo, setMotivo] = useState('')
  const [mensaje, setMensaje] = useState<{ ok: boolean; texto: string } | null>(null)

  const enviar = () => {
    try {
      const resultado = reabrirExpediente(id, motivo)
      setMensaje({ ok: resultado.ok, texto: resultado.mensaje })
      if (resultado.ok) {
        setMotivo('')
        setAbierto(false)
        onCambio()
      }
    } catch (error) {
      setMensaje({
        ok: false,
        texto: error instanceof Error ? error.message : 'No se pudo reabrir el expediente.',
      })
    }
  }

  const cancelar = () => {
    setAbierto(false)
    setMotivo('')
    setMensaje(null)
  }

  return (
    <div className="space-y-3">
      {estado === 'Cerrado' && !abierto && (
        <button
          type="button"
          onClick={() => {
            setAbierto(true)
            setMensaje(null)
          }}
          className="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
        >
          Reabrir expediente
        </button>
      )}

      {estado === 'Cerrado' && abierto && (
        <div className="space-y-2 rounded border p-4">
          <label htmlFor="motivo-reapertura" className="block text-sm font-medium">
            Motivo de la reapertura (obligatorio)
          </label>
          <textarea
            id="motivo-reapertura"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={3}
            className="w-full rounded border p-2"
          />
          <div className="flex gap-2">
            <button type="button" onClick={enviar} className="rounded bg-blue-600 px-4 py-2 text-white">
              Confirmar reapertura
            </button>
            <button type="button" onClick={cancelar} className="rounded border px-4 py-2">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {mensaje && (
        <p role="alert" className={mensaje.ok ? 'text-green-700' : 'text-red-700'}>
          {mensaje.texto}
        </p>
      )}
    </div>
  )
}