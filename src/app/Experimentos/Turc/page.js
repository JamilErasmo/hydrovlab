'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación
const Turc = () => {
    const [precipitacion, setPrecipitacion] = useState('');
    const [temperatura, setTemperatura] = useState('');
    const [resultado, setResultado] = useState({
        lt: '',
        e: ''
    });

    // Función para cargar el ejemplo
    const cargarEjemplo = () => {
        setPrecipitacion(20);
        setTemperatura(30);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setPrecipitacion('');
        setTemperatura('');
        setResultado({
            lt: '',
            e: ''
        });
    };

    // Función para calcular L(t) y E
    const calcular = () => {
        const lt = calcularLt(temperatura);  // Calculamos L(t)
        const e = calcularE(precipitacion, temperatura, lt);  // Calculamos E
        setResultado({
            lt: lt.toFixed(0),  // Redondeamos L(t) a enteros
            e: e.toFixed(4)  // Redondeamos E a 4 decimales
        });
    };

    // Fórmula de L(t) = 300 + 25 * t + 0.05 * t^2
    const calcularLt = (t) => {
        return 300 + 25 * t + 0.05 * Math.pow(t, 2);
    };

    // Fórmula de E = P / sqrt(0.9 + (P^2 / L(t)^2))
    const calcularE = (p, t, lt) => {
        return p / Math.sqrt(0.9 + (Math.pow(p, 2) / Math.pow(lt, 2)));
    };

    return (
        <div className='py-10'>
                  <BackButton />
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 max-w-xl mx-auto mt-6">
                <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">Método de Turc</h1>

                <div className="space-y-4">
                    <div className="flex items-center">
                        <label className="w-48 text-gray-700 font-medium">Precipitación (mm):</label>
                        <input
                            type="number"
                            value={precipitacion}
                            onChange={(e) => setPrecipitacion(e.target.value)}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="Valor"
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="w-48 text-gray-700 font-medium">Temperatura (⁰C):</label>
                        <input
                            type="number"
                            value={temperatura}
                            onChange={(e) => setTemperatura(e.target.value)}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="Valor"
                        />
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={cargarEjemplo}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                        Ejemplo
                    </button>
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

                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultados:</h2>
                    <p className="text-gray-700 mb-2">L(t) = 300 + 25 * t + 0.05 * t²</p>
                    <p className="text-gray-700 mb-2">
                        <strong>Resultado L(t):</strong> {resultado.lt}
                    </p>
                    <p className="text-gray-700 mb-2">E = P / √(0.9 + (P² / L(t)²))</p>
                    <p className="text-gray-700">
                        <strong>Resultado E:</strong> {resultado.e}
                    </p>
                </div>
            </div>
        </div>

    );
};

export default Turc;
