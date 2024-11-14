import Link from 'next/link';

export default function Investigacion() {
  // Datos de ejemplo para Buenas Prácticas y Conferencias
  const buenasPracticas = [
    { id: 1, title: 'Buenas Prácticas en Hidrología', description: 'Guía para aplicar buenas prácticas en proyectos hidrológicos.' },
    { id: 2, title: 'Optimización de Simulaciones', description: 'Técnicas para mejorar la eficiencia en simulaciones hidrológicas.' },
  ];

  const conferencias = [
    { id: 1, title: 'Conferencia Internacional de Hidrología', date: '10 de Noviembre, 2024', link: '/conferencias/conferencia-internacional' },
    { id: 2, title: 'Workshop de Simulaciones', date: '25 de Diciembre, 2024', link: '/conferencias/workshop-simulaciones' },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título principal */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-blue-700">Investigación</h1>
          <p className="text-lg text-gray-700 mb-8">Explora las mejores prácticas y participa en conferencias relacionadas con hidrología.</p>
        </div>

        {/* Sección de Buenas Prácticas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Buenas Prácticas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {buenasPracticas.map((practica) => (
              <div key={practica.id} className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{practica.title}</h3>
                <p className="text-gray-700 mb-4">{practica.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de Conferencias */}
        <div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Conferencias</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {conferencias.map((conferencia) => (
              <div key={conferencia.id} className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{conferencia.title}</h3>
                <p className="text-gray-700 mb-2">{conferencia.date}</p>
                <Link href={conferencia.link}>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Ver más detalles
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
