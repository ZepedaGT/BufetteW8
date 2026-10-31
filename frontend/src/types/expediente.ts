export type Estado = 'Abierto' | 'En seguimiento' | 'Cerrado'
export type Categoria = '' | 'Civil' | 'Familiar' | 'Laboral'

export interface Actividad {
  id: string
  descripcion: string
  fecha: string
  tipo?: string
}

export interface EntradaHistorial {
  id: string
  tipo: 'apertura' | 'estado' | 'actividad'
  fecha: string // ISO
  detalle: string
  tipoActividad?: string
  estadoAnterior?: Estado // solo en cambios de estado
  estadoNuevo?: Estado
  motivo?: string // cierre o reapertura
}

export interface Cierre {
  fecha: string // ISO
  motivo: string
}

export interface Expediente {
  id: string
  alias: string
  descripcion: string
  responsable: string
  categoria: Categoria
  fechaApertura: string // ISO
  estado: Estado
  cierres: Cierre[] // todos los cierres; nunca se reemplazan
  historial: EntradaHistorial[]
}

export type Resultado =
  | { ok: true; expediente: Expediente; mensaje: string }
  | { ok: false; mensaje: string }