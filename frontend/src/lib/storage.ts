import type { Categoria, Cierre, EntradaHistorial, Estado, Expediente, Resultado } from '../types/expediente'

const CLAVE = 'expedientes'

// Datos guardados antes del cambio (podían tener motivoCierre/fechaCierre)
type ExpedienteGuardado = Omit<Expediente, 'cierres'> & {
  cierres?: Cierre[]
  motivoCierre?: string
  fechaCierre?: string
}

function normalizar(e: ExpedienteGuardado): Expediente {
  const cierres: Cierre[] =
    e.cierres ??
    (e.motivoCierre && e.fechaCierre ? [{ fecha: e.fechaCierre, motivo: e.motivoCierre }] : [])
  return { ...e, cierres }
}

// ===== Lectura y escritura =====
export function obtenerExpedientes(): Expediente[] {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE) ?? '[]') as ExpedienteGuardado[]
    return datos.map(normalizar)
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
  guardarExpedientes(obtenerExpedientes().map((e) => (e.id === exp.id ? exp : e)))
}

// ===== Utilidades =====
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

const estaVacio = (texto: string | undefined) => !texto || texto.trim() === ''

function nuevaEntrada(
  tipo: EntradaHistorial['tipo'],
  detalle: string,
  extra: Partial<EntradaHistorial> = {},
): EntradaHistorial {
  return { id: crypto.randomUUID(), tipo, fecha: new Date().toISOString(), detalle, ...extra }
}

function entradaEstado(de: Estado | undefined, a: Estado, detalle: string, motivo?: string): EntradaHistorial {
  return nuevaEntrada('estado', detalle, { estadoAnterior: de, estadoNuevo: a, motivo })
}

function error(mensaje: string): Resultado {
  return { ok: false, mensaje }
}

function guardarYResponder(exp: Expediente, mensaje: string): Resultado {
  actualizarExpediente(exp)
  return { ok: true, expediente: exp, mensaje }
}

// ===== Operaciones (las reglas viven aquí, no solo en la interfaz) =====

interface NuevoExpediente {
  alias: string
  descripcion: string
  responsable: string
  categoria: Categoria
}

export function crearExpediente(datos: NuevoExpediente): Expediente {
  const exp: Expediente = {
    id: generarId(),
    alias: datos.alias.trim(),
    descripcion: datos.descripcion.trim(),
    responsable: datos.responsable.trim(),
    categoria: datos.categoria,
    fechaApertura: new Date().toISOString(),
    estado: 'Abierto',
    cierres: [],
    historial: [entradaEstado(undefined, 'Abierto', 'Expediente abierto (estado inicial: Abierto)')],
  }
  guardarExpedientes([...obtenerExpedientes(), exp])
  return exp
}

export function agregarActividad(id: string, descripcion: string, tipoActividad?: string): Resultado {
  const exp = obtenerExpediente(id)
  if (!exp) return error('El expediente no existe.')
  if (exp.estado === 'Cerrado')
    return error('El expediente está cerrado y no admite nuevas actividades. Reábralo primero.')
  if (estaVacio(descripcion))
    return error('Ingrese la descripción de la actividad (no puede estar vacía ni tener solo espacios).')

  const actualizado: Expediente = {
    ...exp,
    historial: [
      ...exp.historial,
      nuevaEntrada('actividad', descripcion.trim(), {
        tipoActividad: estaVacio(tipoActividad) ? undefined : tipoActividad!.trim(),
      }),
    ],
  }
  return guardarYResponder(actualizado, 'Actividad registrada correctamente.')
}

export function pasarASeguimiento(id: string): Resultado {
  const exp = obtenerExpediente(id)
  if (!exp) return error('El expediente no existe.')
  if (exp.estado !== 'Abierto')
    return error(`Solo un expediente Abierto puede pasar a En seguimiento (estado actual: ${exp.estado}).`)

  const actualizado: Expediente = {
    ...exp,
    estado: 'En seguimiento',
    historial: [...exp.historial, entradaEstado('Abierto', 'En seguimiento', 'Cambio de estado: Abierto → En seguimiento')],
  }
  return guardarYResponder(actualizado, 'El expediente pasó a En seguimiento.')
}

export function cerrarExpediente(id: string, motivo: string): Resultado {
  const exp = obtenerExpediente(id)
  if (!exp) return error('El expediente no existe.')
  if (exp.estado !== 'En seguimiento')
    return error(`Solo se puede cerrar un expediente En seguimiento (estado actual: ${exp.estado}).`)
  if (!exp.historial.some((h) => h.tipo === 'actividad'))
    return error('Para cerrar, el expediente debe tener al menos una actividad registrada.')
  if (estaVacio(motivo))
    return error('Ingrese el motivo de cierre (no puede estar vacío ni tener solo espacios).')

  const fecha = new Date().toISOString()
  const m = motivo.trim()
  const actualizado: Expediente = {
    ...exp,
    estado: 'Cerrado',
    cierres: [...exp.cierres, { fecha, motivo: m }], // se agrega, nunca se reemplaza
    historial: [
      ...exp.historial,
      { ...entradaEstado('En seguimiento', 'Cerrado', `Cierre: En seguimiento → Cerrado. Motivo: ${m}`, m), fecha },
    ],
  }
  return guardarYResponder(actualizado, 'Expediente cerrado correctamente.')
}

export function reabrirExpediente(id: string, motivo: string): Resultado {
  const exp = obtenerExpediente(id)
  if (!exp) return error('El expediente no existe.')
  if (exp.estado !== 'Cerrado')
    return error(`No se puede reabrir: el expediente está "${exp.estado}". Solo se reabren expedientes cerrados.`)
  if (estaVacio(motivo))
    return error('Ingrese el motivo de reapertura (no puede estar vacío ni tener solo espacios).')

  const m = motivo.trim()
  const actualizado: Expediente = {
    ...exp,
    estado: 'En seguimiento', // ID, datos, actividades y cierres se conservan
    historial: [
      ...exp.historial,
      entradaEstado('Cerrado', 'En seguimiento', `Reapertura: Cerrado → En seguimiento. Motivo: ${m}`, m),
    ],
  }
  return guardarYResponder(actualizado, 'Expediente reabierto. Ya admite nuevas actividades.')
}