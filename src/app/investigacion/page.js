'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function Investigacion() {
  const [seccionActual, setSeccionActual] = useState('Buenas Prácticas');

  // Datos de ejemplo para Buenas Prácticas y Conferencias (6 elementos cada uno)
  const buenasPracticas = [
    { id: 1, title: 'Buenas Prácticas en Hidrología', description: 'Guía para aplicar buenas prácticas en proyectos hidrológicos.' },
    { id: 2, title: 'Optimización de Simulaciones', description: 'Técnicas para mejorar la eficiencia en simulaciones hidrológicas.' },
    { id: 3, title: 'Gestión Eficiente de Recursos Hídricos', description: 'Estrategias para optimizar el uso del agua en proyectos civiles.' },
    { id: 4, title: 'Diseño de Infraestructura de Drenaje', description: 'Mejores prácticas en la planificación de sistemas de drenaje en la ingeniería civil.' },
    { id: 5, title: 'Mantenimiento Preventivo de Presas', description: 'Procedimientos para garantizar la seguridad y eficiencia de presas y estructuras hidráulicas.' },
    { id: 6, title: 'Integración de Tecnologías en Control Hídrico', description: 'Uso de sensores y sistemas automatizados en la gestión del agua.' },
  ];

  const conferencias = [
    { id: 1, title: 'Conferencia Internacional de Hidrología', date: '10 de Noviembre, 2024', link: '/conferencias/conferencia-internacional' },
    { id: 2, title: 'Workshop de Simulaciones', date: '25 de Diciembre, 2024', link: '/conferencias/workshop-simulaciones' },
    { id: 3, title: 'Seminario de Ingeniería Civil y Recursos Hídricos', date: '15 de Enero, 2025', link: '/conferencias/seminario-ingenieria-hidrica' },
    { id: 4, title: 'Congreso de Control Hídrico y Sustentabilidad', date: '05 de Marzo, 2025', link: '/conferencias/congreso-control-hidrico' },
    { id: 5, title: 'Foro de Innovación en Infraestructura Civil', date: '20 de Abril, 2025', link: '/conferencias/foro-innovacion-infraestructura' },
    { id: 6, title: 'Cumbre Internacional de Ingeniería Civil', date: '30 de Mayo, 2025', link: '/conferencias/cumbre-ingenieria-civil' },
  ];

  return (
    <div className="py-8 bg-gradient-to-r from-blue-100">
      <section className="py-8 bg-gradient-to-r from-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título principal */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold mb-2 text-blue-800">Investigación</h1>
            <p className="text-lg text-gray-800 mb-6">
              Explora las mejores prácticas y participa en conferencias relacionadas con hidrología, ingeniería civil y control hídrico.
            </p>
          </div>

          {/* Botones para cambiar entre secciones */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setSeccionActual('Buenas Prácticas')}
              className={`px-4 py-2 mx-2 font-semibold rounded-lg transition-colors duration-300 ${
                seccionActual === 'Buenas Prácticas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
              }`}
            >
              Buenas Prácticas
            </button>
            <button
              onClick={() => setSeccionActual('Conferencias')}
              className={`px-4 py-2 mx-2 font-semibold rounded-lg transition-colors duration-300 ${
                seccionActual === 'Conferencias'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
              }`}
            >
              Conferencias
            </button>
          </div>

          {/* Renderizado condicional de secciones */}
          {seccionActual === 'Buenas Prácticas' && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-4 text-blue-800 text-center">Buenas Prácticas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {buenasPracticas.map((practica) => (
                  <div
                    key={practica.id}
                    className="bg-white shadow-lg rounded-lg p-4 text-center transform transition-transform duration-300 hover:scale-105"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{practica.title}</h3>
                    <p className="text-gray-700 mb-4">{practica.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {seccionActual === 'Conferencias' && (
            <div>
              <h2 className="text-3xl font-bold mb-4 text-blue-800 text-center">Conferencias</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {conferencias.map((conferencia) => (
                  <div
                    key={conferencia.id}
                    className="bg-white shadow-lg rounded-lg p-4 text-center transform transition-transform duration-300 hover:scale-105"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{conferencia.title}</h3>
                    <p className="text-gray-700 mb-2">{conferencia.date}</p>
                    <Link href={conferencia.link} target="_blank" rel="noopener noreferrer">
                      <button className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-3 rounded-lg">
                        Ver más detalles
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
