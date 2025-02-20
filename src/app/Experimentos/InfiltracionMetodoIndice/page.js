'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

const HidrogramaExperimento = () => {
    const [areaCuenca, setAreaCuenca] = useState('');
    const [numDatos, setNumDatos] = useState('');
    const [intervalosTiempo, setIntervalosTiempo] = useState('');
    const [picoX, setPicoX] = useState('');
    const [picoY, setPicoY] = useState('');
    const [p1X, setP1X] = useState('');
    const [p1Y, setP1Y] = useState('');
    const [p2X, setP2X] = useState('');
    const [p2Y, setP2Y] = useState('');
    const [listX, setListX] = useState([]);
    const [listY, setListY] = useState([]);
    const [volumenEscurrimientoDirecto, setVolumenEscurrimientoDirecto] = useState(null);
    const [hpe, setHpe] = useState(null);
    const [indiceFi, setIndiceFi] = useState(null);
    const [checkTiempo, setCheckTiempo] = useState(false);
    const [altura, setAltura] = useState('');

    const cargarEjemplo = () => {
        setAreaCuenca(36);
        setNumDatos(6);
        setIntervalosTiempo(1);
        setPicoX(10);
        setPicoY(8);
        setP1X(6);
        setP1Y(1);
        setP2X(16);
        setP2Y(1);
        setListX([1, 2, 3, 4, 5, 6]);
        setListY([5.35, 3.07, 2.79, 4.45, 2.2, 0.6]);
        setVolumenEscurrimientoDirecto(null);
        setHpe(null);
        setIndiceFi(null);
        setCheckTiempo(true);
    };

    const limpiarCampos = () => {
        setAreaCuenca('');
        setNumDatos('');
        setIntervalosTiempo('');
        setPicoX('');
        setPicoY('');
        setP1X('');
        setP1Y('');
        setP2X('');
        setP2Y('');
        setListX([]);
        setListY([]);
        setVolumenEscurrimientoDirecto(null);
        setHpe(null);
        setIndiceFi(null);
        setCheckTiempo(false);
        setAltura('');
    };

    const generarIntervalosConCheckbox = () => {
        if (!intervalosTiempo || !numDatos) {
            alert('Por favor, completa los campos de intervalos de tiempo y número de datos.');
            setCheckTiempo(false);
            return;
        }

        const intervalos = Array.from({ length: parseInt(numDatos) }, (_, i) => (i + 1) * parseFloat(intervalosTiempo));
        setListX(intervalos);
        alert('Intervalos de tiempo generados. Ahora puedes agregar alturas.');
    };

    const agregarAltura = () => {
        if (!altura || listY.length >= listX.length) {
            alert('Ingresa una altura válida o verifica que no hayas excedido el número de datos.');
            return;
        }

        setListY([...listY, parseFloat(altura)]);
        setAltura('');
    };

    const calcularResultados = () => {
        if (!areaCuenca || !numDatos || !picoX || !picoY || !p1X || !p1Y || !p2X || !p2Y || listY.length !== listX.length) {
            alert('Asegúrate de ingresar todos los datos necesarios correctamente.');
            return;
        }

        const p1x = parseFloat(p1X);
        const picox = parseFloat(picoX);
        const p2x = parseFloat(p2X);
        const p1y = parseFloat(p1Y);
        const picoy = parseFloat(picoY);
        const p2y = parseFloat(p2Y);
        const Ac = parseFloat(areaCuenca);

        const a1 = (p1x * picoy) + (picox * p2y) + (p2x * p1y);
        const a2 = (p1y * picox) + (picoy * p2x) + (p2y * p1x);
        const volumen = Math.abs(a1 - a2) / 2 * 3600;
        const hpeCalc = (volumen / (Ac * 1000000)) * 1000;

        let fi = 0.1;
        let inVecY = [];
        let b3 = 0;
        const int = parseFloat(intervalosTiempo);

        do {
            // eslint-disable-next-line no-loop-func
            inVecY = listY.map((y) => Math.max((y - fi) * int, 0));
            b3 = inVecY.reduce((sum, value) => sum + value, 0);
            fi += 0.001;
        } while (Math.abs(b3 - hpeCalc) > 0.001);

        setVolumenEscurrimientoDirecto(volumen.toFixed(2));
        setHpe(hpeCalc.toFixed(2));
        setIndiceFi(fi.toFixed(3));
    };

    return (
        <div className="container mx-auto max-w-3xl p-4">
            {/* Contenedor Principal */}
            <div className="bg-white p-6 shadow-md rounded-lg border border-gray-300 mt-6">
            <BackButton />

                {/* Título Principal */}
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Infiltración - Método Índice de Infiltración Media
                </h1>

                {/* Sección de Entrada de Datos */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-300 mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Datos de Entrada</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { label: "Área Cuenca (Km²):", value: areaCuenca, setter: setAreaCuenca },
                            { label: "Número de Datos del Hietograma:", value: numDatos, setter: setNumDatos }
                        ].map((item, index) => (
                            <div key={index} className="flex flex-col">
                                <label className="text-gray-700 font-medium">{item.label}</label>
                                <input
                                    type="number"
                                    value={item.value}
                                    onChange={(e) => item.setter(e.target.value)}
                                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sección de Coordenadas del Triángulo */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-300 mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Coordenadas del Triángulo</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { label: "Pico X:", value: picoX, setter: setPicoX },
                            { label: "Pico Y:", value: picoY, setter: setPicoY },
                            { label: "P1 X Ascendente:", value: p1X, setter: setP1X },
                            { label: "P1 Y Ascendente:", value: p1Y, setter: setP1Y },
                            { label: "P2 X Descendente:", value: p2X, setter: setP2X },
                            { label: "P2 Y Descendente:", value: p2Y, setter: setP2Y }
                        ].map((item, index) => (
                            <div key={index} className="flex flex-col">
                                <label className="text-gray-700 font-medium">{item.label}</label>
                                <input
                                    type="number"
                                    value={item.value}
                                    onChange={(e) => item.setter(e.target.value)}
                                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sección del Hietograma */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-300 mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Hietograma</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">Intervalos de Tiempo (Horas):</label>
                            <input
                                type="number"
                                value={intervalosTiempo}
                                onChange={(e) => setIntervalosTiempo(e.target.value)}
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={checkTiempo}
                                onChange={(e) => {
                                    setCheckTiempo(e.target.checked);
                                    if (e.target.checked) generarIntervalosConCheckbox();
                                }}
                                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            />
                            <label className="text-gray-700 font-medium">Generar Intervalos de Tiempo</label>
                        </div>
                    </div>

                    {/* Altura del Hietograma */}
                    <div className="mt-4 flex flex-col">
                        <label className="text-gray-700 font-medium">Altura HP Hietograma (mm):</label>
                        <div className="flex gap-3">
                            <input
                                type="number"
                                value={altura}
                                onChange={(e) => setAltura(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                            <button
                                onClick={agregarAltura}
                                className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                            >
                                Agregar
                            </button>
                        </div>
                    </div>

                    {/* Lista del Hietograma */}
                    <ul className="mt-4 list-disc pl-5 text-gray-700">
                        {listX.map((x, i) => (
                            <li key={i}>Tiempo: {x} horas - Altura: {listY[i] || 'Pendiente'} mm</li>
                        ))}
                    </ul>
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={cargarEjemplo}
                        className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                        Cargar Ejemplo
                    </button>

                    <button
                        onClick={calcularResultados}
                        className="px-5 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
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

                {/* Sección de Resultados */}
                <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-300 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Resultados</h3>
                    <p className="text-lg font-medium text-gray-700">Volumen de Escurrimiento Directo: <span className="font-bold text-blue-700">{volumenEscurrimientoDirecto || 'Sin calcular'}</span></p>
                    <p className="text-lg font-medium text-gray-700">HPE: <span className="font-bold text-blue-700">{hpe || 'Sin calcular'}</span> mm</p>
                    <p className="text-lg font-medium text-gray-700">Índice Fi: <span className="font-bold text-blue-700">{indiceFi || 'Sin calcular'}</span> mm</p>
                </div>

            </div>

        </div>
    );
};

export default HidrogramaExperimento;
