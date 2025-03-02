'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según corresponda

const Experimento = () => {
    const [data, setData] = useState({
        Q: "",
        b: "",
        z: "",
        y: "",
        n: "",
        s: "",
        Er: "",
    });
    const [results, setResults] = useState({
        yResult: '',
        V: '',
        F1: '',
        E1: ''
    });

    // Función que trunca un número a 3 decimales sin redondear
    const truncateTo3 = (num) => (Math.trunc(num * 1000) / 1000).toFixed(3);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: parseFloat(value) });
    };

    const calcular = () => {
        let { Q, b, z, y, n, s, Er } = data;
        let C, L, D, A, P, T, r, F, y1, V, L1, F1, E1;

        C = Math.pow((Q * n) / Math.sqrt(s), 3);
        L = Math.sqrt(1 + Math.pow(z, 2));
        A = (b + (z * y)) * y;
        P = b + (2 * y * L);
        T = b + (2 * z * y);
        r = A / P;
        F = (Math.pow(A, 5) / Math.pow(P, 2)) - C;

        do {
            D = (Math.pow(A, 4) * ((5 * P * T) - (4 * A * r))) / Math.pow(P, 3);
            y1 = y - (F / D);
            y = y1;

            A = (b + (z * y)) * y;
            P = b + (2 * y * L);
            T = b + (2 * z * y);
            F = (Math.pow(A, 5) / Math.pow(P, 2)) - C;

            V = Q / A;
            L1 = A / T;
            F1 = V / Math.sqrt(9.81 * L1);
            E1 = y + Math.pow(V, 2) / 19.62;
        } while (Math.abs(F) >= Er);

        setResults({
            yResult: truncateTo3(y),
            V: truncateTo3(V),
            F1: truncateTo3(F1),
            E1: truncateTo3(E1),
        });
    };

    const cargarEjemplo = () => {
        setData({
            Q: 1.5,
            b: 1,
            z: 0,
            y: 1,
            n: 0.014,
            s: 0.001,
            Er: 0.0001,
        });
        setResults({
            yResult: '',
            V: '',
            F1: '',
            E1: ''
        });
    };

    const limpiar = () => {
        setData({
            Q: '',
            b: '',
            z: '',
            y: '',
            n: '',
            s: '',
            Er: '',
        });
        setResults({
            yResult: '',
            V: '',
            F1: '',
            E1: ''
        });
    };

    return (
        <div className='py-10'>
            <BackButton />
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 max-w-2xl mx-auto mt-6">
                <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
                    Tirante Normal Sección Trapezoidal
                </h1>
                <div className="flex justify-center mb-2">
                    {/* Reemplaza la siguiente ruta con la imagen deseada */}
                    <img src="\images\imageSTrapezoidal.png" alt="Imagen descriptiva" className="max-h-48 object-contain" />
                </div>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Datos de Entrada</h3>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">CAUDAL Q (m³/s):</label>
                        <input
                            type="number"
                            name="Q"
                            value={data.Q}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">SOLERA (m):</label>
                        <input
                            type="number"
                            name="b"
                            value={data.b}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">TALUD:</label>
                        <input
                            type="number"
                            name="z"
                            value={data.z}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">TIRANTE (m):</label>
                        <input
                            type="number"
                            name="y"
                            value={data.y}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">RUGOSIDAD:</label>
                        <input
                            type="number"
                            name="n"
                            value={data.n}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">PENDIENTE:</label>
                        <input
                            type="number"
                            name="s"
                            value={data.s}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 font-medium">ERROR:</label>
                        <input
                            type="number"
                            name="Er"
                            value={data.Er}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                </div>

                <div className="flex justify-center gap-4 mb-6">
                    <button
                        onClick={cargarEjemplo}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                        Cargar Ejemplo
                    </button>
                    <button
                        onClick={calcular}
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
                    >
                        Calcular
                    </button>
                    <button
                        onClick={limpiar}
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                        Limpiar
                    </button>
                </div>

                {results.yResult && (
                    <div className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-300">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultados</h2>
                        <p className="text-lg text-gray-700">
                            <strong>Foco de Parabola (m):</strong> {results.yResult}
                        </p>
                        <p className="text-lg text-gray-700">
                            <strong>Energía Específica (m):</strong> {results.V}
                        </p>
                        <p className="text-lg text-gray-700">
                            <strong>Número de Froude:</strong> {results.F1}
                        </p>
                        <p className="text-lg text-gray-700">
                            <strong>Velocidad (m):</strong> {results.E1}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Experimento;
