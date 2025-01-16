'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function Simulaciones() {
    const categorias = [
        'Análisis estocástico',
        'Evapotranspiración',
        'Hidráulica de Pozos',
        'Infiltrado',
        'Lluvia escorrentía',
        'Modelo de Lluvia Escorrentía',
        'Producción de sedimentos',
        'Simulación continua',
        'Tránsito de Avenidas',
        'Transporte de sedimentos',
    ];
    const categoriasDiseño = [
        'Hidráulica de canales',

    ];

    const categoriasAnali = [
        'Análisis Probabilístico',
        'Correlación Ortogonal',

    ];




    const simulaciones = [
        { id: 1, title: 'Balance Hídrico', description: 'Simulación del balance hídrico considerando diferentes parámetros.', link: '/Experimentos/BalanceHidrico', category: 'Análisis estocástico' },
        { id: 2, title: 'Blaney Criddle Global', description: 'Cálculo de evapotranspiración con el método global.', link: '/Experimentos/BlaneyCriddleGlobal', category: 'Evapotranspiración' },
        { id: 3, title: 'Blaney Criddle Parcial', description: 'Evapotranspiración en periodos parciales.', link: '/Experimentos/BlaneyCriddleParcial', category: 'Evapotranspiración' },
        { id: 4, title: 'Blaney Criddle Parcial Perenne', description: 'Evapotranspiración para cultivos perennes.', link: '/Experimentos/BlaneyCriddleParcialPerenne', category: 'Evapotranspiración' },
        { id: 5, title: 'Efecto de la Tormenta', description: 'Simula el efecto de tormentas e inundaciones.', link: '/Experimentos/EfectoTormenta', category: 'Lluvia escorrentía' },
        { id: 6, title: 'Hargreaves', description: 'Método de Hargreaves para calcular la evapotranspiración.', link: '/Experimentos/Hargreaves', category: 'Evapotranspiración' },
        { id: 7, title: 'Penman', description: 'Evapotranspiración potencial utilizando el método Penman.', link: '/Experimentos/Penman', category: 'Evapotranspiración' },
        { id: 8, title: 'Thorwaite', description: 'Estimación de evapotranspiración con Thorwaite.', link: '/Experimentos/Thorwaite', category: 'Evapotranspiración' },
        { id: 9, title: 'Turc', description: 'Evapotranspiración con el método de Turc.', link: '/Experimentos/Turc', category: 'Evapotranspiración' },
        { id: 10, title: 'Curva de Remanso Bakhmeteff', description: 'Simulación de remanso con Bakhmeteff.', link: '/Experimentos/CurvaRemazoBakhmeteff', category: 'Hidráulica de Pozos' },
        { id: 11, title: 'Resalto Hidráulico Circular', description: 'Cálculo de resaltos hidráulicos circulares.', link: '/Experimentos/ResaltoHidraulicoCircular', category: 'Hidráulica de Pozos' },
        { id: 12, title: 'Resalto Hidráulico Trapezoidal', description: 'Simulación del resalto hidráulico en canales trapezoidales.', link: '/Experimentos/ResaltoHidraulicoTrapezoidal', category: 'Hidráulica de Pozos' },
        { id: 13, title: 'Tirante Crítico Circular', description: 'Cálculo del tirante crítico en secciones circulares.', link: '/Experimentos/TiranteCriticoCircular', category: 'Hidráulica de Pozos' },
        { id: 14, title: 'Tirante Crítico Trapezoidal', description: 'Cálculo del tirante crítico en secciones trapezoidales.', link: '/Experimentos/TiranteCriticoTrapezoidal', category: 'Hidráulica de Pozos' },
        { id: 15, title: 'Tirante N Circular', description: 'Cálculo del tirante normal en secciones circulares.', link: '/Experimentos/TiranteNSeccionCircular', category: 'Simulación continua' },
        { id: 16, title: 'Tirante N Parabólica', description: 'Cálculo del tirante normal en secciones parabólicas.', link: '/Experimentos/TiranteNSeccionParabolica', category: 'Simulación continua' },
        { id: 17, title: 'Tirante N Trapezoidal', description: 'Cálculo del tirante normal en secciones trapezoidales.', link: '/Experimentos/TiranteNSeccionTrapezoidal', category: 'Simulación continua' },
        { id: 18, title: 'UNICA', description: 'Cálculo del tirante normal en secciones trapezoidales.', link: '/Experimentos/TiranteNSeccionTrapezoidal', category: 'Correlación Ortogonal' },
    ];


    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

    const simulacionesFiltradas =
        categoriaSeleccionada === 'Todas'
            ? simulaciones
            : simulaciones.filter((simulacion) => simulacion.category === categoriaSeleccionada);
    return (
        <section className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Menú lateral de categorías */}
                    <div className="bg-blue-800 text-white shadow-lg rounded-lg p-6 self-start">
                        <h2 className="text-2xl font-bold mb-6">Simulación</h2>
                        <ul>
                            <li
                                className={`mb-4 cursor-pointer categoria px-4 py-2 rounded-lg ${categoriaSeleccionada === 'Todas' ? 'bg-blue-700 text-white' : 'hover:bg-blue-100 hover:text-blue-700'
                                    }`}
                                onClick={() => setCategoriaSeleccionada('Todas')}
                            >
                                Todas
                            </li>
                            {categorias.map((categoria, index) => (
                                <li
                                    key={index}
                                    className={`mb-4 cursor-pointer categoria px-4 py-2 rounded-lg ${categoriaSeleccionada === categoria ? 'bg-blue-700 text-white' : 'hover:bg-blue-100 hover:text-blue-700'
                                        }`}
                                    onClick={() => setCategoriaSeleccionada(categoria)}
                                >
                                    {categoria}
                                </li>
                            ))}

                            <h2 className="text-2xl font-bold mb-6">Análisis</h2>
                            {categoriasAnali.map((categoria, index) => (
                                <li
                                    key={index}
                                    className={`mb-4 cursor-pointer categoria px-4 py-2 rounded-lg ${categoriaSeleccionada === categoria ? 'bg-blue-700 text-white' : 'hover:bg-blue-100 hover:text-blue-700'
                                        }`}
                                    onClick={() => setCategoriaSeleccionada(categoria)}
                                >
                                    {categoria}
                                </li>
                            ))}


                            <h2 className="text-2xl font-bold mb-6">Diseño</h2>


                            {categoriasDiseño.map((categoria, index) => (
                                <li
                                    key={index}
                                    className={`mb-4 cursor-pointer categoria px-4 py-2 rounded-lg ${categoriaSeleccionada === categoria ? 'bg-blue-700 text-white' : 'hover:bg-blue-100 hover:text-blue-700'
                                        }`}
                                    onClick={() => setCategoriaSeleccionada(categoria)}
                                >
                                    {categoria}
                                </li>
                            ))}

                        </ul>




                    </div>

                    {/* Aplicaciones existentes */}
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-bold mb-6 text-blue-800">Aplicaciones existentes</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {simulacionesFiltradas.length > 0 ? (
                                simulacionesFiltradas.map((simulacion) => (
                                    <div key={simulacion.id} className="bg-white shadow-lg rounded-lg p-6 transition-all transform hover:scale-105 hover:shadow-xl">
                                        <h3 className="text-xl mb-2 font-semibold text-gray-900">{simulacion.title}</h3>
                                        <p className="text-gray-700 mb-4">{simulacion.description}</p>
                                        <div className="mb-8">
                                            <Link href={simulacion.link}>
                                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                    Ver Simulación
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 font-semibold mt-4">
                                    <span role="img" aria-label="No hay simulaciones">📭</span> No hay simulaciones disponibles para esta categoría.
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );

}