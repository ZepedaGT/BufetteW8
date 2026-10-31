export type Estado = 'Abierto' | 'En seguimiento' | 'Cerrado'
export type Categoria = '' | 'Civil' | 'Familiar' | 'Laboral'

export interface EntradaHistorial {
  id: string
  tipo: 'estado' | 'actividad'
  fecha: string // ISO
  detalle: string
  tipoActividad?: string
}

export interface Expediente {
  id: string
  alias: string
  descripcion: string
  responsable: string
  categoria: Categoria
  fechaApertura: string // ISO
  estado: Estado
  motivoCierre?: string
  fechaCierre?: string
  historial: EntradaHistorial[]
}