# Bufete Popular · Expedientes

Aplicación React para registrar y consultar expedientes ficticios. Incluye
listado con búsqueda y filtro, apertura de expedientes, detalle, registro de
actividades, cambios de estado, cierre y un historial unificado.

## Base de datos simulada

`src/data/api.json` contiene los datos ficticios iniciales de la aplicación.
Al abrirla por primera vez, el listado lee esos expedientes; los cambios
posteriores se guardan en `localStorage` del navegador bajo la clave
`expedientes`. Es una simulación local, no un servidor API ni una base de datos
compartida entre usuarios.

Para volver a cargar los datos iniciales, borra la clave `expedientes` del
almacenamiento local del sitio desde las herramientas del navegador.

## Desarrollo

```sh
npm install
npm run dev
```

Comprobaciones disponibles:

```sh
npm run build
npm run lint
```
