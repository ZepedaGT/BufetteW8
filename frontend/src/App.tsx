import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NuevoExpediente from "./pages/NuevoExpediente";

function Pendiente({ texto }: { texto: string }) {
  return <p className="text-gray-500">{texto}</p>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Parte 2 reemplaza esta ruta por el listado */}
          <Route path="/" element={<Pendiente texto="Listado (Parte 2)" />} />
          <Route path="/nuevo" element={<NuevoExpediente />} />
          {/* Parte 2/3: detalle */}
          <Route
            path="/expediente/:id"
            element={<Pendiente texto="Detalle (Parte 2 y 3)" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
