'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

const TiranteCriticoCircular = () => {
    const [caudal, setCaudal] = useState('');
    const [diametro, setDiametro] = useState('');
    const [tiranteInicial, setTiranteInicial] = useState('');
    const [tiranteCritico, setTiranteCritico] = useState(null);
    const [errorVisible, setErrorVisible] = useState(false);

    // Función que trunca un número a 3 decimales sin redondear
    const truncateTo3 = (num) => {
        return (Math.trunc(num * 1000) / 1000).toFixed(3);
    };

    // Función para cargar el ejemplo con los valores dados
    const cargarEjemplo = () => {
        setCaudal(1.5);
        setDiametro(1.4);
        setTiranteInicial(0.4);
        setErrorVisible(false);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setCaudal('');
        setDiametro('');
        setTiranteInicial('');
        setTiranteCritico(null);
        setErrorVisible(false);
    };

    // Función para calcular el tirante crítico
    const calcular = () => {
        let Q = parseFloat(caudal);
        let D = parseFloat(diametro);
        let y = parseFloat(tiranteInicial);

        const c = Q / Math.sqrt(9.81);
        let f, f1, w, arcosw, x, a, t, y1;

        do {
            w = 1 - (2 * y / D);
            arcosw = 1.570796 - Math.atan(w / Math.sqrt(1 - Math.pow(w, 2)));
            x = 2 * arcosw;
            a = (x - Math.sin(x)) * Math.pow(D, 2) / 8;
            t = D * Math.sin(x / 2);
            f = Math.pow(a, 1.5) / Math.sqrt(t) - c;

            f1 = f;
            y = y + 0.0001;

            w = 1 - (2 * y / D);
            arcosw = 1.570796 - Math.atan(w / Math.sqrt(1 - Math.pow(w, 2)));
            x = 2 * arcosw;
            a = (x - Math.sin(x)) * Math.pow(D, 2) / 8;
            t = D * Math.sin(x / 2);
            f = Math.pow(a, 1.5) / Math.sqrt(t) - c;

            y1 = y - ((f * 0.0001) / (f - f1));

            if (y1 >= D) {
                setErrorVisible(true);
                break;
            }
        } while (Math.abs(y1 - y) > 0.0001);

        // Se utiliza la función truncateTo3 para obtener 3 decimales sin redondear
        setTiranteCritico(truncateTo3(y));
    };

    return (
        <div className='py-10'>
            <BackButton />
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 max-w-2xl mx-auto mt-6">
                <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">
                    Tirante Crítico en Sección Circular
                </h1>
                <div className="flex justify-center mb-2">
                    {/* Reemplaza la siguiente ruta con la imagen deseada */}
                    <img src="\images\imageSTrapezoidal.png" alt="Imagen descriptiva" className="max-h-48 object-contain" />
                </div>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Datos de Entrada</h3>
                    <label className="block text-gray-700 font-medium">Caudal Q (m³/s):</label>
                    <input
                        type="number"
                        value={caudal}
                        onChange={(e) => setCaudal(e.target.value)}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <label className="block text-gray-700 font-medium mt-4">Diámetro D (m):</label>
                    <input
                        type="number"
                        value={diametro}
                        onChange={(e) => setDiametro(e.target.value)}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <label className="block text-gray-700 font-medium mt-4">Tirante Inicial Y (m):</label>
                    <input
                        type="number"
                        value={tiranteInicial}
                        onChange={(e) => setTiranteInicial(e.target.value)}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                <div className="flex justify-center gap-4 mb-6">
                    <button
                        onClick={cargarEjemplo}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
                    >
                        <span>Ejemplo</span>
                    </button>
                    <button
                        onClick={calcular}
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition"
                    >
                        <span>Calcular</span>
                    </button>
                    <button
                        onClick={limpiarCampos}
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition"
                    >
                        <span>Limpiar</span>
                    </button>
                </div>

                {tiranteCritico && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultados</h2>
                        <p className="text-lg text-gray-700">
                            <strong>Tirante Crítico:</strong> {tiranteCritico} m
                        </p>
                    </div>
                )}

                {errorVisible && (
                    <div className="p-4 bg-red-100 rounded-lg border border-red-300">
                        <p className="text-red-700 font-medium">
                            <strong>Error:</strong> El valor de y1 supera el diámetro D.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TiranteCriticoCircular;
