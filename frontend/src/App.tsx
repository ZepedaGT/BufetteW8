import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import DetalleExpediente from "./pages/DetalleExpediente";
import ListadoExpedientes from "./pages/ListadoExpedientes";
import NuevoExpediente from "./pages/NuevoExpediente";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ListadoExpedientes />} />
          <Route path="/nuevo" element={<NuevoExpediente />} />
          <Route path="/expediente/:id" element={<DetalleExpediente />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
