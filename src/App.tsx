import { Routes, Route } from "react-router-dom"
import Inicio from "./pages/Inicio"
import Equipos from "./pages/Equipos"
import Jugadores from "./pages/Jugadores"
import TablaPosiciones from "./pages/TablaPosiciones"
import Navbar from "./components/NavBar"
import Footer from "./components/Footer"

function App() {
  return (
    <div>
      <Navbar />

      <main className="container" style={{ paddingTop: "100px" }}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/jugadores" element={<Jugadores />} />
          <Route path="/tablaposiciones" element={<TablaPosiciones />} />
        </Routes>
      </main>

      {/* ✅ Footer agregado al final */}
      <Footer />
    </div>
  )
}

export default App
