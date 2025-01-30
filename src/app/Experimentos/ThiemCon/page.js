'use client';
import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale, // Escala para el eje X (categorías)
    LinearScale,   // Escala para el eje Y (lineal)
    PointElement,  // Elementos de los puntos en la gráfica
    LineElement,   // Elementos de las líneas
    Title,         // Títulos en la gráfica
    Tooltip,       // Herramientas de tooltip
    Legend         // Leyenda de la gráfica
);


const NuevoExperimento = () => {
    const [inputs, setInputs] = useState({
        nivelFreatico: 12,
        caudal: 500,
        transmisividad: 100,
        radioPozo: 10,
        distancia1: 100,
        distancia2: 600,
        descenso1: 2,
        descenso2: 3,
    });

    const [results, setResults] = useState({
        Q: null,
        ZPozoExtraccion: null,
        ZPozoObservacion1: null,
        T: null,
        R: null,
    });

    const [activeCalculation, setActiveCalculation] = useState('Q');

    useEffect(() => {
        setActiveCalculation('Q');
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const calculateQ = () => {
        const { transmisividad, nivelFreatico, descenso1, descenso2, radioPozo, distancia1, distancia2 } = inputs;
        if (transmisividad && nivelFreatico && descenso1 && descenso2 && radioPozo && distancia1 && distancia2) {
            const T = parseFloat(transmisividad);
            const h1 = parseFloat(nivelFreatico) - parseFloat(descenso1);
            const h2 = parseFloat(nivelFreatico) - parseFloat(descenso2);
            const r1 = parseFloat(distancia1);
            const r2 = parseFloat(distancia2);
            const Q = (
                (2 * Math.PI * T * (h2 - h1)) /
                Math.log(r2 / r1)
            ).toFixed(2);
            setResults({ Q });
        } else {
            alert('Por favor, complete todos los campos para calcular Q.');
        }
    };

    const calculateZ = () => {
        const { caudal, transmisividad, nivelFreatico, radioPozo, distancia1, distancia2 } = inputs;
        if (caudal && transmisividad && nivelFreatico && radioPozo && distancia1 && distancia2) {
            const Q = parseFloat(caudal);
            const T = parseFloat(transmisividad);
            const h0 = parseFloat(nivelFreatico);
            const r = parseFloat(radioPozo);
            const r1 = parseFloat(distancia1);
            const r2 = parseFloat(distancia2);

            // Cálculo de Z en el pozo de extracción
            const ZPozoExtraccion = (
                h0 - (Q / (2 * Math.PI * T)) * Math.log(r2 / r)
            ).toFixed(2);

            // Cálculo de Z en el pozo de observación 1
            const ZPozoObservacion1 = (
                h0 - (Q / (2 * Math.PI * T)) * Math.log(r2 / r1)
            ).toFixed(2);

            setResults({ ZPozoExtraccion, ZPozoObservacion1 });
        } else {
            alert('Por favor, complete todos los campos para calcular Z.');
        }
    };

    const calculateT = () => {
        const { caudal, nivelFreatico, descenso1, descenso2, distancia1, distancia2 } = inputs;
        if (caudal && nivelFreatico && descenso1 && descenso2 && distancia1 && distancia2) {
            const Q = parseFloat(caudal);
            const h1 = parseFloat(nivelFreatico) - parseFloat(descenso1);
            const h2 = parseFloat(nivelFreatico) - parseFloat(descenso2);
            const r1 = parseFloat(distancia1);
            const r2 = parseFloat(distancia2);
            const T = (Q / (2 * Math.PI * (h2 - h1) / Math.log(r2 / r1))).toFixed(2);
            setResults({ T });
        } else {
            alert('Por favor, complete todos los campos para calcular T.');
        }
    };

    const calculateR = () => {
        const { caudal, transmisividad, nivelFreatico, radioPozo, descenso1 } = inputs;
        if (caudal && transmisividad && nivelFreatico && radioPozo && descenso1) {
            const Q = parseFloat(caudal);
            const T = parseFloat(transmisividad);
            const r = parseFloat(radioPozo);
            const h = parseFloat(nivelFreatico) - parseFloat(descenso1); // Descenso del nivel freático

            // Fórmula para calcular el radio de influencia
            const R = (10 * r * Math.exp((2 * Math.PI * T * h) / Q)).toFixed(2);

            setResults({ R });
        } else {
            alert('Por favor, complete todos los campos para calcular R.');
        }
    };


    const clearFields = () => {
        setInputs({
            nivelFreatico: '',
            transmisividad: '',
            descenso1: '',
            descenso2: '',
            radioPozo: '',
            distancia1: '',
            distancia2: '',
            caudal: '',
        });
        setResults({ Q: null, ZPozoExtraccion: null, ZPozoObservacion1: null, T: null, R: null });
    };

    const loadExample = () => {
        if (activeCalculation === 'Q') {
            setInputs({
                nivelFreatico: '12',
                transmisividad: '100',
                descenso1: '6',
                descenso2: '3',
                radioPozo: '10',
                distancia1: '100',
                distancia2: '600',
            });
        } else if (activeCalculation === 'Z') {
            setInputs({
                nivelFreatico: '12',
                transmisividad: '60',
                descenso2: '2',
                radioPozo: '10',
                distancia1: '160',
                distancia2: '400',
                caudal: '823',
            });
        } else if (activeCalculation === 'T') {
            setInputs({
                nivelFreatico: '10',
                descenso1: '3.5',
                descenso2: '1.8',
                radioPozo: '5',
                distancia1: '85',
                distancia2: '300',
                caudal: '1052',
            })
        } else if (activeCalculation === 'R') {
            setInputs({
                nivelFreatico: '12',
                transmisividad: '100',
                descenso1: '6',
                descenso2: '3',
                radioPozo: '10',
                distancia1: '100',
                distancia2: '600',
                caudal: '1000',
            })
        }
    };



    const [graphData, setGraphData] = useState(null);

    const handleChangeGrap = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const generateGraph = () => {
        const { nivelFreatico, caudal, transmisividad, radioPozo } = inputs;

        if (
            [nivelFreatico, caudal, transmisividad, radioPozo].some(
                (value) => value === null || value === undefined || isNaN(parseFloat(value))
            )
        ) {
            alert("Por favor, completa todos los campos necesarios.");
            return;
        }

        // Parámetros
        const h0 = parseFloat(nivelFreatico); // Nivel freático original
        const Q = parseFloat(caudal); // Caudal de extracción
        const T = parseFloat(transmisividad); // Coeficiente de transmisividad
        const rw = parseFloat(radioPozo); // Radio del pozo de extracción

        // Distancias específicas (radios)
        const radios = [600, 500, 400, 300, 200, 100];

        // Calcular los niveles freáticos (h) usando la fórmula del Método de Thiem
        const niveles = radios.map((r) =>
            r <= rw ? h0 : h0 - (Q / (2 * Math.PI * T)) * Math.log(r / rw)
        );

        // Configurar los datos para la gráfica
        setGraphData({
            labels: radios.map((r) => `${r} m`),
            datasets: [
                {
                    label: "Nivel freático original (m)",
                    data: Array(radios.length).fill(h0),
                    borderColor: "blue",
                    borderDash: [5, 5],
                    borderWidth: 2,
                    fill: false,
                },
                {
                    label: "Curva de abatimientos (m)",
                    data: niveles,
                    borderColor: "black",
                    borderWidth: 2,
                    fill: true,
                    backgroundColor: "rgba(255, 205, 86, 0.5)", // Fondo amarillo claro
                    pointStyle: "diamond",
                    pointRadius: 6,
                    pointBackgroundColor: "orange",
                },
                {
                    label: "Superficie",
                    data: Array(radios.length).fill(14), // Superficie fija a 14
                    borderColor: "green",
                    borderWidth: 2,
                    fill: false,
                    pointStyle: "rect",
                    pointRadius: 6,
                    pointBackgroundColor: "green",
                },
            ],
        });
    };


    return (
        <div className="p-8 min-h-screen">
            <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-300 space-y-6 max-w-lg mx-auto">
                {/* Título Principal */}
                <h2 className="text-2xl font-bold text-blue-700 uppercase tracking-wide text-center">
                    Régimen Permanente
                </h2>

                {/* Subtítulo */}
                <h2 className="text-lg font-semibold text-gray-800 text-center">
                    Acuífero Confinado
                </h2>

                {/* Opciones de Selección */}
                <div className="space-y-3">
                    {[
                        { value: 'Q', label: 'Determinar caudal de extracción (Q)' },
                        { value: 'Z', label: 'Determinar abatimiento en el pozo (Z)' },
                        { value: 'T', label: 'Determinar coeficiente de transmisibilidad (T)' },
                        { value: 'R', label: 'Determinar el radio de influencia del pozo de extracción (R)' },
                    ].map((option) => (
                        <label
                            key={option.value}
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                        >
                            <input
                                type="radio"
                                name="calculation"
                                value={option.value}
                                checked={activeCalculation === option.value}
                                onChange={() => setActiveCalculation(option.value)}
                                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-gray-800 font-medium">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>


            {activeCalculation === 'Q' && (
                <div className="mb-5 space-y-6 py-8 bg-white p-6 rounded-2xl shadow-md border border-gray-300">
                    <h3 className="text-xl font-semibold text-blue-700 text-center">
                        Parámetros para Determinar el Caudal de Extracción (Q)
                    </h3>

                    {[
                        { name: 'nivelFreatico', label: 'Nivel freático original (m):' },
                        { name: 'transmisividad', label: 'Coeficiente de transmisividad (m²/día):' },
                        { name: 'descenso1', label: 'Descenso del nivel freático Pozo de Observación 1 (m):' },
                        { name: 'descenso2', label: 'Descenso del nivel freático Pozo de Observación 2 (m):' },
                        { name: 'radioPozo', label: 'Radio del pozo de extracción (m):' },
                        { name: 'distancia1', label: 'Distancia al pozo de observación 1 (m):' },
                        { name: 'distancia2', label: 'Distancia al pozo de observación 2 (m):' },
                    ].map((field) => (
                        <div key={field.name} className="flex flex-col">
                            <label className="text-gray-700 font-medium">{field.label}</label>
                            <input
                                type="number"
                                name={field.name}
                                value={inputs[field.name]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                    ))}
                </div>
            )}

            {activeCalculation === 'Z' && (
                <div className="mb-5 space-y-6 py-8 bg-white p-6 rounded-2xl shadow-md border border-gray-300">
                    <h3 className="text-xl font-semibold text-blue-700 text-center">
                        Parámetros para Determinar el Abatimiento en el Pozo (Z)
                    </h3>

                    {[
                        { name: 'nivelFreatico', label: 'Nivel freático original (m):' },
                        { name: 'transmisividad', label: 'Coeficiente de transmisividad (m²/día):' },
                        { name: 'descenso2', label: 'Descenso del nivel freático Pozo de Observación 2 (m):' },
                        { name: 'radioPozo', label: 'Radio del pozo de extracción (m):' },
                        { name: 'distancia1', label: 'Distancia al pozo de observación 1 (m):' },
                        { name: 'distancia2', label: 'Distancia al pozo de observación 2 (m):' },
                        { name: 'caudal', label: 'Caudal (m³/día):' },
                    ].map((field) => (
                        <div key={field.name} className="flex flex-col">
                            <label className="text-gray-700 font-medium">{field.label}</label>
                            <input
                                type="number"
                                name={field.name}
                                value={inputs[field.name]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                    ))}
                </div>
            )}

            {activeCalculation === 'T' && (
                <div className="mb-5 space-y-6 py-8 bg-white p-6 rounded-2xl shadow-md border border-gray-300">
                    <h3 className="text-xl font-semibold text-blue-700 text-center">
                        Parámetros para Determinar el Coeficiente de Transmisibilidad (T)
                    </h3>

                    {[
                        { name: 'nivelFreatico', label: 'Nivel freático original (m):' },
                        { name: 'descenso1', label: 'Descenso en pozo de observación 1 (m):' },
                        { name: 'descenso2', label: 'Descenso en pozo de observación 2 (m):' },
                        { name: 'radioPozo', label: 'Radio del pozo de extracción (m):' },
                        { name: 'distancia1', label: 'Distancia al pozo de observación 1 (m):' },
                        { name: 'distancia2', label: 'Distancia al pozo de observación 2 (m):' },
                        { name: 'caudal', label: 'Caudal (m³/día):' },
                    ].map((field) => (
                        <div key={field.name} className="flex flex-col">
                            <label className="text-gray-700 font-medium">{field.label}</label>
                            <input
                                type="number"
                                name={field.name}
                                value={inputs[field.name]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                    ))}
                </div>
            )}

            {activeCalculation === 'R' && (
                <div className="mb-5 space-y-6 py-8 bg-white p-6 rounded-2xl shadow-md border border-gray-300">
                    <h3 className="text-xl font-semibold text-blue-700 text-center">
                        Parámetros para Determinar el Radio de Influencia del Pozo (R)
                    </h3>

                    {[
                        { name: 'nivelFreatico', label: 'Nivel freático original (m):' },
                        { name: 'transmisividad', label: 'Coeficiente de transmisividad (m²/día):' },
                        { name: 'descenso1', label: 'Descenso en pozo de observación 1 (m):' },
                        { name: 'descenso2', label: 'Descenso en pozo de observación 2 (m):' },
                        { name: 'radioPozo', label: 'Radio del pozo de extracción (m):' },
                        { name: 'distancia1', label: 'Distancia al pozo de observación 1 (m):' },
                        { name: 'distancia2', label: 'Distancia al pozo de observación 2 (m):' },
                        { name: 'caudal', label: 'Caudal (m³/día):' },
                    ].map((field) => (
                        <div key={field.name} className="flex flex-col">
                            <label className="text-gray-700 font-medium">{field.label}</label>
                            <input
                                type="number"
                                name={field.name}
                                value={inputs[field.name]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                    ))}
                </div>
            )}


            <div className="mt-5">
                <div className="mb-5 flex justify-end space-x-4">
                    <button
                        onClick={
                            activeCalculation === 'Q'
                                ? calculateQ
                                : activeCalculation === 'Z'
                                    ? calculateZ
                                    : activeCalculation === 'T'
                                        ? calculateT
                                        : calculateR
                        }
                        disabled={!activeCalculation}
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        Calcular
                    </button>
                    <button
                        onClick={clearFields}
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                    >
                        Limpiar
                    </button>
                    <button
                        onClick={loadExample}
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                    >
                        Ejemplo
                    </button>
                </div>


                <h3 className="text-lg font-bold text-gray-700 mb-4 border-b-2 border-gray-300 pb-2">
                    Resultados:
                </h3>
                <div className="p-4 bg-gray-100 rounded-lg shadow-md space-y-4">
                    {activeCalculation === 'Q' && (
                        <div className="p-4 bg-white rounded-md shadow-sm border-l-4 border-blue-500">
                            <p className="text-blue-700 font-semibold">Caudal (m³/día):</p>
                            <p className="text-2xl font-bold text-blue-800">{results.Q || '--'}</p>
                        </div>
                    )}
                    {activeCalculation === 'Z' && (
                        <div className="p-4 bg-white rounded-md shadow-sm border-l-4 border-green-500">
                            <p className="text-green-700 font-semibold">Abatimiento (m):</p>
                            <div className="text-gray-700">
                                <p className="text-lg">
                                    Z (m): Pozo de extracción: <span className="font-bold">{results.ZPozoExtraccion || '--'}</span>
                                </p>
                                <p className="text-lg">
                                    Z (m): Pozo de observación 1:{' '}
                                    <span className="font-bold">{results.ZPozoObservacion1 || '--'}</span>
                                </p>
                            </div>
                        </div>
                    )}
                    {activeCalculation === 'T' && (
                        <div className="p-4 bg-white rounded-md shadow-sm border-l-4 border-yellow-500">
                            <p className="text-yellow-700 font-semibold">Coef. de transmisibilidad (m²/día):</p>
                            <p className="text-2xl font-bold text-yellow-800">{results.T || '--'}</p>
                        </div>
                    )}
                    {activeCalculation === 'R' && (
                        <div className="p-4 bg-white rounded-md shadow-sm border-l-4 border-red-500">
                            <p className="text-red-700 font-semibold">Radio de influencia (m):</p>
                            <p className="text-2xl font-bold text-red-800">{results.R || '--'}</p>
                        </div>
                    )}
                </div>

            </div>
            <div className="p-8 min-h-screen">
                <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-blue-600 uppercase mb-4">
                        Generador de Gráfica
                    </h2>
                    <button
                        onClick={generateGraph}
                        className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                    >
                        Generar Gráfica
                    </button>
                </div>
                {graphData && (
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-700 mb-4">Gráfica Generada:</h3>
                        <div
                            className="p-4 bg-white rounded-lg shadow"
                            style={{ width: "800px", height: "450px", margin: "0 auto" }} // Ajustar tamaño de la gráfica
                        >
                            <Line
                                data={graphData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false, // Permitir el ajuste del tamaño personalizado
                                    plugins: {
                                        legend: {
                                            position: "top",
                                        },
                                        title: {
                                            display: true,
                                            text: "Método de Thiem - Gráfica",
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

        </div>


    );
};

export default NuevoExperimento;
