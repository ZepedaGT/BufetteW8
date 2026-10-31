# Bufete Popular · Expedientes

Aplicación web para administrar expedientes jurídicos ficticios. Integra el
listado y búsqueda, apertura, detalle, registro de actividades, flujo de
estados, cierres, reaperturas e historial cronológico.

## Tecnologías

- React, Vite y TypeScript
- Tailwind CSS y Lucide React
- React Router DOM
- React Hook Form y Zod
- `localStorage` como persistencia local simulada

## Datos de prueba

`src/data/api.json` contiene los expedientes ficticios iniciales. La aplicación
los utiliza cuando no existe información guardada en el navegador; después,
los cambios se persisten en `localStorage` bajo la clave `expedientes`.

El almacenamiento es local al navegador y no constituye una API ni una base de
datos compartida. Para restaurar los datos iniciales, elimina la clave
`expedientes` desde las herramientas de almacenamiento del navegador.

## Flujo de expedientes

- Un expediente nuevo comienza en **Abierto**.
- Un expediente abierto puede pasar a **En seguimiento**.
- Solo un expediente en seguimiento, con al menos una actividad y un motivo,
  puede cerrarse.
- Un expediente cerrado puede reabrirse con un motivo; vuelve a **En
  seguimiento** y conserva sus actividades y cierres anteriores.
- Las actividades y transiciones se muestran en el historial cronológico.

## Desarrollo

Ejecuta estos comandos desde la carpeta `frontend`:

```sh
npm install
npm run dev
```

Para validar cambios:

```sh
npm run build
npm run lint
```

## Contexto del proyecto

La aplicación está dirigida a asesores y estudiantes de un bufete popular. El
proyecto prioriza datos ficticios, validación de formularios, reglas de estado
centralizadas y conservación del historial de cada expediente.
