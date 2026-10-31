import type { Categoria, Expediente } from '../types/expediente'

const CLAVE = 'expedientes'

export function obtenerExpedientes(): Expediente[] {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? '[]') as Expediente[]
  } catch {
    return []
  }
}

export function guardarExpedientes(lista: Expediente[]): void {
  localStorage.setItem(CLAVE, JSON.stringify(lista))
}

export function obtenerExpediente(id: string): Expediente | undefined {
  return obtenerExpedientes().find((e) => e.id === id)
}

export function actualizarExpediente(exp: Expediente): void {
  const lista = obtenerExpedientes().map((e) => (e.id === exp.id ? exp : e))
  guardarExpedientes(lista)
}

// ID legible y único: EXP-0001, EXP-0002...
export function generarId(): string {
  const mayor = obtenerExpedientes().reduce((max, e) => {
    const n = parseInt(e.id.replace('EXP-', ''), 10)
    return Number.isNaN(n) ? max : Math.max(max, n)
  }, 0)
  return 'EXP-' + String(mayor + 1).padStart(4, '0')
}

export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleString('es-GT')
}

interface NuevoExpediente {
  alias: string
  descripcion: string
  responsable: string
  categoria: Categoria
}

export function crearExpediente(datos: NuevoExpediente): Expediente {
  const ahora = new Date().toISOString()
  const exp: Expediente = {
    id: generarId(),
    ...datos,
    fechaApertura: ahora,
    estado: 'Abierto',
    historial: [
      {
        id: crypto.randomUUID(),
        tipo: 'estado',
        fecha: ahora,
        detalle: 'Expediente abierto (estado inicial: Abierto)',
      },
    ],
  }
  guardarExpedientes([...obtenerExpedientes(), exp])
  return exp
}