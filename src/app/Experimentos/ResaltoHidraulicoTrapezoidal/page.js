'use client';
import React, { useState } from 'react';

const TiranteConjugadoSTrapezoidal = () => {
    const [caudal, setCaudal] = useState('');
    const [anchoSolera, setAnchoSolera] = useState('');
    const [talud, setTalud] = useState('');
    const [tiranteInicial, setTiranteInicial] = useState('');
    const [jInicial, setJInicial] = useState('');
    const [resultados, setResultados] = useState({
        Y1: '',
        Y2: '',
        J: '',
        perdidaEnergia: '',
        alturaResalto: ''
    });

    // Función para limpiar los campos de entrada
    const limpiarCampos = () => {
        setCaudal('');
        setAnchoSolera('');
        setTalud('');
        setTiranteInicial('');
        setJInicial('');
        setResultados({
            Y1: '',
            Y2: '',
            J: '',
            perdidaEnergia: '',
            alturaResalto: ''
        });
    };

    // Función para calcular el tirante conjugado y otros resultados
    const calcular = () => {
        let Q = parseFloat(caudal);
        let B = parseFloat(anchoSolera);
        let Z = parseFloat(talud);
        let Y = parseFloat(tiranteInicial);
        let J = parseFloat(jInicial);

        let a, R, t, k1, k2, k3, k4, F, D, y1, y2, E1, A2, E2, E3, Y3;

        do {
            a = (B + (Z * Y)) * Y;
            R = Math.pow(Q, 2) / (19.62 * Y * Math.pow(a, 2));
            t = B / (Z * Y);
            k1 = (2.5 * t) + 1;
            k2 = ((1.5 * t) + 1) * (t + 1);
            k3 = (0.5 * Math.pow(t, 2)) + ((t - (6 * R)) * (t + 1));
            k4 = 6 * R * Math.pow(t + 1, 2);
            F = Math.pow(J, 4) + (k1 * Math.pow(J, 3)) + (k2 * Math.pow(J, 2)) + (k3 * J) - k4;

            D = (4 * Math.pow(J, 3)) + (3 * k1 * Math.pow(J, 2)) + (2 * k2 * J) + k3;
            J = J - (F / D);
            F = Math.pow(J, 4) + (k1 * Math.pow(J, 3)) + (k2 * Math.pow(J, 2)) + (k3 * J) - k4;
        } while (Math.abs(F) > 0.0001);

        y1 = Y;
        y2 = J * y1;
        E1 = y1 + (Math.pow(Q, 2) / (19.62 * Math.pow(a, 2)));
        A2 = (B + Z * y2) * y2;
        E2 = y2 + (Math.pow(Q, 2) / (19.62 * Math.pow(A2, 2)));
        E3 = Math.abs(E1 - E2); // Pérdida de energía
        Y3 = Math.abs(y2 - y1); // Altura del resalto

        setResultados({
            Y1: y1.toFixed(4),
            Y2: y2.toFixed(4),
            J: J.toFixed(4),
            perdidaEnergia: E3.toFixed(4),
            alturaResalto: Y3.toFixed(4)
        });
    };

    return (
        <div className="py-10 max-w-2xl mx-auto">
            {/* Título del Experimento */}
            <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">
                Análisis de Tirante Conjugado - Sección Trapezoidal
            </h1>

            {/* Sección de Datos de Entrada */}
            <div className="space-y-4">
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">
                        Caudal Q (m³/s):
                    </label>
                    <input
                        type="number"
                        value={caudal}
                        onChange={(e) => setCaudal(e.target.value)}
                        placeholder="Ingresa el caudal"
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">
                        Ancho de Solera B (m):
                    </label>
                    <input
                        type="number"
                        value={anchoSolera}
                        onChange={(e) => setAnchoSolera(e.target.value)}
                        placeholder="Ingresa el ancho"
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">
                        Talud Z:
                    </label>
                    <input
                        type="number"
                        value={talud}
                        onChange={(e) => setTalud(e.target.value)}
                        placeholder="Ingresa el talud"
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">
                        Tirante Inicial Y (m):
                    </label>
                    <input
                        type="number"
                        value={tiranteInicial}
                        onChange={(e) => setTiranteInicial(e.target.value)}
                        placeholder="Ingresa el tirante inicial"
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">
                        J Inicial:
                    </label>
                    <input
                        type="number"
                        value={jInicial}
                        onChange={(e) => setJInicial(e.target.value)}
                        placeholder="Ingresa J inicial"
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-center gap-4 mt-6">

                <button
                    onClick={calcular}
                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
                >
                    Calcular
                </button>
                <button
                    onClick={limpiarCampos}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
                >
                    Limpiar
                </button>
            </div>

            {/* Sección de Resultados */}
            {resultados.Y1 && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-300">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultados</h2>
                    <p className="text-lg font-medium text-gray-700">
                        <strong>Tirante Inicial Y1:</strong> {resultados.Y1} m
                    </p>
                    <p className="text-lg font-medium text-gray-700">
                        <strong>Tirante Conjugado Y2:</strong> {resultados.Y2} m
                    </p>
                    <p className="text-lg font-medium text-gray-700">
                        <strong>Valor de J:</strong> {resultados.J}
                    </p>
                    <p className="text-lg font-medium text-gray-700">
                        <strong>Pérdida de Energía E3:</strong> {resultados.perdidaEnergia} m
                    </p>
                    <p className="text-lg font-medium text-gray-700">
                        <strong>Altura del Resalto Y3:</strong> {resultados.alturaResalto} m
                    </p>
                </div>
            )}
        </div>


    );
};

export default TiranteConjugadoSTrapezoidal;
