import baseDatos from '../data/api.json'
import type {
  Actividad,
  Categoria,
  Cierre,
  EntradaHistorial,
  Estado,
  Expediente,
  Resultado,
} from '../types/expediente'

const CLAVE = 'expedientes'

type ExpedienteGuardado = Omit<Expediente, 'cierres' | 'historial'> & {
  cierres?: Cierre[]
  historial?: EntradaHistorial[]
  motivoCierre?: string
  fechaCierre?: string
  actividades?: Actividad[]
  cambiosEstado?: Array<{
    id: string
    de: Estado
    a: Estado
    fecha: string
    motivo?: string
  }>
}

function normalizar(expediente: ExpedienteGuardado): Expediente {
  const historial: EntradaHistorial[] = expediente.historial ?? [
    ...(expediente.fechaApertura
      ? [{
          id: `${expediente.id}-apertura`,
          tipo: 'apertura' as const,
          fecha: expediente.fechaApertura,
          detalle: 'Expediente abierto',
        }]
      : []),
    ...(expediente.actividades ?? []).map((actividad) => ({
      id: actividad.id,
      tipo: 'actividad' as const,
      fecha: actividad.fecha,
      detalle: actividad.descripcion,
      tipoActividad: actividad.tipo,
    })),
    ...(expediente.cambiosEstado ?? []).map((cambio) => ({
      id: cambio.id,
      tipo: 'estado' as const,
      fecha: cambio.fecha,
      detalle: cambio.motivo
        ? `Cambio de estado: ${cambio.de} → ${cambio.a}. Motivo: ${cambio.motivo}`
        : `Cambio de estado: ${cambio.de} → ${cambio.a}`,
      estadoAnterior: cambio.de,
      estadoNuevo: cambio.a,
      motivo: cambio.motivo,
    })),
  ]

  const cierres = expediente.cierres ?? (
    expediente.fechaCierre
      ? [{ fecha: expediente.fechaCierre, motivo: expediente.motivoCierre ?? '' }]
      : historial
          .filter((entrada) => entrada.tipo === 'estado' && entrada.estadoNuevo === 'Cerrado')
          .map((entrada) => ({
            fecha: entrada.fecha,
            motivo: entrada.motivo ?? '',
          }))
  )

  const {
    cierres: _cierresAnteriores,
    historial: _historialAnterior,
    motivoCierre: _motivoCierre,
    fechaCierre: _fechaCierre,
    actividades: _actividadesAnteriores,
    cambiosEstado: _cambiosAnteriores,
    ...datos
  } = expediente

  return { ...datos, cierres, historial }
}

function obtenerDatosGuardados(): ExpedienteGuardado[] {
  const guardados = localStorage.getItem(CLAVE)
  return guardados === null
    ? (baseDatos.expedientes as ExpedienteGuardado[])
    : (JSON.parse(guardados) as ExpedienteGuardado[])
}

export function obtenerExpedientes(): Expediente[] {
  return obtenerDatosGuardados().map(normalizar)
}

export function guardarExpedientes(lista: Expediente[]): void {
  localStorage.setItem(CLAVE, JSON.stringify(lista))
}

export function obtenerExpediente(id: string): Expediente | undefined {
  return obtenerExpedientes().find((expediente) => expediente.id === id)
}

export function actualizarExpediente(expediente: Expediente): void {
  const lista = obtenerExpedientes()
  if (!lista.some((actual) => actual.id === expediente.id)) {
    throw new Error(`No existe el expediente ${expediente.id}.`)
  }
  guardarExpedientes(lista.map((actual) =>
    actual.id === expediente.id ? expediente : actual,
  ))
}

export function generarId(): string {
  const mayor = obtenerExpedientes().reduce((maximo, expediente) => {
    const numero = Number.parseInt(expediente.id.replace('EXP-', ''), 10)
    return Number.isNaN(numero) ? maximo : Math.max(maximo, numero)
  }, 0)
  return `EXP-${String(mayor + 1).padStart(4, '0')}`
}

export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleString('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
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

const estaVacio = (texto: string | undefined) => !texto || texto.trim() === ''

function nuevaEntrada(
  tipo: EntradaHistorial['tipo'],
  detalle: string,
  extra: Partial<EntradaHistorial> = {},
): EntradaHistorial {
  return {
    id: crypto.randomUUID(),
    tipo,
    fecha: new Date().toISOString(),
    detalle,
    ...extra,
  }
}

function entradaEstado(
  anterior: Estado | undefined,
  nuevo: Estado,
  detalle: string,
  motivo?: string,
): EntradaHistorial {
  return nuevaEntrada('estado', detalle, {
    estadoAnterior: anterior,
    estadoNuevo: nuevo,
    motivo,
  })
}

function error(mensaje: string): Resultado {
  return { ok: false, mensaje }
}

function guardarYResponder(expediente: Expediente, mensaje: string): Resultado {
  actualizarExpediente(expediente)
  return { ok: true, expediente, mensaje }
}

interface NuevoExpediente {
  alias: string
  descripcion: string
  responsable: string
  categoria: Categoria
}

export function crearExpediente(datos: NuevoExpediente): Expediente {
  const fechaApertura = new Date().toISOString()
  const expediente: Expediente = {
    id: generarId(),
    alias: datos.alias.trim(),
    descripcion: datos.descripcion.trim(),
    responsable: datos.responsable.trim(),
    categoria: datos.categoria,
    fechaApertura,
    estado: 'Abierto',
    cierres: [],
    historial: [
      {
        id: crypto.randomUUID(),
        tipo: 'apertura',
        fecha: fechaApertura,
        detalle: 'Expediente abierto',
      },
    ],
  }
  guardarExpedientes([...obtenerExpedientes(), expediente])
  return expediente
}

export function agregarActividad(
  id: string,
  descripcion: string,
  tipoActividad?: string,
): Resultado {
  const expediente = obtenerExpediente(id)
  if (!expediente) return error('El expediente no existe.')
  if (expediente.estado === 'Cerrado') {
    return error('El expediente está cerrado y no admite nuevas actividades. Reábralo primero.')
  }
  if (estaVacio(descripcion)) {
    return error('Ingrese la descripción de la actividad; no puede estar vacía.')
  }

  const actualizado: Expediente = {
    ...expediente,
    historial: [
      ...expediente.historial,
      nuevaEntrada('actividad', descripcion.trim(), {
        tipoActividad: tipoActividad?.trim() || undefined,
      }),
    ],
  }
  return guardarYResponder(actualizado, 'Actividad registrada correctamente.')
}

export function pasarASeguimiento(id: string): Resultado {
  const expediente = obtenerExpediente(id)
  if (!expediente) return error('El expediente no existe.')
  if (expediente.estado !== 'Abierto') {
    return error(`Solo un expediente Abierto puede pasar a En seguimiento (estado actual: ${expediente.estado}).`)
  }

  const actualizado: Expediente = {
    ...expediente,
    estado: 'En seguimiento',
    historial: [
      ...expediente.historial,
      entradaEstado('Abierto', 'En seguimiento', 'Cambio de estado: Abierto → En seguimiento'),
    ],
  }
  return guardarYResponder(actualizado, 'El expediente pasó a En seguimiento.')
}

export function cerrarExpediente(id: string, motivo: string): Resultado {
  const expediente = obtenerExpediente(id)
  if (!expediente) return error('El expediente no existe.')
  if (expediente.estado !== 'En seguimiento') {
    return error(`Solo se puede cerrar un expediente En seguimiento (estado actual: ${expediente.estado}).`)
  }
  if (!obtenerActividades(expediente).length) {
    return error('Para cerrar, el expediente debe tener al menos una actividad registrada.')
  }
  if (estaVacio(motivo)) {
    return error('Ingrese el motivo de cierre; no puede estar vacío.')
  }

  const fecha = new Date().toISOString()
  const motivoLimpio = motivo.trim()
  const actualizado: Expediente = {
    ...expediente,
    estado: 'Cerrado',
    cierres: [...expediente.cierres, { fecha, motivo: motivoLimpio }],
    historial: [
      ...expediente.historial,
      entradaEstado(
        'En seguimiento',
        'Cerrado',
        `Expediente cerrado. Motivo: ${motivoLimpio}`,
        motivoLimpio,
      ),
    ],
  }
  return guardarYResponder(actualizado, 'Expediente cerrado correctamente.')
}

export function reabrirExpediente(id: string, motivo: string): Resultado {
  const expediente = obtenerExpediente(id)
  if (!expediente) return error('El expediente no existe.')
  if (expediente.estado !== 'Cerrado') {
    return error(`Solo se pueden reabrir expedientes Cerrados (estado actual: ${expediente.estado}).`)
  }
  if (estaVacio(motivo)) {
    return error('Ingrese el motivo de reapertura; no puede estar vacío.')
  }

  const motivoLimpio = motivo.trim()
  const actualizado: Expediente = {
    ...expediente,
    estado: 'En seguimiento',
    historial: [
      ...expediente.historial,
      entradaEstado(
        'Cerrado',
        'En seguimiento',
        `Expediente reabierto. Motivo: ${motivoLimpio}`,
        motivoLimpio,
      ),
    ],
  }
  return guardarYResponder(actualizado, 'Expediente reabierto. Ya admite nuevas actividades.')
}
