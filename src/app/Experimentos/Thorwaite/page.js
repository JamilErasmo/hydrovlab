'use client';
import React, { useState } from 'react';

const Thorwaite = () => {
    const [latitud, setLatitud] = useState('');
    const [latitudSeleccion, setLatitudSeleccion] = useState('');
    const [temperaturas, setTemperaturas] = useState(Array(12).fill(''));
    const [ij, setIj] = useState([]);
    const [ka, setKa] = useState([]);
    const [uj, setUj] = useState([]);
    const [iTotal, setITotal] = useState(0);
    const [a, setA] = useState(0);

    // Función para cargar el ejemplo
    const cargarEjemplo = () => {
        setLatitud(25.5);
        setLatitudSeleccion("Norte");
        setTemperaturas([13, 15, 18, 22, 25, 27, 26, 26, 24, 21, 16, 12]);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setLatitud('');
        setLatitudSeleccion('');
        setTemperaturas(Array(12).fill(''));
        setIj([]);
        setKa([]);
        setUj([]);
        setITotal(0);
        setA(0);
    };

    // Cálculo de Ij
    const calcularIj = (temps) => {
        let ij = temps.map(temp => Math.pow((temp / 5), 1.514));
        let sumaIj = ij.reduce((a, b) => a + b, 0);
        return { ij, sumaIj };
    };

    // Interpolación de Ka
    const interpolarKa = (lat, zona) => {
        // Valores simplificados para Ka, ajustar según zona y latitud real
        const kaNorte = [1.17, 1.01, 1.05, 0.96, 0.94, 0.88, 0.92, 0.98, 1, 1.1, 1.11, 1.18];
        const kaSur = [1.2, 1.03, 1.06, 1, 0.95, 0.9, 0.92, 0.98, 1.02, 1.12, 1.14, 1.21];

        return zona === "Norte" ? kaNorte : kaSur;
    };

    // Cálculo de Uj
    const calcularUj = (ijTotal, temps, ka) => {
        let a = 0.000000675 * Math.pow(ijTotal, 3) - 0.0000771 * Math.pow(ijTotal, 2) + 0.0179 * ijTotal + 0.492;
        let uj = temps.map((temp, index) => (1.6 * ka[index] * Math.pow((10 * temp / ijTotal), a)).toFixed(2));
        return { uj, a };
    };

    // Función para manejar el cálculo
    const calcular = () => {
        const { ij, sumaIj } = calcularIj(temperaturas);
        const ka = interpolarKa(latitud, latitudSeleccion);
        const { uj, a } = calcularUj(sumaIj, temperaturas, ka);
        setIj(ij);
        setKa(ka);
        setUj(uj);
        setITotal(sumaIj.toFixed(2));
        setA(a.toFixed(2));
    };

    return (
        <div className="py-10">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 max-w-2xl mx-auto mt-6">
                {/* Título del Experimento */}
                <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">
                    Método de Thorwaite
                </h1>

                {/* Sección de Datos de Entrada */}
                <div className="space-y-6">
                    {/* Grupo de Latitud y Zona */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">Latitud:</label>
                            <input
                                type="number"
                                value={latitud}
                                onChange={(e) => setLatitud(e.target.value)}
                                placeholder="Latitud"
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">Zona:</label>
                            <select
                                value={latitudSeleccion}
                                onChange={(e) => setLatitudSeleccion(e.target.value)}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 transition"
                            >
                                <option value="">Seleccione la zona</option>
                                <option value="Norte">Norte</option>
                                <option value="Sur">Sur</option>
                            </select>
                        </div>
                    </div>

                    {/* Sección de Temperaturas por Mes */}
                    <div className="space-y-4">
                        {temperaturas.map((temp, index) => (
                            <div key={index} className="flex flex-col">
                                <label className="text-gray-700 font-medium">
                                    Mes {index + 1}:
                                </label>
                                <input
                                    type="number"
                                    value={temp}
                                    onChange={(e) => {
                                        const newTemps = [...temperaturas];
                                        newTemps[index] = e.target.value;
                                        setTemperaturas(newTemps);
                                    }}
                                    placeholder={`Temperatura mes ${index + 1}`}
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={cargarEjemplo}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                        Ejemplo
                    </button>
                    <button
                        onClick={limpiarCampos}
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                        Limpiar
                    </button>
                    <button
                        onClick={calcular}
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
                    >
                        Calcular
                    </button>
                </div>

                {/* Sección de Resultados */}
                {ij.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                            Resultados:
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 border-r border-gray-300">Mes</th>
                                        <th className="px-4 py-2 border-r border-gray-300">Temperatura</th>
                                        <th className="px-4 py-2 border-r border-gray-300">Ij</th>
                                        <th className="px-4 py-2 border-r border-gray-300">Ka</th>
                                        <th className="px-4 py-2">Uj</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {temperaturas.map((temp, index) => (
                                        <tr key={index} className="text-center border-t border-gray-300">
                                            <td className="px-4 py-2 border-r border-gray-300">
                                                {`Mes ${index + 1}`}
                                            </td>
                                            <td className="px-4 py-2 border-r border-gray-300">
                                                {temp}
                                            </td>
                                            <td className="px-4 py-2 border-r border-gray-300">
                                                {ij[index].toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 border-r border-gray-300">
                                                {ka[index]}
                                            </td>
                                            <td className="px-4 py-2">
                                                {uj[index]}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-gray-700">
                            <p className="text-lg font-medium">
                                <strong>I:</strong> {iTotal}
                            </p>
                            <p className="text-lg font-medium">
                                <strong>a:</strong> {a}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Thorwaite;
