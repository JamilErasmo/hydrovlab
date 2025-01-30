'use client';
import React, { useState } from 'react';

const BalanceHidrico = () => {
    const [precipitacion, setPrecipitacion] = useState(Array(12).fill(''));
    const [evapotranspiracion, setEvapotranspiracion] = useState(Array(12).fill(''));
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const [resultado, setResultado] = useState({
        pet: [],
        r: [],
        vr: [],
        etr: [],
        d: [],
        ex: []
    });

    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const cargarEjemplo = () => {
        const precipEjemplo = [77, 59, 88, 50, 60, 36, 8, 18, 32, 75, 78, 116];
        const evapoEjemplo = [26, 30, 40, 45, 60, 78, 91, 92, 71, 47, 29, 22];
        setPrecipitacion(precipEjemplo);
        setEvapotranspiracion(evapoEjemplo);
    };

    const limpiarCampos = () => {
        setPrecipitacion(Array(12).fill(''));
        setEvapotranspiracion(Array(12).fill(''));
        setResultado({
            pet: [],
            r: [],
            vr: [],
            etr: [],
            d: [],
            ex: []
        });
        setMostrarResultados(false);
    };

    const calcular = () => {
        const pet = procPET(precipitacion, evapotranspiracion);
        const r = procR(pet);
        const vr = procVR(r);
        const etr = procETR(precipitacion, evapotranspiracion, vr);
        const d = procD(evapotranspiracion, etr);
        const ex = procEx(pet, vr);

        setResultado({ pet, r, vr, etr, d, ex });
        setMostrarResultados(true);
    };

    const procPET = (p, et) => p.map((val, i) => parseFloat(val) - parseFloat(et[i]) || 0);
    const procR = (pet) => {
        let r = Array(12).fill(0);
        r[0] = 100;
        for (let i = 1; i < 12; i++) {
            r[i] = Math.max(0, Math.min(100, r[i - 1] + pet[i]));
        }
        return r;
    };
    const procVR = (r) => r.map((val, i) => (i === 0 ? 0 : r[i] - r[i - 1]));
    const procETR = (p, et, vr) => p.map((val, i) => (parseFloat(val) - parseFloat(et[i]) <= 0 ? parseFloat(val) + Math.abs(vr[i]) : parseFloat(et[i])));
    const procD = (et, etr) => et.map((val, i) => parseFloat(val) - parseFloat(etr[i]));
    const procEx = (pet, vr) => pet.map((val, i) => Math.max(0, val - vr[i]));

    return (
        <div className="app">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white border border-gray-300 rounded-lg shadow-md max-w-4xl mx-auto">
                {/*  Sección de Precipitación */}
                <div className="p-4 bg-gray-50 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Precipitación (mm)</h3>
                    {precipitacion.map((val, i) => (
                        <div key={i} className="flex items-center gap-4 mb-2">
                            <label className="w-24 text-gray-600">{meses[i]}:</label>
                            <input
                                type="number"
                                value={val}
                                onChange={(e) => {
                                    const newValues = [...precipitacion];
                                    newValues[i] = e.target.value;
                                    setPrecipitacion(newValues);
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    ))}
                </div>

                {/* Sección de Evapotranspiración */}
                <div className="p-4 bg-gray-50 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Evapotranspiración (mm)</h3>
                    {evapotranspiracion.map((val, i) => (
                        <div key={i} className="flex items-center gap-4 mb-2">
                            <label className="w-24 text-gray-600">{meses[i]}:</label>
                            <input
                                type="number"
                                value={val}
                                onChange={(e) => {
                                    const newValues = [...evapotranspiracion];
                                    newValues[i] = e.target.value;
                                    setEvapotranspiracion(newValues);
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    ))}
                </div>
            </div>


            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={cargarEjemplo}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                >
                    Ejemplo
                </button>

                <button
                    onClick={calcular}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                >
                    Calcular
                </button>

                <button
                    onClick={limpiarCampos}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                    Limpiar
                </button>
            </div>


            {mostrarResultados && (
                <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 max-w-5xl mx-auto">
                    <h2 className="text-xl font-bold text-blue-600 text-center mb-4">Resultados</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200 text-gray-800">
                                    <th className="border border-gray-300 px-4 py-2">Resultado</th>
                                    {meses.map((mes, i) => (
                                        <th key={i} className="border border-gray-300 px-4 py-2">{mes}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white">
                                    <td className="border border-gray-300 px-4 py-2">P</td>
                                    {precipitacion.map((val, i) => <td key={i} className="border border-gray-300 px-4 py-2">{val}</td>)}
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">ET</td>
                                    {evapotranspiracion.map((val, i) => <td key={i} className="border border-gray-300 px-4 py-2">{val}</td>)}
                                </tr>
                                <tr className="bg-white">
                                    <td className="border border-gray-300 px-4 py-2">P-ET</td>
                                    {resultado.pet.map((val, i) => <td key={i} className="border border-gray-300 px-4 py-2">{val?.toFixed(2)}</td>)}
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">R</td>
                                    {resultado.r.map((val, i) => <td key={i} className="border border-gray-300 px-4 py-2">{val?.toFixed(2)}</td>)}
                                </tr>
                                <tr className="bg-white">
                                    <td className="border border-gray-300 px-4 py-2">VR</td>
                                    {resultado.vr.map((val, i) => <td key={i} className="border border-gray-300 px-4 py-2">{val?.toFixed(2)}</td>)}
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">ETR</td>
                                    {resultado.etr.map((val, i) => <td key={i} className="border border-gray-300 px-4 py-2">{val?.toFixed(2)}</td>)}
                                </tr>
                                <tr className="bg-white">
                                    <td className="border border-gray-300 px-4 py-2">D</td>
                                    {resultado.d.map((val, i) => <td key={i} className="border border-gray-300 px-4 py-2">{val?.toFixed(2)}</td>)}
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">EX</td>
                                    {resultado.ex.map((val, i) => <td key={i} className="border border-gray-300 px-4 py-2">{val?.toFixed(2)}</td>)}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BalanceHidrico;
