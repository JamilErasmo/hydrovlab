'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación
const ExperimentoFlemingInerhi = () => {
    const [caudal, setCaudal] = useState('');
    const [factorSeleccionado, setFactorSeleccionado] = useState('0'); // Selección inicial
    const [factorA, setFactorA] = useState('');
    const [factorN, setFactorN] = useState('');
    const [resultadoFleming, setResultadoFleming] = useState(null);
    const [resultadoInerhi, setResultadoInerhi] = useState(null);

    const factores = [
        { label: 'Variada, de hojas anchas y coníferas', a: 117, n: 1.02 },
        { label: 'Floresta conífera y pastos altos', a: 3523, n: 0.82 },
        { label: 'Pastos bajos y arbustos', a: 19260, n: 0.65 },
        { label: 'Desiertos y arbustos', a: 37730, n: 0.72 },
    ];

    // Función para cargar valores de ejemplo
    const cargarEjemplo = () => {
        setCaudal(80);
        setFactorSeleccionado('0'); // Primer factor
        setFactorA(117);
        setFactorN(1.02);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setCaudal('');
        setFactorSeleccionado('0');
        setFactorA('');
        setFactorN('');
        setResultadoFleming(null);
        setResultadoInerhi(null);
    };

    // Función para calcular los resultados
    const calcular = () => {
        const { a, n } = factores[factorSeleccionado];
        const Q = parseFloat(caudal);

        if (isNaN(Q) || Q <= 0) {
            alert('Por favor, ingresa un valor válido para el caudal.');
            return;
        }

        // Método de Fleming
        const Q_fleming = Q * (1 / 0.0283);
        const gBS_fleming = a * Math.pow(Q_fleming, n);

        // Método de INERHI
        const Q_inerhi = 3.7376 * Math.pow(Q, 1.2574);
        const gBS_inerhi = Q_inerhi * 365;

        setResultadoFleming(gBS_fleming.toFixed(3));
        setResultadoInerhi(gBS_inerhi.toFixed(3));
    };

    // Actualizar factores dinámicamente al seleccionar una opción
    const actualizarFactores = (index) => {
        setFactorSeleccionado(index);
        setFactorA(factores[index].a);
        setFactorN(factores[index].n);
    };

    return (
        <div className="py-14" >
                  <BackButton />
            <div className="py-14 bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6 max-w-lg mx-auto">

                {/* Título */}
                <h1 className="text-2xl font-bold text-blue-700 text-center uppercase tracking-wide">
                    Experimento Fleming e INERHI
                </h1>

                {/* Sección de Datos de Entrada */}
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-4">Datos de Entrada</h3>

                <div className="space-y-4">
                    {/* Campo de Caudal */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">Caudal Q (m³/s):</label>
                        <input
                            type="number"
                            value={caudal}
                            onChange={(e) => setCaudal(e.target.value)}
                            placeholder="Ingresa el caudal"
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>

                    {/* Selección de Factor */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">Factor (a y n):</label>
                        <select
                            value={factorSeleccionado}
                            onChange={(e) => actualizarFactores(e.target.value)}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            {factores.map((f, index) => (
                                <option key={index} value={index}>
                                    {f.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Factores a y n */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">Factor a:</label>
                            <input
                                type="number"
                                value={factorA}
                                readOnly
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">Factor n:</label>
                            <input
                                type="number"
                                value={factorN}
                                readOnly
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Contenedor de Botones */}
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={cargarEjemplo}
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                        Ejemplo
                    </button>
                    <button
                        onClick={calcular}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
                    >
                        Calcular
                    </button>
                    <button
                        onClick={limpiarCampos}
                        className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                        Limpiar
                    </button>
                </div>

                {resultadoFleming !== null && resultadoInerhi !== null && (
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6 max-w-xl mx-auto">

                        {/* Título Principal */}
                        <h2 className="text-2xl font-bold text-blue-700 text-center uppercase tracking-wide border-b pb-2 mb-4">
                            Resultados
                        </h2>

                        {/* Resultado Fleming */}
                        <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800">FLEMING</h3>
                            <p className="text-gray-700 italic">
                                <strong>Fórmula:</strong> gBS = a * Q<sup>n</sup>
                            </p>
                            <p className="text-gray-800 font-medium">
                                <strong>Cantidad de Sedimentos gBS (Ton/año):</strong>
                                <span className="text-blue-700 font-bold ml-2">{resultadoFleming}</span>
                            </p>
                        </div>

                        {/* Resultado INERHI */}
                        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800">INERHI</h3>
                            <p className="text-gray-700 italic">
                                <strong>Fórmula:</strong> gBS = 3.7376 * Q<sup>1.2574</sup> * 365
                            </p>
                            <p className="text-gray-800 font-medium">
                                <strong>Cantidad de Sedimentos gBS (Ton/año):</strong>
                                <span className="text-blue-700 font-bold ml-2">{resultadoInerhi}</span>
                            </p>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default ExperimentoFlemingInerhi;
