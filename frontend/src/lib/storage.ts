import baseDatos from '../data/api.json'
import type { Actividad, Categoria, Estado, Expediente } from '../types/expediente'

const CLAVE = 'expedientes'

export function obtenerExpedientes(): Expediente[] {
  const guardados = localStorage.getItem(CLAVE)
  return guardados === null
    ? (baseDatos.expedientes as Expediente[])
    : (JSON.parse(guardados) as Expediente[])
}

export function guardarExpedientes(lista: Expediente[]): void {
  localStorage.setItem(CLAVE, JSON.stringify(lista))
}

export function obtenerExpediente(id: string): Expediente | undefined {
  return obtenerExpedientes().find((e) => e.id === id)
}

export function actualizarExpediente(exp: Expediente): void {
  if (!obtenerExpedientes().some((e) => e.id === exp.id)) {
    throw new Error(`No existe el expediente ${exp.id}.`)
  }
  const lista = obtenerExpedientes().map((e) => (e.id === exp.id ? exp : e))
  guardarExpedientes(lista)
}

function actualizarPorId(
  id: string,
  actualizar: (expediente: Expediente) => Expediente,
): Expediente {
  const expediente = obtenerExpediente(id)
  if (!expediente) {
    throw new Error(`No existe el expediente ${id}.`)
  }
  const actualizado = actualizar(expediente)
  actualizarExpediente(actualizado)
  return actualizado
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
        id: 'apertura',
        tipo: 'apertura',
        fecha: ahora,
        detalle: 'Expediente abierto',
      },
    ],
  }
  guardarExpedientes([...obtenerExpedientes(), exp])
  return exp
}

export function obtenerActividades(expediente: Expediente): Actividad[] {
  return expediente.historial
    .filter((entrada) => entrada.tipo === 'actividad')
    .map((entrada) => ({
      id: entrada.id,
      descripcion: entrada.detalle,
      fecha: entrada.fecha,
      tipo: entrada.tipoActividad,
    }))
}

export function registrarActividad(id: string, actividad: Actividad): Expediente {
  return actualizarPorId(id, (expediente) => {
    if (expediente.estado === 'Cerrado') {
      throw new Error('No puedes agregar actividades a un expediente cerrado.')
    }
    return {
      ...expediente,
      historial: [
        ...expediente.historial,
        {
          id: actividad.id,
          tipo: 'actividad',
          fecha: actividad.fecha,
          detalle: actividad.descripcion,
          tipoActividad: actividad.tipo,
        },
      ],
    }
  })
}

export function cambiarEstado(id: string): Expediente {
  return actualizarPorId(id, (expediente) => {
    if (expediente.estado !== 'Abierto') {
      throw new Error('Solo se puede pasar a seguimiento un expediente abierto.')
    }
    const estadoAnterior: Estado = expediente.estado
    const fecha = new Date().toISOString()
    return {
      ...expediente,
      estado: 'En seguimiento',
      historial: [
        ...expediente.historial,
        {
          id: crypto.randomUUID(),
          tipo: 'estado',
          fecha,
          detalle: `Estado cambiado: ${estadoAnterior} → En seguimiento`,
        },
      ],
    }
  })
}

export function cerrarExpediente(
  id: string,
  motivo: string,
  fecha: string,
): Expediente {
  return actualizarPorId(id, (expediente) => {
    if (expediente.estado === 'Cerrado') {
      throw new Error('El expediente ya está cerrado.')
    }
    if (obtenerActividades(expediente).length === 0) {
      throw new Error('Registra al menos una actividad antes de cerrar el expediente.')
    }
    const motivoLimpio = motivo.trim()
    if (!motivoLimpio) {
      throw new Error('Debes ingresar un motivo de cierre.')
    }
    return {
      ...expediente,
      estado: 'Cerrado',
      motivoCierre: motivoLimpio,
      fechaCierre: fecha,
      historial: [
        ...expediente.historial,
        {
          id: crypto.randomUUID(),
          tipo: 'estado',
          fecha,
          detalle: `Expediente cerrado. Motivo: ${motivoLimpio}`,
        },
      ],
    }
  })
}