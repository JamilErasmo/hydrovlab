'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';

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
        { id: 1, title: 'Balance Hídrico', description: 'Simulación del balance hídrico considerando diferentes parámetros.', link: '/Experimentos/BalanceHidrico', category: 'Evapotranspiración' },
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
        { id: 20, title: 'INFILTRACIÓN GREEN-AMPT', description: 'DETERMINA LA TASA DE INFILTRACIÓN E INFILTRACIÓN ACUMULADA POR EL MÉTODO DE GREEN-AMPT CON LAS CARACTERÍSTICAS DEL SUELO Y SUS CONDICIONES INSTANTÁNEAS VÍDEO', link: '/Experimentos/CurvaRemazoBakhmeteff', category: 'Infiltación' },
        { id: 21, title: 'INFILTRACIÓN HORTON', description: 'DETERMINA LA TASA DE INFILTRACIÓN E INFILTRACIÓN ACUMULADA POR EL MÉTODO DE HORTON CON LAS CARACTERÍSTICAS DEL SUELO Y SUS CONDICIONES INSTANTÁNEAS VÍDEO', link: '/Experimentos/CurvaRemazoBakhmeteff', category: 'Infiltación' },
        { id: 22, title: 'INFILTRACIÓN RICHARD-PHILLIPS', description: 'DETERMINA LA TASA DE INFILTRACIÓN E INFILTRACIÓN ACUMULADA POR EL MÉTODO DE PHILIP CON LAS CARACTERÍSTICAS DEL SUELO Y SUS CONDICIONES INSTANTÁNEAS VÍDEO', link: '/Experimentos/CurvaRemazoBakhmeteff', category: 'Infiltación' },
        { id: 23, title: 'INFILTRACIÓN ÍNDICE FI', description: 'DETERMINA LA TASA DE INFILTRACIÓN E INFILTRACIÓN ACUMULADA POR EL MÉTODO DE SWI CON LAS CARACTERÍSTICAS DEL SUELO Y SUS CONDICIONES INSTANTÁNEAS VÍDEO', link: '/Experimentos/CurvaRemazoBakhmeteff', category: 'Infiltación' },
        { id: 24, title: 'Efecto de la precipitación efectiva en la tormenta', description: 'Simula el efecto que produce la PRECIPITACIÓN EFECTIVA en la tormenta mediante el HIDROGRAMA TRIANGULAR y el HIDROGRAMA DEL S.C.S. para un máximo de 5 comparaciones. Foro', link: '/Experimentos/CurvaRemazoBakhmeteff', category: 'Lluvia escorrentía' },
        { id: 25, title: 'Efecto de la duración en la tormenta', description: 'Simula el efecto que produce la DURACIÓN EFECTIVA en la tormenta mediante el HIDROGRAMA TRIANGULAR y el HIDROGRAMA DEL S.C.S. para un máximo de 5 comparaciones. Foro', link: '/Experimentos/CurvaRemazoBakhmeteff', category: 'Lluvia escorrentía' },
        { id: 26, title: 'Efecto de el uso y tipo del suelo en la tormenta', description: 'Simula el efecto que produce el uso del suelo mediante el NUMERO DE LA CURVA en la tormenta mediante el HIDROGRAMA TRIANGULAR y el HIDROGRAMA DEL S.C.S. para un máximo de 5 comparaciones. Foro', link: '/Experimentos/CurvaRemazoBakhmeteff', category: 'Lluvia escorrentía' },
        { id: 27, title: 'Hidrograma unitario de máxima crecida', description: 'Determina el hidrograma de máxima crecida mediante los HIDROGRAMAS TRIANGULAR y del S.C.S.  con las características hidrológicas de la Cuenca. Foro', link: '/Experimentos/CurvaRemazoBakhmeteff', category: 'Lluvia escorrentía' },
        { id: 28, title: 'Método de Fleming', description: 'Permite calcular la producción de sedimentos en una cuenca hidrográfica en base a las características de su cobertura y al caudal medio que ésta presenta. Foro', link: '/Experimentos/CurvaRemazoBakhmeteff', category: 'Producción de sedimentos' },
        { id: 29, title: 'Método de Fournier', description: 'Calcula la producción de sedimentos en una cuenca hidrográfica en base a la precipitación y el relieve. Foro', link: '/Experimentos/CurvaRemazoBakhmeteff', category: 'Producción de sedimentos' },
        { id: 30, title: 'Transporte de Sedimentos', description: 'Permite calcular el material transportado por la corriente, tanto dentro de la capa de fondo como en suspensión.  Se pueden aplicar los métodos de Colby, Engelund-Hasen, Shen-Hung, Yang, Ackers-White, Brownlie, Karim-Kénnedy y Graf -Acaroglu. Foro', link: '/Experimentos/CurvaRemazoBakhmeteff', category: 'Transporte de sedimentos' },
        { id: 31, title: 'CurvaRemazoBakhmeteff', description: 'POR DEFECTO', link: '/Experimentos/CurvaRemazoBakhmeteff', category: 'Hidráulica de canales' },
        { id: 32, title: 'CurvaRemazoTramos', description: 'POR DEFECTO', link: '/Experimentos/CurvaRemazoTramos', category: 'Hidráulica de canales' },
        { id: 33, title: 'RaizEcuacion', description: 'POR DEFECTO', link: '/Experimentos/RaizEcuacion', category: 'Hidráulica de canales' },
        { id: 38, title: 'TiranteNSeccionCircular', description: 'POR DEFECTO', link: '/Experimentos/TiranteNSeccionCircular', category: 'Hidráulica de canales' },
        { id: 39, title: 'TiranteNSeccionParabolica', description: 'POR DEFECTO', link: '/Experimentos/TiranteNSeccionParabolica', category: 'Hidráulica de canales' },
        { id: 40, title: 'TiranteNSeccionTrapezoidal', description: 'POR DEFECTO', link: '/Experimentos/TiranteNSeccionTrapezoidal', category: 'Hidráulica de canales' },
        { id: 41, title: 'MetodoDupuitCon', description: 'POR DEFECTO', link: '/Experimentos/MetodoDupuitCon', category: 'Hidráulica de Pozos' },
        { id: 42, title: 'MetodoDupuitSin', description: 'POR DEFECTO', link: '/Experimentos/MetodoDupuitSin', category: 'Hidráulica de Pozos' },
        { id: 43, title: 'MetodoThiemCon', description: 'POR DEFECTO', link: '/Experimentos/MetodoThiemCon', category: 'Hidráulica de Pozos' },
        { id: 44, title: 'MetodoThiemSin', description: 'POR DEFECTO', link: '/Experimentos/MetodoThiemSin', category: 'Hidráulica de Pozos' },
        { id: 45, title: 'InfiltracionMetodoIndice', description: 'POR DEFECTO', link: '/Experimentos/InfiltracionMetodoIndice', category: 'Infiltracion' },
        { id: 46, title: 'InfiltracionModeloGreen', description: 'POR DEFECTO', link: '/Experimentos/InfiltracionModeloGreen', category: 'Infiltracion' },
        { id: 47, title: 'InfiltracionModeloHorton', description: 'POR DEFECTO', link: '/Experimentos/InfiltracionModeloHorton', category: 'Infiltracion' },
        { id: 48, title: 'InfiltracionModeloRichards', description: 'POR DEFECTO', link: '/Experimentos/InfiltracionModeloRichards', category: 'Infiltracion' },
        { id: 49, title: 'InfiltracionNumeroCurva', description: 'POR DEFECTO', link: '/Experimentos/InfiltracionNumeroCurva', category: 'Infiltracion' },
        { id: 50, title: 'EfectoDuracionTormenta', description: 'POR DEFECTO', link: '/Experimentos/EfectoDuracionTormenta', category: 'Lluvia escorrentía' },
        { id: 51, title: 'EfectoPrecipitacion', description: 'POR DEFECTO', link: '/Experimentos/EfectoPrecipitacion', category: 'Lluvia escorrentía' },
        { id: 52, title: 'EfectoSuelo', description: 'POR DEFECTO', link: '/Experimentos/EfectoSuelo', category: 'Lluvia escorrentía' },
        { id: 53, title: 'HidrogramaUnitario', description: 'POR DEFECTO', link: '/Experimentos/HidrogramaUnitario', category: 'Lluvia escorrentía' },
        { id: 54, title: 'EcuacionUniversal', description: 'POR DEFECTO', link: '/Experimentos/EcuacionUniversal', category: 'Producción de sedimentos' },
        { id: 57, title: 'MetodoMuskingum', description: 'POR DEFECTO', link: '/Experimentos/MetodoMuskingum', category: 'Tránsito de Avenidas' },
        { id: 58, title: 'MetodoMuskingumCunge', description: 'POR DEFECTO', link: '/Experimentos/MetodoMuskingumCunge', category: 'Tránsito de Avenidas' },
        { id: 59, title: 'MetodoOnda', description: 'POR DEFECTO', link: '/Experimentos/MetodoOnda', category: 'Tránsito de Avenidas' },
        { id: 60, title: 'MetodoPiscina', description: 'POR DEFECTO', link: '/Experimentos/MetodoPiscina', category: 'Tránsito de Avenidas' }
    ];



    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
    const [busqueda, setBusqueda] = useState('');


    const simulacionesFiltradas = simulaciones.filter(
        (simulacion) =>
            (categoriaSeleccionada === 'Todas' || simulacion.category === categoriaSeleccionada) &&
            (simulacion.title?.toLowerCase().includes(busqueda?.toLowerCase() || '') ||
                simulacion.description?.toLowerCase().includes(busqueda?.toLowerCase() || ''))
    );


    return (
        <section className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Barra de búsqueda */}
                <div className="flex justify-end items-center mb-6">
                    <div className="relative w-full max-w-sm">
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar simulación..."
                            className="w-full p-2 pl-10 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>
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