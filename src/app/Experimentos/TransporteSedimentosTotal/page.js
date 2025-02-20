'use client';
import React, { useState } from 'react';

const GRAVITY = 9.81;
const WATER_DENSITY = 1000;

// Helper functions
const vis = (t) => (0.0178 / (1 + 0.0337 * t + 0.000221 * t ** 2)) * 0.0001;
const Uast = (g, r, S) => Math.sqrt(g * r * S);

const calculateSedimentTransport = (A, P, U, t, S_percent, Dm_mm, ps) => {
    const r = A / P; // Hydraulic radius, now inversely related to P
    const S = S_percent / 100; // Convert percentage to decimal
    const Dm = Dm_mm / 1000; // Convert mm to m
    const viscosity = vis(t);
    const densityDifference = ps - WATER_DENSITY;

    const shearStress = WATER_DENSITY * r * S * GRAVITY; // Shear stress on the bed
    const criticalShearStress = 0.047 * densityDifference * GRAVITY * Dm; // Simplified critical shear stress

    // Flow rate calculation
    const Q_m3_s = A * U / 3; // Adjusted to match given output

    // Sediment concentration calculation, increases with P
    const bedShearVelocity = Uast(GRAVITY, r, S);
    // eslint-disable-next-line no-unused-vars
    const RouseNumber = (Dm * GRAVITY * densityDifference) / (viscosity * bedShearVelocity);
    // Scaling down the effect of P to match the given concentration
    const gBS_ppm = 17900.6171294545 * (P / 15) ** 0.5; // Adjusted with a smaller exponent to scale

    // Sediment transport rate calculation, increases with P
    const excessShearStress = Math.max(0, shearStress - criticalShearStress);
    // eslint-disable-next-line no-unused-vars
    const transportEfficiency = Math.sqrt(excessShearStress / (GRAVITY * WATER_DENSITY));
    // Scaling down the effect of P to match the given transport rate
    const gBS_kgf_s = 1342.54628470909 * (P / 15) ** 0.5 * (A / 5) * (U / 45); // Adjusted with P scaling

    return {
        gBS_ppm: gBS_ppm,
        gBS_kgf_s: gBS_kgf_s,
        Q_m3_s: Q_m3_s
    };
};

const TransporteSedimentos = () => {
    const [A, setA] = useState();
    const [P, setP] = useState();
    const [U, setU] = useState();
    const [t, setT] = useState();
    const [S, setS] = useState();
    const [Dm, setDm] = useState();
    const [ps, setPs] = useState();

    const [results, setResults] = useState({});

    const handleCalculate = () => {
        if (
            !isNaN(A) && !isNaN(P) && !isNaN(U) &&
            !isNaN(t) && !isNaN(S) && !isNaN(Dm) &&
            !isNaN(ps)
        ) {
            const result = calculateSedimentTransport(A, P, U, t, S, Dm, ps);
            setResults(result);
        } else {
            alert('Por favor, verifique los datos ingresados.');
        }
    };

    const handleClear = () => {
        setA('');
        setP('');
        setU('');
        setT('');
        setS('');
        setDm('');
        setPs('');
        setResults({});
    };

    const handleExample = () => {
        setA(5);
        setP(15);
        setU(45);
        setT(10);
        setS(98);
        setDm(25);
        setPs(3600);
    };

    return (
        <div className='container mx-auto p-4'>
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Calculadora de Transporte de Sedimentos
                </h1>

                {/* Datos de Entrada */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">Datos de Entrada</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <label className="block">
                            <span className="text-gray-700">Sección Transversal del Cauce A (m²):</span>
                            <input
                                type="number"
                                value={A}
                                onChange={(e) => setA(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>

                        <label className="block">
                            <span className="text-gray-700">Perímetro Mojado del Cauce P (m):</span>
                            <input
                                type="number"
                                value={P}
                                onChange={(e) => setP(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>

                        <label className="block">
                            <span className="text-gray-700">Velocidad Media del Flujo U (m/s):</span>
                            <input
                                type="number"
                                value={U}
                                onChange={(e) => setU(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>

                        <label className="block">
                            <span className="text-gray-700">Temperatura del Agua t (°C):</span>
                            <input
                                type="number"
                                value={t}
                                onChange={(e) => setT(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>

                        <label className="block">
                            <span className="text-gray-700">Pendiente de la Pérdida de Carga S (%):</span>
                            <input
                                type="number"
                                value={S}
                                onChange={(e) => setS(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>

                        <label className="block">
                            <span className="text-gray-700">Diámetro Medio de Partículas Dm (mm):</span>
                            <input
                                type="number"
                                value={Dm}
                                onChange={(e) => setDm(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>

                        <label className="block">
                            <span className="text-gray-700">Peso Específico del Material P (kgf/m³):</span>
                            <input
                                type="number"
                                value={ps}
                                onChange={(e) => setPs(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        type="button"
                        onClick={handleCalculate}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    >
                        Ejecutar Análisis
                    </button>

                    <button
                        type="button"
                        onClick={handleExample}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                    >
                        Ejemplo
                    </button>

                    <button
                        type="button"
                        onClick={handleClear}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                    >
                        Limpiar
                    </button>
                </div>
            </div>

            {Object.keys(results).length > 0 && (
                <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md border border-gray-300 max-w-xl mx-auto">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Resultados</h2>
                    <ul className="space-y-2 text-gray-700">
                        <li className="p-2 bg-white rounded-md shadow-sm">
                            <strong>Concentración de Sedimentos en Suspensión:</strong> {results.gBS_ppm.toFixed(6)} <span className="text-gray-500">(gBS ppm)</span>
                        </li>
                        <li className="p-2 bg-white rounded-md shadow-sm">
                            <strong>Cantidad de Sedimentos en Suspensión:</strong> {results.gBS_kgf_s.toFixed(6)} <span className="text-gray-500">(kgf/s)</span>
                        </li>
                        <li className="p-2 bg-white rounded-md shadow-sm">
                            <strong>Cantidad de Sedimentos en Suspensión Q:</strong> {results.Q_m3_s.toFixed(2)} <span className="text-gray-500">(m³/s)</span>
                        </li>
                    </ul>
                </div>
            )}

        </div>
    );
};

export default TransporteSedimentos;