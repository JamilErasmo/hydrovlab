'use client';
import React, { useState } from 'react';
const TiranteCriticoTrapezoidal = () => {
    const [errorVisible, setErrorVisible] = useState(false);

    const [caudal, setCaudal] = useState('');
    const [anchoSolera, setAnchoSolera] = useState('');
    const [talud, setTalud] = useState('');
    const [tiranteInicial, setTiranteInicial] = useState('');
    const [errorDeseado, setErrorDeseado] = useState('');
    const [tiranteCritico, setTiranteCritico] = useState(null);

    // Función para cargar el ejemplo con los valores dados
    const cargarEjemplo = () => {
        setCaudal(2.5);
        setAnchoSolera(1.5);
        setTalud(1.5);
        setTiranteInicial(1.5);
        setErrorDeseado(1);
        setTiranteCritico(null);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setCaudal('');
        setAnchoSolera('');
        setTalud('');
        setTiranteInicial('');
        setErrorDeseado('');
        setTiranteCritico(null);
    };

    // Función para calcular el tirante crítico
    const calcular = () => {
        let Q = parseFloat(caudal);
        let B = parseFloat(anchoSolera);
        let z = parseFloat(talud);
        let y = parseFloat(tiranteInicial);
        let Er = parseFloat(errorDeseado);

        const C = Math.pow(Q, 2) / 9.81;
        let A, T, F, D, y1;

        do {
            A = (B + z * y) * y;
            T = B + 2 * z * y;
            F = Math.pow(A, 3) / T - C;
            D = 3 * Math.pow(A, 2) - (2 * z * Math.pow(A, 3)) / Math.pow(T, 2);
            y1 = y - F / D;
            y = y1;
        } while (Math.abs(F) >= Er);

        setTiranteCritico(y.toFixed(15));
    };

    return (
        <div className="py-10">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 max-w-2xl mx-auto mt-6">
                <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">
                    Tirante Crítico en Sección Trapezoidal
                </h1>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Datos de Entrada</h3>

                    <label className="block text-gray-700 font-medium">Caudal Q (m³/s):</label>
                    <input
                        type="number"
                        value={caudal}
                        onChange={(e) => setCaudal(e.target.value)}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <label className="block text-gray-700 font-medium">Ancho de Solera B (m):</label>
                    <input
                        type="number"
                        value={anchoSolera}
                        onChange={(e) => setAnchoSolera(e.target.value)}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <label className="block text-gray-700 font-medium">Talud Z:</label>
                    <input
                        type="number"
                        value={talud}
                        onChange={(e) => setTalud(e.target.value)}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <label className="block text-gray-700 font-medium">Tirante Inicial Y (m):</label>
                    <input
                        type="number"
                        value={tiranteInicial}
                        onChange={(e) => setTiranteInicial(e.target.value)}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <label className="block text-gray-700 font-medium">Error Deseado:</label>
                    <input
                        type="number"
                        value={errorDeseado}
                        onChange={(e) => setErrorDeseado(e.target.value)}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={cargarEjemplo}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                        <span>Ejemplo</span>
                    </button>
                    <button
                        onClick={calcular}
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
                    >
                        <span>Calcular</span>
                    </button>
                    <button
                        onClick={limpiarCampos}
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                        <span>Limpiar</span>
                    </button>
                </div>

                {tiranteCritico && (
                    <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-300">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultados</h2>
                        <p className="text-lg text-gray-700">
                            <strong>Tirante Crítico:</strong> {tiranteCritico} m
                        </p>
                    </div>
                )}
                {errorVisible && (
                    <div className="mt-6 p-4 bg-red-100 rounded-lg border border-red-300">
                        <p className="text-red-700 font-medium">
                            <strong>Error:</strong> El valor de y1 supera el diámetro D.
                        </p>
                    </div>
                )}
            </div>
        </div>

    );
};

export default TiranteCriticoTrapezoidal;
