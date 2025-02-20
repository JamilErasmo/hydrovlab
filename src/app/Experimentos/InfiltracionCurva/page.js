'use client';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const NumeroCurvaYTiempoConcentracion = () => {
    const [areaCuenca, setAreaCuenca] = useState('');
    const [longitudCauce, setLongitudCauce] = useState('');
    const [pendienteCauce, setPendienteCauce] = useState('');
    const [precipitacionTotal, setPrecipitacionTotal] = useState('');
    const [usoTierra, setUsoTierra] = useState('');
    const [tratamientoSuelo, setTratamientoSuelo] = useState('');
    const [pendienteTerreno, setPendienteTerreno] = useState('');
    const [tipoSuelo, setTipoSuelo] = useState('');
    const [selectedCheck, setSelectedCheck] = useState('CN2');
    const [CN1, setCN1] = useState(null);
    const [CN2, setCN2] = useState(null);
    const [CN3, setCN3] = useState(null);
    const [precipitacionEfectiva, setPrecipitacionEfectiva] = useState(null);
    const [retencionSuperficial, setRetencionSuperficial] = useState(null);
    const [tcKirpich, setTcKirpich] = useState(null);
    const [tcCalifornia, setTcCalifornia] = useState(null);
    const [tcGiandotti, setTcGiandotti] = useState(null);
    const [tcTemez, setTcTemez] = useState(null);
    const [tcDefinitivo, setTcDefinitivo] = useState(null);
    const [hidrogramaParams, setHidrogramaParams] = useState(null);
    const [graficaDatos, setGraficaDatos] = useState(null);

    const usoTierraOpciones = [
        'Sin cultivo',
        'Cereales',
        'Leguminosas',
        'Pastos altos',
        'Pastos bajos',
        'Bosques de coníferas',
        'Bosques de hojas anchas',
        'Matorrales densos',
        'Matorrales dispersos',
        'Zonas urbanas densas',
        'Zonas urbanas dispersas',
        'Zonas desérticas',
        'Zonas agrícolas con terrazas',
        'Zonas agrícolas sin terrazas',
    ];

    const calcularCN = () => {
        let CN2Calculado = 77;
        if (usoTierra === 'Sin cultivo') {
            CN2Calculado = 77;
        }
        const CN1Calculado = (4.2 * CN2Calculado) / (10 - 0.058 * CN2Calculado);
        const CN3Calculado = (23 * CN2Calculado) / (10 + 0.13 * CN2Calculado);

        setCN1(Math.round(CN1Calculado));
        setCN2(Math.round(CN2Calculado));
        setCN3(Math.round(CN3Calculado));
        return CN2Calculado;
    };

    const calcularRetencionSuperficial = (CN2) => {
        const S = (25400 / CN2) - 254;
        setRetencionSuperficial(S.toFixed(2));
        return S;
    };

    const calcularPrecipitacionEfectiva = (CN2, S) => {
        if (precipitacionTotal) {
            const Pe = Math.pow(precipitacionTotal - (0.2 * S), 2) / (precipitacionTotal + (0.8 * S));
            setPrecipitacionEfectiva(Pe.toFixed(0));
        }
    };

    const calcularTiempoConcentracion = () => {
        const ac = parseFloat(areaCuenca);
        const L = parseFloat(longitudCauce);
        const J = parseFloat(pendienteCauce);

        if (!isNaN(ac) && !isNaN(L) && !isNaN(J) && ac > 0 && L > 0 && J > 0) {
            const Tc_k = (3.97 * Math.pow(L, 0.77) * Math.pow(J, -0.385)) / 60;
            setTcKirpich(Tc_k.toFixed(3));

            const Tc_C = 0.066 * Math.pow(L / Math.sqrt(J), 0.77);
            setTcCalifornia(Tc_C.toFixed(3));

            const Tc_G = (4 * Math.sqrt(ac) + 1.5 * L) / (25.3 * Math.sqrt(J * L));
            setTcGiandotti(Tc_G.toFixed(3));

            const Tc_T = 0.3 * Math.pow(L / Math.pow(J, 0.25), 0.77);
            setTcTemez(Tc_T.toFixed(3));

            setTcDefinitivo(Tc_k.toFixed(3));
        }
    };

    const calcularHidrograma = () => {
        const tr = (0.6 * tcDefinitivo).toFixed(3);
        const de = (2 * Math.sqrt(tcDefinitivo)).toFixed(3);
        const tp = (parseFloat(de) / 2 + parseFloat(tr)).toFixed(3);
        const tb = (2.67 * parseFloat(tp)).toFixed(3);

        // Fórmula corregida para Qp
        const qp = (0.208 * areaCuenca) / tp;
        const Q_p = (qp * precipitacionEfectiva).toFixed(3);

        setHidrogramaParams({
            tr: parseFloat(tr),
            de: parseFloat(de),
            tp: parseFloat(tp),
            tb: parseFloat(tb),
            Qp: parseFloat(Q_p),
        });

        // Preparar los datos para la gráfica triangular
        const array_Tr_x = [0, parseFloat(tp), parseFloat(tb)];
        const array_Tr_y = [0, parseFloat(Q_p), 0];

        setGraficaDatos({
            labels: array_Tr_x,
            datasets: [
                {
                    label: 'Hidrograma Triangular',
                    data: array_Tr_y,
                    borderColor: 'rgba(75,192,192,1)',
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    tension: 0.4,
                },
            ],
        });
    };

    const calcularHidrogramaUnitario = () => {
        const t_tp = [
            0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0,
            1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4,
            2.6, 2.8, 3.0, 3.5, 4.0, 4.5, 5.0,
        ];
        const Q_Qp = [
            0, 0.015, 0.075, 0.16, 0.28, 0.43, 0.6, 0.77, 0.89, 0.97, 1.0,
            0.98, 0.92, 0.84, 0.75, 0.65, 0.57, 0.43, 0.32, 0.24, 0.18,
            0.13, 0.098, 0.075, 0.036, 0.018, 0.009, 0.004,
        ];

        const tp = parseFloat(hidrogramaParams.tp);
        const Qpico = parseFloat(hidrogramaParams.Qp);

        const array_x = t_tp.map((t) => (t * tp).toFixed(3));
        const array_y = Q_Qp.map((q) => (q * Qpico).toFixed(3));

        setGraficaDatos({
            labels: array_x,
            datasets: [
                {
                    label: 'Hidrograma Unitario SCS',
                    data: array_y,
                    borderColor: 'rgba(255,99,132,1)',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    tension: 0.4,
                },
            ],
        });
    };

    useEffect(() => {
        if (precipitacionTotal) {
            const CN2 = calcularCN();
            const S = calcularRetencionSuperficial(CN2);
            calcularPrecipitacionEfectiva(CN2, S);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usoTierra, tratamientoSuelo, pendienteTerreno, tipoSuelo, precipitacionTotal]);

    const cargarEjemplo = () => {
        setAreaCuenca(25);
        setLongitudCauce(9);
        setPendienteCauce(0.011);
        setPrecipitacionTotal(200);
        setUsoTierra('Sin cultivo');
        setTratamientoSuelo('Surcos rectos');
        setPendienteTerreno('> 1');
        setTipoSuelo('Tipo A');
        setSelectedCheck('CN2');

        const CN2 = calcularCN();
        const S = calcularRetencionSuperficial(CN2);
        calcularPrecipitacionEfectiva(CN2, S);
        calcularTiempoConcentracion();
    };

    const limpiarCampos = () => {
        setAreaCuenca('');
        setLongitudCauce('');
        setPendienteCauce('');
        setPrecipitacionTotal('');
        setUsoTierra('');
        setTratamientoSuelo('');
        setPendienteTerreno('');
        setTipoSuelo('');
        setCN1(null);
        setCN2(null);
        setCN3(null);
        setSelectedCheck('');
        setPrecipitacionEfectiva(null);
        setRetencionSuperficial(null);
        setTcKirpich(null);
        setTcCalifornia(null);
        setTcGiandotti(null);
        setTcTemez(null);
        setTcDefinitivo(null);
        setHidrogramaParams(null);
    };
    return (
        <div className='py-8'>
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Cálculo del Número de Curva (CN) y Tiempo de Concentración
            </h1>

            {/* Sección de Datos de Entrada */}
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Datos de Entrada</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Área de la Cuenca Ac (km²):</label>
                        <input
                            type="number"
                            value={areaCuenca}
                            onChange={(e) => setAreaCuenca(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Longitud del Cauce Principal L (km):</label>
                        <input
                            type="number"
                            value={longitudCauce}
                            onChange={(e) => setLongitudCauce(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Pendiente Media del Cauce J (m/m):</label>
                        <input
                            type="number"
                            value={pendienteCauce}
                            onChange={(e) => setPendienteCauce(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Precipitación Total Pt (mm):</label>
                        <input
                            type="number"
                            value={precipitacionTotal}
                            onChange={(e) => setPrecipitacionTotal(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Uso de la Tierra y Cobertura:</label>
                        <select
                            value={usoTierra}
                            onChange={(e) => setUsoTierra(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccionar</option>
                            {usoTierraOpciones.map((opcion, index) => (
                                <option key={index} value={opcion}>
                                    {opcion}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Tratamiento del Suelo:</label>
                        <select
                            value={tratamientoSuelo}
                            onChange={(e) => setTratamientoSuelo(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccionar</option>
                            <option value="Surcos rectos">Surcos rectos</option>
                            <option value="Contorneo">Contorneo</option>
                            <option value="Terrazas">Terrazas</option>
                            <option value="No definido">No definido</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Pendiente del Terreno (%):</label>
                        <select
                            value={pendienteTerreno}
                            onChange={(e) => setPendienteTerreno(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccionar</option>
                            <option value="> 1">&gt; 1</option>
                            <option value="< 1">&lt; 1</option>
                            <option value="No definido">No definido</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Tipo de Suelo:</label>
                        <select
                            value={tipoSuelo}
                            onChange={(e) => setTipoSuelo(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccionar</option>
                            <option value="Tipo A">Tipo A</option>
                            <option value="Tipo B">Tipo B</option>
                            <option value="Tipo C">Tipo C</option>
                            <option value="Tipo D">Tipo D</option>
                        </select>
                    </div>
                </div>
            </div>


            {/* Resultados del Número de Curva (CN) */}
            <div className='py-8'>
                <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                        Resultados del Número de Curva (CN)
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="cnSelect"
                                checked={selectedCheck === 'CN1'}
                                onChange={() => setSelectedCheck('CN1')}
                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <label className="text-gray-600">CN1:</label>
                            <input
                                type="text"
                                value={CN1 !== null ? CN1 : ''}
                                readOnly
                                className="flex-1 px-3 py-2 border rounded-md focus:outline-none bg-gray-100"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="cnSelect"
                                checked={selectedCheck === 'CN2'}
                                onChange={() => setSelectedCheck('CN2')}
                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <label className="text-gray-600">CN2:</label>
                            <input
                                type="text"
                                value={CN2 !== null ? CN2 : ''}
                                readOnly
                                className="flex-1 px-3 py-2 border rounded-md focus:outline-none bg-gray-100"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="cnSelect"
                                checked={selectedCheck === 'CN3'}
                                onChange={() => setSelectedCheck('CN3')}
                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <label className="text-gray-600">CN3:</label>
                            <input
                                type="text"
                                value={CN3 !== null ? CN3 : ''}
                                readOnly
                                className="flex-1 px-3 py-2 border rounded-md focus:outline-none bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="text-gray-600 block mb-1">Precipitación Efectiva Pe (mm):</label>
                            <input
                                type="text"
                                value={precipitacionEfectiva || ''}
                                readOnly
                                className="w-full px-3 py-2 border rounded-md focus:outline-none bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="text-gray-600 block mb-1">Retención Superficial (mm):</label>
                            <input
                                type="text"
                                value={retencionSuperficial || ''}
                                readOnly
                                className="w-full px-3 py-2 border rounded-md focus:outline-none bg-gray-100"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Botones principales bajo los datos de entrada */}
            <div className="mt-5 text-center">
                {/* Botones de acción */}
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        onClick={cargarEjemplo}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    >
                        Ejemplo
                    </button>
                    <button
                        onClick={calcularTiempoConcentracion}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                    >
                        Calcular
                    </button>
                    <button
                        onClick={limpiarCampos}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                    >
                        Limpiar
                    </button>
                </div>

                {/* Resultados del Tiempo de Concentración */}
                <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                        Resultados del Tiempo de Concentración
                    </h3>

                    <div className="text-gray-700 space-y-2">
                        {tcKirpich && (
                            <p><strong className="text-blue-600">Fórmula de Kirpich (h):</strong> {tcKirpich}</p>
                        )}
                        {tcCalifornia && (
                            <p><strong className="text-blue-600">Fórmula California del U.S.B.R (h):</strong> {tcCalifornia}</p>
                        )}
                        {tcGiandotti && (
                            <p><strong className="text-blue-600">Fórmula de Giandotti (h):</strong> {tcGiandotti}</p>
                        )}
                        {tcTemez && (
                            <p><strong className="text-blue-600">Fórmula de Temez (h):</strong> {tcTemez}</p>
                        )}
                        {tcDefinitivo && (
                            <p className="text-lg font-bold text-gray-900">
                                <strong className="text-green-600">Tiempo de Concentración Definitivo Tc (h):</strong> {tcDefinitivo}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Botón para Graficar Hidrogramas */}
            {/* Botón para Graficar Hidrogramas */}
            {tcDefinitivo && (
                <div className="mt-5 text-center">
                    <button
                        onClick={calcularHidrograma}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    >
                        Graficar Hidrogramas
                    </button>
                </div>
            )}

            {/* Resultados del Hidrograma */}
            {hidrogramaParams && (
                <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                        Parámetros para la Construcción del Hidrograma
                    </h3>

                    <div className="text-gray-700 space-y-2">
                        <p><strong className="text-blue-600">Tiempo de Retraso tr (h):</strong> {hidrogramaParams.tr}</p>
                        <p><strong className="text-blue-600">Duración de Retraso de (h):</strong> {hidrogramaParams.de}</p>
                        <p><strong className="text-blue-600">Tiempo Pico tp (h):</strong> {hidrogramaParams.tp}</p>
                        <p><strong className="text-blue-600">Tiempo Base tb (h):</strong> {hidrogramaParams.tb}</p>
                        <p className="text-lg font-bold text-gray-900">
                            <strong className="text-green-600">Caudal Pico Qp (m³/s):</strong> {hidrogramaParams.Qp}
                        </p>
                    </div>

                    {/* Botones para Graficar */}
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={calcularHidrograma}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
                        >
                            Graficar Hidrograma Triangular
                        </button>
                        <button
                            onClick={calcularHidrogramaUnitario}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
                        >
                            Graficar Hidrograma Unitario
                        </button>
                    </div>
                </div>
            )}
            {/* Gráfica */}
            {graficaDatos && (
                <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
                    <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">
                        Gráfica del Hidrograma
                    </h3>
                    <div className="w-full">
                        <Line data={graficaDatos} />
                    </div>
                </div>
            )}

        </div>
    );
};

export default NumeroCurvaYTiempoConcentracion;