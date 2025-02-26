'use client';
import React, { useState } from 'react';
import { Chart } from 'react-google-charts';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

const ExperimentoInfiltracion = () => {
    const [fo, setFo] = useState('');
    const [fc, setFc] = useState('');
    const [k, setK] = useState('');
    const [numDatos, setNumDatos] = useState('');
    const [tiempos, setTiempos] = useState([]);
    const [infiltraciones, setInfiltraciones] = useState([]);
    const [volumen, setVolumen] = useState(null);
    const [graficaVisible, setGraficaVisible] = useState(false);
    const [nuevoTiempo, setNuevoTiempo] = useState('');
    const [error, setError] = useState('');
    // Estado para controlar el modal de la imagen del experimento (desde los datos de entrada)
    const [isExperimentoModalOpen, setIsExperimentoModalOpen] = useState(false);

    const cargarEjemplo = () => {
        setFo(4.5);
        setFc(0.4);
        setK(0.35);
        setNumDatos(5);
        setTiempos([0.17, 0.5, 1, 2, 6]);
        setInfiltraciones([4.27, 3.84, 3.29, 2.44, 0.9]);
        setVolumen(null);
        setGraficaVisible(false);
        setError('');
    };

    const limpiarCampos = () => {
        setFo('');
        setFc('');
        setK('');
        setNumDatos('');
        setTiempos([]);
        setInfiltraciones([]);
        setVolumen(null);
        setGraficaVisible(false);
        setNuevoTiempo('');
        setError('');
    };

    const agregarTiempo = () => {
        if (!nuevoTiempo || !fo || !fc || !k || !numDatos) {
            setError('Por favor, ingresa todos los datos necesarios.');
            return;
        }
        if (tiempos.length >= parseInt(numDatos)) {
            setError('Ya se han ingresado el número de datos especificados.');
            return;
        }
        setError('');
        const t = parseFloat(nuevoTiempo);
        const f = parseFloat(fc) + (parseFloat(fo) - parseFloat(fc)) * Math.exp(-parseFloat(k) * t);
        setTiempos((prev) => [...prev, t]);
        setInfiltraciones((prev) => [...prev, parseFloat(f.toFixed(2))]);
        setNuevoTiempo('');
    };

    const calcularVolumen = () => {
        if (tiempos.length !== parseInt(numDatos) || infiltraciones.length !== parseInt(numDatos)) {
            setError('Por favor, asegúrate de que se hayan ingresado todos los datos necesarios.');
            return;
        }
        setError('');
        let area = 0;
        for (let i = 0; i < tiempos.length - 1; i++) {
            const base = tiempos[i + 1] - tiempos[i];
            const altura = (infiltraciones[i] + infiltraciones[i + 1]) / 2;
            area += base * altura;
        }
        setVolumen(area.toFixed(2));
        setGraficaVisible(true); // Mostrar la gráfica al calcular
    };

    const data = [
        ['Tiempo (h)', 'Infiltración (pulg/h)'],
        ...tiempos.map((t, i) => [t, infiltraciones[i]]),
    ];

    const options = {
        title: 'Volumen de Infiltración',
        hAxis: { title: 'Tiempo (h)' },
        vAxis: { title: 'Infiltración (pulg/h)' },
        legend: 'none',
    };

    return (
        <div className="container mx-auto max-w-3xl p-4">
            {/* Contenedor Principal */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
                <BackButton />
                {/* Título */}
                <h1 className="text-2xl font-bold text-blue-700 text-center uppercase tracking-wide">
                    Experimento de Infiltración
                </h1>
                {/* Encabezado de Datos de Entrada */}
                <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-4">Datos de Entrada</h3>
                {/* Sección de Datos de Entrada: Grid de 2 columnas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Izquierda: Campos de Entrada */}
                    <div className="space-y-4">
                        {[
                            { label: 'Infiltración Inicial (fo) (pulg/h)', value: fo, setter: setFo },
                            { label: 'Infiltración Final (fc) (pulg/h)', value: fc, setter: setFc },
                            { label: 'Parámetro del Suelo (k) (h⁻¹)', value: k, setter: setK },
                            { label: 'Número de Datos', value: numDatos, setter: setNumDatos },
                            { label: 'Nuevo Tiempo (h)', value: nuevoTiempo, setter: setNuevoTiempo },
                        ].map((item, index) => (
                            <div key={index} className="flex flex-col">
                                <label className="text-gray-700 font-medium">{item.label}:</label>
                                <input
                                    type="number"
                                    value={item.value}
                                    onChange={(e) => item.setter(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Derecha: Imagen, Descripción y Botón para modal */}
                    <div className="flex flex-col items-center">
                        <img
                            src="/images/imageHorton.jpg"
                            alt="Imagen de Datos de Entrada"
                            className="w-full rounded-lg"
                        />
                        <p className="mt-2 text-sm text-gray-600 text-center">
                            Variación del coeficiente k de la fórmula de Horton.
                        </p>
                        <button 
                            onClick={() => setIsExperimentoModalOpen(true)}
                            className="mt-2 px-2 py-1 bg-gray-700 text-white rounded text-sm"
                        >
                            Mostrar Tabla
                        </button>
                    </div>
                </div>
                {/* Botón de Agregar Tiempo */}
                <button
                    onClick={agregarTiempo}
                    className="mt-4 w-full px-5 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
                >
                    Agregar Tiempo
                </button>
            </div>

            {/* Contenedor de Botones */}
            <div className="mt-6 flex justify-center gap-4">
                <button
                    onClick={cargarEjemplo}
                    className="px-5 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition"
                >
                    Ejemplo
                </button>
                <button
                    onClick={calcularVolumen}
                    className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                    Calcular
                </button>
                <button
                    onClick={limpiarCampos}
                    className="px-5 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
                >
                    Limpiar
                </button>
            </div>

            {/* Mensaje de Error */}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            {/* Resultados */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Resultados</h3>
                <p className="text-lg font-medium text-gray-700">
                    <strong className="text-blue-700">Volumen de Infiltración:</strong>
                    <span className="font-bold">{volumen ? `${volumen} pulg³` : ' Sin calcular'}</span>
                </p>
                <h4 className="text-lg font-semibold text-gray-800 mt-4">Tiempos Ingresados:</h4>
                <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                    {tiempos.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700">
                            {tiempos.map((t, i) => <li key={i} className="ml-4">{t} h</li>)}
                        </ul>
                    ) : (
                        <p className="text-gray-500 ml-4">Sin datos</p>
                    )}
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mt-4">Infiltraciones Calculadas:</h4>
                <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                    {infiltraciones.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700">
                            {infiltraciones.map((f, i) => <li key={i} className="ml-4">{f} pulg/h</li>)}
                        </ul>
                    ) : (
                        <p className="text-gray-500 ml-4">Sin datos</p>
                    )}
                </div>
            </div>

            {graficaVisible && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6 flex flex-col items-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                        Gráfica del Volumen de Infiltración
                    </h3>
                    <div className="w-full flex justify-center">
                        <Chart
                            chartType="LineChart"
                            width="100%"
                            height="400px"
                            data={data}
                            options={options}
                            className="max-w-3xl w-full"
                        />
                    </div>
                </div>
            )}

            {/* Modal para la Imagen del Experimento */}
            {isExperimentoModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Fondo semitransparente */}
                    <div 
                        className="absolute inset-0 bg-black opacity-50" 
                        onClick={() => setIsExperimentoModalOpen(false)}
                    ></div>
                    <div className="bg-white p-4 rounded-lg relative z-10 max-w-md mx-auto">
                        <button 
                            onClick={() => setIsExperimentoModalOpen(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            Cerrar
                        </button>
                        <img
                            src="/images/tablaHorton.jpg"
                            alt="Imagen del Experimento"
                            className="max-w-full max-h-full"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExperimentoInfiltracion;
