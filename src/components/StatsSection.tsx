export default function StatsSection() {
  return (
    <section className="py-16 bg-green-800 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">150+</div>
            <div className="text-green-200">Jugadores Activos</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">25</div>
            <div className="text-green-200">Torneos Anuales</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">10</div>
            <div className="text-green-200">Años de Experiencia</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">5</div>
            <div className="text-green-200">Campos Disponibles</div>
          </div>
        </div>
      </div>
    </section>
  )
}





