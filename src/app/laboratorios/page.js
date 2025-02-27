'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';

export default function Simulaciones() {
    const categorias = [
        'Análisis estocástico',
        'Evapotranspiración',
        'Hidráulica de Pozos',
        'Infiltración',
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
        { id: 5, title: 'Hargreaves', description: 'Método de Hargreaves para calcular la evapotranspiración.', link: '/Experimentos/Hargreaves', category: 'Evapotranspiración' },
        { id: 6, title: 'Penman', description: 'Evapotranspiración potencial utilizando el método Penman.', link: '/Experimentos/Penman', category: 'Evapotranspiración' },
        { id: 7, title: 'Thorwaite', description: 'Estimación de evapotranspiración con Thorwaite.', link: '/Experimentos/Thorwaite', category: 'Evapotranspiración' },
        { id: 8, title: 'Turc', description: 'Evapotranspiración con el método de Turc.', link: '/Experimentos/Turc', category: 'Evapotranspiración' },

        { id: 9, title: 'Método de Thiem: Sin pozos de observación', description: 'Permite simular en régimen permanente el funcionamiento de pozos de extracción implantados en acuífero confinado, facilitando la determinación de: radios de influencia (R), caudal de extracción (Q), curva de abatimientos, entre otros.', link: '/Experimentos/ThiemSin', category: 'Hidráulica de Pozos' },
        { id: 10, title: 'Método de Dupuit: Sin pozos de observación', description: 'Permite simular en régimen permanente el funcionamiento de pozos de extracción implantados en acuífero no confinado, facilitando la determinación de: radios de influencia (R), caudal de extracción (Q), curva de abatimientos, entre otros.', link: '/Experimentos/DupuitSin', category: 'Hidráulica de Pozos' },
        { id: 11, title: 'Método de Thiem: Con pozos de observación', description: 'Permite simular en régimen permanente el funcionamiento de pozos  de extracción y de observación implantados en acuífero confinado, facilitando la determinación de: radios de influencia (R), caudal de extracción (Q), curva de abatimientos, entre otros.', link: '/Experimentos/ThiemCon', category: 'Hidráulica de Pozos' },
        { id: 12, title: 'Método de Dupuit: Con pozos de observación', description: 'Permite simular en régimen permanente el funcionamiento de pozos  de extracción y de observación implantados en acuífero no confinado, facilitando la determinación de: radios de influencia (R), caudal de extracción (Q), curva de abatimientos, entre otros.', link: '/Experimentos/MetodoDupuitCon', category: 'Hidráulica de Pozos' },
        { id: 13, title: 'Método de Theis: Determinación de caudal de extracción (Q) y de abatimientos (z)', description: 'Permite simular en régimen no permanente el funcionamiento de pozos  de extracción y de observación implantados en acuífero confinado, facilitando la determinación de: caudal de extracción (Q), curva de abatimientos, producto de la explotación del acuífero.', link: '/Experimentos/MetodoTheis', category: 'Hidráulica de Pozos' },

        { id: 14, title: 'Infiltración SCS', description: 'Determina la precipitación efectiva y la retención por el método SCS con los características hidrológicas de la cuenca', link: '/Experimentos/InfiltracionCurva', category: 'Infiltración' },
        { id: 15, title: 'Infiltración GREEN-AMPT', description: 'Determina la tasa de infiltración e infiltración acumulada por el método de GREEN-AMPT con las características del suelo y sus condiciones instantáneas.', link: '/Experimentos/InfiltracionModeloGreen', category: 'Infiltración' },
        { id: 16, title: 'Infiltración HORTON', description: 'Determina el volumen de infiltración con la ecuación de Horton, con las capacidades de infiltración.', link: '/Experimentos/InfiltracionModeloHorton', category: 'Infiltración' },
        { id: 17, title: 'Infiltración RICHARD-PHILLIPS', description: 'Determina la infiltración acumulada por el método de Richad-Phillips, con las características del suelo.', link: '/Experimentos/InfiltracionModeloRichards', category: 'Infiltración' },
        { id: 18, title: 'Infiltración Índice FI', description: 'Determina la infiltración media de una cuenca con el índice de infiltración FI, a través de un hidrograma y un hietograma.', link: '/Experimentos/InfiltracionMetodoIndice', category: 'Infiltración' },

        { id: 19, title: 'Efecto de la precipitación efectiva en la tormenta', description: 'Simula el efecto que produce la PRECIPITACIÓN EFECTIVA en la tormenta mediante el HIDROGRAMA TRIANGULAR y el HIDROGRAMA DEL S.C.S. para un máximo de 5 comparaciones', link: '/Experimentos/EfectoPrecipitacion', category: 'Lluvia escorrentía' },
        { id: 20, title: 'Efecto de la duración en la tormenta', description: 'Simula el efecto que produce la DURACIÓN EFECTIVA en la tormenta mediante el HIDROGRAMA TRIANGULAR y el HIDROGRAMA DEL S.C.S. para un máximo de 5 comparaciones.', link: '/Experimentos/EfectoTormenta', category: 'Lluvia escorrentía' },
        { id: 21, title: 'Efecto del uso y tipo del suelo en la tormenta', description: 'Simula el efecto que produce el uso del suelo mediante el NUMERO DE LA CURVA en la tormenta mediante el HIDROGRAMA TRIANGULAR y el HIDROGRAMA DEL S.C.S. para un máximo de 5 comparaciones.', link: '/Experimentos/EfectoSuelo', category: 'Lluvia escorrentía' },
        { id: 22, title: 'Hidrograma unitario de máxima crecida', description: 'Determina el hidrograma de máxima crecida mediante los HIDROGRAMAS TRIANGULAR y del S.C.S.  con las características hidrológicas de la Cuenca.', link: '/Experimentos/HidrogramaUnitario', category: 'Lluvia escorrentía' },

        { id: 23, title: 'Ecuación universal de pérdida del suelo', description: 'La ecuación universal de pérdida de suelo (USLE) es un modelo de erosión diseñado para predecir el porcentaje anual de pérdida de suelo (A) en función de la precipitación de la zona, de la topografía del terreno, características del suelo, de la cobertura vegetal y del manejo del suelo.', link: '/Experimentos/EcuacionUniversal', category: 'Producción de sedimentos' },
        { id: 24, title: 'Método de Fleming', description: 'Permite calcular la producción de sedimentos en una cuenca hidrográfica en base a las características de su cobertura y al caudal medio que ésta presenta. Foro', link: '/Experimentos/MetodoFleming', category: 'Producción de sedimentos' },
        { id: 25, title: 'Método de Fournier', description: 'Calcula la producción de sedimentos en una cuenca hidrográfica en base a la precipitación y el relieve. Foro', link: '/Experimentos/MetodoFournier', category: 'Producción de sedimentos' },

        { id: 26, title: 'Modelo de Témez', description: 'Calibración y validación del Modelo de Simulación Hidrológica Integral propuesto por TÉMEZ. Se requiere: las series históricas mensuales de precipitación, evapotranspiración potencial y  caudales.  Se calibra el coeficiente ETP, la humedad máxima, la infiltración máxima, coeficiente de descarga al acuífero, caudal inicial y la humedad inicial.', link: '/Experimentos/temez', category: 'Simulación continua' },

        { id: 27, title: 'Método de Muskingum', description: 'Este es un método para calcular el hidrograma de una avenida en su tránsito por el cauce teniendo en cuenta el efecto de laminación. Tiene en cuenta dos parámetros, uno relacionado con la capacidad de almacenamiento del cauce en cada tramo, de carácter adimensional, (X), y otro relacionado con el tiempo que tarda la onda de avenida en desplazarse por el tramo considerado, con unidades de “tiempo”, (k).', link: '/Experimentos/muskingum', category: 'Tránsito de Avenidas' },
        { id: 28, title: 'Metodo de Muskingum - Cunge', description: 'Cunge combino métodos hidráulicos con la simplicidad de método Muskingum, aquí calcula las dos constantes X y k utilizadas en el método Muskingum mediante parámetros hidráulicos y geometría del cauce para poder calcular el tránsito.', link: '/Experimentos/MetodoMuskingumCunge', category: 'Tránsito de Avenidas' },
        { id: 29, title: 'Método de la Piscina Nivelada', description: 'Es un procedimiento para calcular el hidrograma de caudal de salida desde un embalse con superficie de agua horizontal, dado su hidrograma de entrada y sus características de almacenamiento-caudal de salida.', link: '/Experimentos/MetodoPiscina', category: 'Tránsito de Avenidas' },
        { id: 30, title: 'Método de la Onda Cinemática por medio de Solución Analítica', description: 'Es una variación en un flujo, tal como un cambio en el caudal, elevación de la superficie, celeridad de la onda y parámetros hidráulicos del canal.', link: '/Experimentos/MetodoOnda', category: 'Tránsito de Avenidas' },

        // { id: 31, title: 'TransporteSedimentosSuspension', description: 'Permite calcular el material transportado por la corriente, tanto dentro de la capa de fondo como en suspensión.  Se pueden aplicar los métodos de Colby, Engelund-Hasen, Shen-Hung, Yang, Ackers-White, Brownlie, Karim-Kénnedy y Graf -Acaroglu.', link: '/Experimentos/TransporteSedimentosSuspension', category: 'Transporte de sedimentos' },
        { id: 32, title: 'Transporte de sedimentos en suspensión', description: 'Permite calcular el material transportado por la corriente, tanto dentro de la capa de fondo como en suspensión.  Se pueden aplicar los métodos de Colby, Engelund-Hasen, Shen-Hung, Yang, Ackers-White, Brownlie, Karim-Kénnedy y Graf -Acaroglu', link: '/Experimentos/TransporteSedimentosTotal', category: 'Transporte de sedimentos' },

        { id: 33, title: 'Prueba de Bondad de Ajuste', description: 'Esta herramienta nos permite analizar por el método Kolmogorov Smirnov, la función de distribución de probabilidad que se ajusta mejor a la serie de datos recopilados en  registros histórico de valores extremos', link: '/Experimentos/PruebaDeBondad', category: 'Análisis Probabilístico' },

        { id: 34, title: 'Curva de Remanso (Tramos Fijos)', description: 'El flujo gradualmente variado constituye una clase especial de flujo permanente no uniforme y se caracteriza por una variación continua del tirante (y con ello el área la velocidad, etc.), a lo largo del perfil de la ecuacion ongitudinal del canal', link: '/Experimentos/CurvaRemazoTramos', category: 'Hidráulica de canales' },
        { id: 35, title: 'Curva de Remanso(Bakhmeteff)', description: 'El flujo gradualmente variado constituye una clase especial de flujo permanente no uniforme y se caracteriza por una variación continua del tirante (y con ello el área la velocidad, etc.), a lo largo del perfil longitudinal del canal.', link: '/Experimentos/CurvaRemazoBakhmeteff', category: 'Hidráulica de canales' },
        { id: 36, title: 'Raiz de una Ecuación', description: '	En casos hidráulicos es frecuente tener que resolver una ecuación compleja de grado superior.', link: '/Experimentos/RaizEcuacion', category: 'Hidráulica de canales' },
        { id: 37, title: 'Resalto Hidráulico (S. Circular)', description: 'Es resalto o salto hidráulico es un fenómeno local que se presenta en un flujo rápidamente variado, en el cual en un corto tramo, el tirante cambia de un  valor inferior al crítico a otro superior a este.', link: '/Experimentos/ResaltoHidraulicoCircular', category: 'Hidráulica de canales' },
        { id: 38, title: 'Resalto Hidráulico (S. Trapezoidal)', description: 'Es resalto o salto hidráulico es un fenómeno local que se presenta en un flujo rápidamente variado, en el cual en un corto tramo, el tirante cambia de un  valor inferior al crítico a otro superior a este.', link: '/Experimentos/ResaltoHidraulicoTrapezoidal', category: 'Hidráulica de canales' },
        { id: 39, title: 'Tirante Critico (S. Circular)', description: 'Se dice que el tirante de agua y para un flujo critico, recibe el nombre de tirante critico, yc.', link: '/Experimentos/TiranteCriticoCircular', category: 'Hidráulica de canales' },
        { id: 40, title: 'Tirante Critico (S. Trapezoidal)', description: '	Se dice que un canal o alguna sección de él, está trabajando bajo régimen crítico, en cualquiera de los siguientes tres casos.', link: '/Experimentos/TiranteCriticoTrapezoidal', category: 'Hidráulica de canales' },
        { id: 41, title: 'Tirante Normal Seccion Parabólica', description: 'Relaciones Geométricas de una sección parabólica.', link: '/Experimentos/TiranteNSeccionParabolica', category: 'Hidráulica de canales' },
        { id: 42, title: 'Tirante Normal (S. trapezoidal, triangular)', description: 'Aplicando el Método de Newton Raphson. Un flujo uniforme y permanente recibe el nombre de flujo normal', link: '/Experimentos/TiranteNSeccionTrapezoidal', category: 'Hidráulica de canales' },
        { id: 43, title: 'Tirante Normal (Seccion circular)', description: 'Aplicando el Método de la Secante. En este método el algoritmo que permite el cálculo de la raíz aproximada para la solución de la ecuación f(X)=0.', link: '/Experimentos/TiranteNSeccionCircular', category: 'Hidráulica de canales' },
    ];


    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
    const [busqueda, setBusqueda] = useState('');


    const simulacionesFiltradas = simulaciones.filter(
        (simulacion) =>
            (categoriaSeleccionada === 'Todas' || simulacion.category === categoriaSeleccionada) &&
            (simulacion.title?.toLowerCase().includes(busqueda?.toLowerCase() || '') ||
                simulacion.description?.toLowerCase().includes(busqueda?.toLowerCase() || ''))
    );

    // const descripcionPagina = "En esta página encontrarás diversas simulaciones y herramientas relacionadas con la hidrología y la hidráulica, categorizadas para facilitar tu búsqueda.";
    // const categoriasConTodas = ['Todas', ...categorias, ...categoriasDiseño, ...categoriasAnali];

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
                            {/* <li
                                className={`mb-4 cursor-pointer categoria px-4 py-2 rounded-lg ${categoriaSeleccionada === 'Todas' ? 'bg-blue-700 text-white' : 'hover:bg-blue-100 hover:text-blue-700'
                                    }`}
                                onClick={() => setCategoriaSeleccionada('Todas')}
                            >
                                Todas
                            </li> */}
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