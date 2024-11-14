'use client';


export default function home() {
  return (
    <div className="bg-gray-100">
      {/* Banner de bienvenida */}
      <section className="relative bg-cover bg-center h-screen" style={{ backgroundImage: "url('/images/path-to-banner-image.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">LABORATORIO VIRTUAL DE HIDROLOGÍA</h1>
            <p className="text-lg">Explora y experimenta con simulaciones hidrológicas en un entorno académico interactivo.</p>
          </div>
        </div>
      </section>

      <section
        className="relative bg-no-repeat bg-center bg-white py-14"
        style={{ backgroundImage: "url('/images/universidades.png')" }}
      >
  
      </section>

      {/* Sección de qué es */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-blue-700 text-left">¿Qué es?</h2>
          <p className="text-lg text-gray-700 mb-6 text-left">
            El laboratorio virtual de hidrología (HYDROLAB) es una iniciativa académica que tiene por finalidad proporcionar
            a estudiantes y profesionales un medio que permita observar, experimentar y comprender el comportamiento de un
            sistema hidrológico y la interrelación de las variables en este involucradas.
          </p>
          <p className="text-lg text-gray-700 mb-6 text-left">HYDROLAB posee tres tipos de herramientas:</p>
          <ul className="list-disc list-inside text-left text-lg text-gray-700 space-y-2">
            <li>Análisis de datos, que le permiten al usuario realizar análisis de consistencia, modelamiento de series históricas y estimación de información faltante.</li>
            <li>Simulación de procesos, que permiten estudiar cada una de las fases del ciclo hidrológico y el efecto de la variación de sus parámetros.</li>
            <li>Diseño de obras relacionadas a la hidrología, la hidráulica y la ingeniería fluvial, que se constituyen en una herramienta de apoyo para el proyectista.</li>
          </ul>
          <p className="text-lg text-gray-700 mt-6 text-left">
            HYDROLAB posee una interfaz amigable e interactiva, permite la colaboración e intercambio de información entre los usuarios mediante las tecnologías de la WEB 2.0, constituyéndose en un recurso didáctico invaluable en el estudio de la hidrología.
          </p>
          <p className="mt-6 text-gray-900 font-bold text-left">Fernando Oñate-Valdivieso, Ph.D.</p>
          <p className="text-blue-500 text-left"><a href="mailto:fronate.v@gmail.com">fronate.v@gmail.com</a></p>
        </div>
      </section>


      {/* Sección de Herramientas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Herramientas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-xl font-bold mb-4">Análisis de Datos</h3>
              <p className="text-gray-600">Realiza análisis de consistencia, modelamiento de series históricas y estimación de información faltante.</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-xl font-bold mb-4">Simulación de Procesos</h3>
              <p className="text-gray-600">Estudia cada una de las fases del ciclo hidrológico y el efecto de la variación de sus parámetros.</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-xl font-bold mb-4">Diseño de Obras Hidrológicas</h3>
              <p className="text-gray-600">Diseña obras relacionadas con la hidráulica y la ingeniería fluvial.</p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
