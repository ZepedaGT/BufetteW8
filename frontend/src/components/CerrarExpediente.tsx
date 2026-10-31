import { useState } from 'react'
import { cerrarExpediente } from '../lib/storage'
import type { Estado } from '../types/expediente'

interface Props {
  id: string
  estado: Estado
  onCambio: () => void
}

export default function CerrarExpediente({ id, estado, onCambio }: Props) {
  const [motivo, setMotivo] = useState('')
  const [mensaje, setMensaje] = useState<{ ok: boolean; texto: string } | null>(null)

  if (estado !== 'En seguimiento') return null

  const enviar = () => {
    const r = cerrarExpediente(id, motivo)
    setMensaje({ ok: r.ok, texto: r.mensaje })
    if (r.ok) {
      setMotivo('')
      onCambio()
    }
  }

  return (
    <div className="space-y-2 rounded border p-4">
      <label htmlFor="motivo-cierre" className="block text-sm font-medium">
        Motivo de cierre (obligatorio)
      </label>
      <textarea
        id="motivo-cierre"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        rows={3}
        className="w-full rounded border p-2"
      />
      <button onClick={enviar} className="rounded bg-red-600 px-4 py-2 text-white">
        Cerrar expediente
      </button>
      {mensaje && (
        <p role="alert" className={mensaje.ok ? 'text-green-700' : 'text-red-700'}>
          {mensaje.texto}
        </p>
      )}
    </div>
  )
}