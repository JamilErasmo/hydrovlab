'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function RecursosAcademicos() {
  // Estado para la categoría seleccionada
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');

  // Lista de categorías
  const categorias = ['Todos', 'Manuales', 'Simulaciones', 'Laboratorios'];

  // Lista de recursos con categorías asociadas
  const recursos = [
    { id: 1, title: 'Manual de Hidrología', description: 'Guía detallada sobre hidrología aplicada.', category: 'Manuales', link: '/recursos/manual-hidrologia.pdf' },
    { id: 2, title: 'Guía de Simulaciones', description: 'Instrucciones paso a paso para realizar simulaciones.', category: 'Simulaciones', link: '/recursos/guia-simulaciones.pdf' },
    { id: 3, title: 'Prácticas de Laboratorio', description: 'Conjunto de prácticas para el laboratorio virtual.', category: 'Laboratorios', link: '/recursos/practicas-laboratorio.pdf' },
  ];

  // Filtrar los recursos según la categoría seleccionada
  const recursosFiltrados = categoriaSeleccionada === 'Todos'
    ? recursos
    : recursos.filter(recurso => recurso.category === categoriaSeleccionada);

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-blue-700">Recursos Académicos</h1>
          <p className="text-lg text-gray-700 mb-8">
            Encuentra aquí manuales, guías y otros recursos útiles para tus estudios.
          </p>
        </div>

        {/* Filtro de categorías */}
        <div className="mb-8 flex justify-center">
          <select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de recursos filtrados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recursosFiltrados.length > 0 ? (
            recursosFiltrados.map((recurso) => (
              <div key={recurso.id} className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{recurso.title}</h3>
                <p className="text-gray-700 mb-4">{recurso.description}</p>
                <Link href={recurso.link} target="_blank" rel="noopener noreferrer">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Ver recurso
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No se encontraron recursos en esta categoría.</p>
          )}
        </div>
      </div>
    </section>
  );
}
