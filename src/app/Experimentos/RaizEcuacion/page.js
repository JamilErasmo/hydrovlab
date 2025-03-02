'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

const RaizEcuacion = () => {
    const [constante, setConstante] = useState('');
    const [valorInicial, setValorInicial] = useState('');
    const [errorDeseable, setErrorDeseable] = useState('');
    const [resultado, setResultado] = useState(null);

    // Función para cargar el ejemplo con los valores proporcionados
    const cargarEjemplo = () => {
        setConstante(10);
        setValorInicial(34);
        setErrorDeseable(12);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setConstante('');
        setValorInicial('');
        setErrorDeseable('');
        setResultado(null);
    };

    // Función para calcular la raíz de la ecuación
    const calcular = () => {
        let c = parseFloat(constante);
        let y = parseFloat(valorInicial);
        let er = parseFloat(errorDeseable);

        let f1 = 0;
        let y1, f, d;

        do {
            f = ((y ** 5) / ((1.5 + (2 * y)) ** 2)) - c;
            d = ((y ** 4) * (7.5 + (6 * y))) / ((1.5 + (2 * y)) ** 3);
            y1 = y - (f / d);

            f1 = ((y1 ** 5) / ((1.5 + (2 * y1)) ** 2)) - c;
            y = y1;

            d = ((y ** 4) * (7.5 + (6 * y))) / ((1.5 + (2 * y)) ** 3);
            y1 = y - (f / d);

        } while (Math.abs(f1) > er);

        // Se muestra el resultado con 3 decimales
        setResultado(y.toFixed(3));
    };

    return (
        <div className="py-10">
            <BackButton />
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 max-w-lg mx-auto mt-6">
                {/* Título */}
                <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">
                    Análisis de Raíz de Ecuación
                </h1>
                <div className="mb-4">
                    <div className="flex justify-center mb-2">
                        {/* Reemplaza la siguiente ruta con la imagen deseada */}
                        <img src="\images\imageRaizEcuacion.png" alt="Imagen descriptiva" className="max-h-48 object-contain" />
                    </div>
                    <h3 className="text-lg font-semibold text-left">Datos de entrada</h3>
                </div>
                {/* Sección de Datos de Entrada */}
                <div className="space-y-4">
                    {/* Campo: Constante de la Ecuación C */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">
                            Constante de la Ecuación C:
                        </label>
                        <input
                            type="number"
                            value={constante}
                            onChange={(e) => setConstante(e.target.value)}
                            placeholder="Ingresa el valor de C"
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Campo: Valor Inicial Y */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">
                            Valor con que se inicia el cálculo Y:
                        </label>
                        <input
                            type="number"
                            value={valorInicial}
                            onChange={(e) => setValorInicial(e.target.value)}
                            placeholder="Ingresa el valor inicial de Y"
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Campo: Error deseable E */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">
                            Error deseable para el cálculo E:
                        </label>
                        <input
                            type="number"
                            value={errorDeseable}
                            onChange={(e) => setErrorDeseable(e.target.value)}
                            placeholder="Ingresa el error deseable"
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                </div>

                {/* Botones Secundarios */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={cargarEjemplo}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                        Ejemplo
                    </button>
                    <button
                        onClick={calcular}
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition text-center"
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

                {/* Resultados */}
                {resultado && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md border border-gray-300">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Resultado</h2>
                        <p className="text-gray-700">
                            Raíz de la Ecuación:{" "}
                            <span className="font-bold text-blue-700">{resultado}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RaizEcuacion;
