'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

const ExperimentoSaturacion = () => {
    const [conductividad, setConductividad] = useState('');
    const [seccion, setSeccion] = useState('');
    const [volumenAgua, setVolumenAgua] = useState('');
    const [tiempoAplicado, setTiempoAplicado] = useState('');
    const [tiempoSaturacion, setTiempoSaturacion] = useState('');
    const [infiltracionAcumulada, setInfiltracionAcumulada] = useState(null);
    const [adsorcion, setAdsorcion] = useState(null);
    const [infiltracion, setInfiltracion] = useState(null);
    const [error, setError] = useState('');

    const cargarEjemplo = () => {
        setConductividad(0.4);
        setSeccion(40);
        setVolumenAgua(100);
        setTiempoAplicado(0.5);
        setTiempoSaturacion(0.25);
        setInfiltracionAcumulada(null);
        setAdsorcion(null);
        setInfiltracion(null);
        setError('');
    };

    const limpiarCampos = () => {
        setConductividad('');
        setSeccion('');
        setVolumenAgua('');
        setTiempoAplicado('');
        setTiempoSaturacion('');
        setInfiltracionAcumulada(null);
        setAdsorcion(null);
        setInfiltracion(null);
        setError('');
    };

    const calcularResultados = () => {
        if (!conductividad || !seccion || !volumenAgua || !tiempoAplicado || !tiempoSaturacion) {
            setError('Por favor, asegúrate de ingresar todos los datos necesarios.');
            return;
        }
        setError('');
        const VolAg = parseFloat(volumenAgua);
        const AreaSecT = parseFloat(seccion);
        const TSat = parseFloat(tiempoSaturacion);
        const k = parseFloat(conductividad);
        const TApli = parseFloat(tiempoAplicado);

        const infilAcum = (VolAg / AreaSecT).toFixed(3);
        const ads = (infilAcum / Math.sqrt(TSat)).toFixed(3);
        const infil = ((ads * Math.sqrt(TApli)) + (k * TApli)).toFixed(3);

        setInfiltracionAcumulada(infilAcum);
        setAdsorcion(ads);
        setInfiltracion(infil);
    };

    return (
        <div className="container mx-auto py-8">
            <BackButton />
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
                {/* Título del Experimento */}
                <h1 className="text-2xl font-bold text-center mb-4">RICHARDS-PHILLIPS</h1>
                
                {/* Imagen y Descripción Intermedia */}
                <div className="flex flex-col items-center mb-6">
                    <img
                        src="/images/ImageRichardsPhillips.jpg"
                        alt="Imagen del Experimento de Saturación"
                        className="w-full max-w-md rounded-lg"
                    />
                    <p className="mt-2 text-sm text-gray-600 text-center">
                        Este modelo requiere el volúmen de agua, el area de estudio, el tiempo que se va a infiltrar y la permeabilidad del suelo.
                    </p>
                </div>

                {/* Subtítulo de Datos de Entrada */}
                <h3 className="text-lg font-semibold mb-4">Datos de Entrada</h3>

                <div className="space-y-4">
                    <div className="flex flex-col">
                        <label className="font-medium">Sección Transversal (cm²):</label>
                        <input
                            type="number"
                            value={seccion}
                            onChange={(e) => setSeccion(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Tiempo de Saturación (h):</label>
                        <input
                            type="number"
                            value={tiempoSaturacion}
                            onChange={(e) => setTiempoSaturacion(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Volumen de Agua (cm³):</label>
                        <input
                            type="number"
                            value={volumenAgua}
                            onChange={(e) => setVolumenAgua(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Conductividad Hidráulica (cm/h):</label>
                        <input
                            type="number"
                            value={conductividad}
                            onChange={(e) => setConductividad(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Tiempo Aplicado (h):</label>
                        <input
                            type="number"
                            value={tiempoAplicado}
                            onChange={(e) => setTiempoAplicado(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
            </div>

            {/* Botones de Ejemplo, Calcular y Limpiar */}
            <div className="mt-6 flex justify-center gap-4">
                <button
                    onClick={cargarEjemplo}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
                >
                    Ejemplo
                </button>

                <button
                    onClick={calcularResultados}
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out"
                >
                    Calcular
                </button>

                <button
                    onClick={limpiarCampos}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out"
                >
                    Limpiar
                </button>
            </div>

            {/* Mensaje de Error */}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            {/* Resultados centrados */}
            <div className="mt-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-300 text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Resultados</h3>
                <p className="text-gray-800">
                    <strong>Infiltración Acumulada:</strong> {infiltracionAcumulada ? `${infiltracionAcumulada} cm` : ''}
                </p>
                <p className="text-gray-800">
                    <strong>Adsorción:</strong> {adsorcion ? `${adsorcion} cm-h⁻¹⁺⁵` : ''}
                </p>
                <p className="text-gray-800">
                    <strong>Infiltración:</strong> {infiltracion ? `${infiltracion} cm` : ''}
                </p>
            </div>
        </div>
    );
};

export default ExperimentoSaturacion;
