'use client';
import React, { useState } from 'react';
import '../App.css';

const ExperimentoCircular = () => {
    const [data, setData] = useState({
        Q: 1,
        D: 1.5,
        N: 0.015,
        S: 0.0005,
        y: 0.5,
    });

    const [results, setResults] = useState({
        yResult: '',
        v: '',
        f2: '',
        En: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: parseFloat(value) });
    };

    const calcular = () => {
        let { Q, D, N, S, y } = data;
        let c, w, arcosw, x, a, p, f, f1, y1, v, t, f2, En;

        c = Q * N / Math.sqrt(S);
        y = 0.35 * D;
        do {
            w = 1 - (2 * y / D);
            arcosw = 1.570796 - Math.atan(w / Math.sqrt(1 - Math.pow(w, 2)));
            x = 2 * arcosw;
            a = (x - Math.sin(x)) * Math.pow(D, 2) / 8;
            p = x * D / 2;
            f = (Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3)) - c;

            f1 = f;
            y += 0.0001;

            w = 1 - (2 * y / D);
            arcosw = 1.570796 - Math.atan(w / Math.sqrt(1 - Math.pow(w, 2)));
            x = 2 * arcosw;
            a = (x - Math.sin(x)) * Math.pow(D, 2) / 8;
            p = x * D / 2;
            f = (Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3)) - c;

            y1 = y - (f * 0.0001 / (f - f1));
            if (y1 >= D) {
                alert("Aumente el diámetro");
                break;
            }

            y = y1;

        } while (Math.abs(y1 - y) >= 0.0001);

        v = Q / a;
        t = D * Math.sin(x / 2);
        f2 = v / Math.sqrt(9.81 * a / t);
        En = y + Math.pow(v, 2) / 19.62;

        setResults({
            yResult: y.toFixed(14),
            v: v.toFixed(14),
            f2: f2.toFixed(14),
            En: En.toFixed(14),
        });
    };

    const cargarEjemplo = () => {
        setData({
            Q: 1,
            D: 1.5,
            N: 0.015,
            S: 0.0005,
            y: 0.5,
        });
        setResults({
            yResult: '',
            v: '',
            f2: '',
            En: ''
        });
    };

    const limpiar = () => {
        setData({
            Q: '',
            D: '',
            N: '',
            S: '',
            y: '',
        });
        setResults({
            yResult: '',
            v: '',
            f2: '',
            En: ''
        });
    };

    return (
        <div className="py-10">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 max-w-2xl mx-auto mt-6">
                <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">
                    Análisis Tirante N Sección Circular
                </h1>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Datos de Entrada</h3>

                    <label className="block text-gray-700 font-medium">CAUDAL Q (m³/s):</label>
                    <input
                        type="number"
                        name="Q"
                        value={data.Q}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <label className="block text-gray-700 font-medium mt-4">DIÁMETRO (m):</label>
                    <input
                        type="number"
                        name="D"
                        value={data.D}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <label className="block text-gray-700 font-medium mt-4">COEF. RUGOSIDAD:</label>
                    <input
                        type="number"
                        name="N"
                        value={data.N}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <label className="block text-gray-700 font-medium mt-4">PENDIENTE (m/m):</label>
                    <input
                        type="number"
                        name="S"
                        value={data.S}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <label className="block text-gray-700 font-medium mt-4">TIRANTE INICIAL (m):</label>
                    <input
                        type="number"
                        name="y"
                        value={data.y}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                <div className="flex justify-center gap-4 mb-6">
                    <button
                        onClick={calcular}
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
                    >
                        <span className="button-text">Calcular</span>
                    </button>
                    <button
                        onClick={cargarEjemplo}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                        <span className="button-text">Cargar Ejemplo</span>
                    </button>
                    <button
                        onClick={limpiar}
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                        <span className="button-text">Limpiar</span>
                    </button>
                </div>

                {results.yResult && (
                    <div className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-300">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultados</h2>
                        <p className="text-lg text-gray-700">
                            <strong>Tirante Normal (y):</strong> {results.yResult}
                        </p>
                        <p className="text-lg text-gray-700">
                            <strong>Velocidad (v):</strong> {results.v}
                        </p>
                        <p className="text-lg text-gray-700">
                            <strong>Número de Froude (f2):</strong> {results.f2}
                        </p>
                        <p className="text-lg text-gray-700">
                            <strong>Energía Específica (En):</strong> {results.En}
                        </p>
                    </div>
                )}
            </div>
        </div>

    );
};

export default ExperimentoCircular;
