'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

const ExperimentoInfiltracion = () => {
    const [porosidadEfectiva, setPorosidadEfectiva] = useState('');
    const [porosidad, setPorosidad] = useState('');
    const [cabezaSuccion, setCabezaSuccion] = useState('');
    const [conductividadHidraulica, setConductividadHidraulica] = useState('');
    const [tiempo, setTiempo] = useState('');
    const [saturacionEfectiva, setSaturacionEfectiva] = useState('');
    const [cambioContenidoHumedad, setCambioContenidoHumedad] = useState('');
    const [contenidoResidualHumedad, setContenidoResidualHumedad] = useState('');
    const [fInicial, setFInicial] = useState('');
    const [infiltracionAcumulada, setInfiltracionAcumulada] = useState('');
    const [tasaInfiltracion, setTasaInfiltracion] = useState('');
    const [intensidadLluvia, setIntensidadLluvia] = useState('');
    const [tiempoEncharcamiento, setTiempoEncharcamiento] = useState('');
    const [profundidadAguaInfiltrada, setProfundidadAguaInfiltrada] = useState('');
    const [calcularFInicial, setCalcularFInicial] = useState(false);
    const [error, setError] = useState('');
    // Estado para el modal de la imagen del experimento (desde el encabezado de Datos de Entrada)
    const [isExperimentoModalOpen, setIsExperimentoModalOpen] = useState(false);

    const cargarEjemplo = () => {
        setPorosidadEfectiva(0.486);
        setPorosidad(0.501);
        setCabezaSuccion(16.68);
        setConductividadHidraulica(0.65);
        setTiempo(1);
        setSaturacionEfectiva(0.3);
        if (calcularFInicial) {
            setFInicial((1 * 0.65).toFixed(2));
        } else {
            setFInicial('');
        }
        setError('');
    };

    const limpiarCampos = () => {
        setPorosidadEfectiva('');
        setPorosidad('');
        setCabezaSuccion('');
        setConductividadHidraulica('');
        setTiempo('');
        setSaturacionEfectiva('');
        setCambioContenidoHumedad('');
        setContenidoResidualHumedad('');
        setFInicial('');
        setInfiltracionAcumulada('');
        setTasaInfiltracion('');
        setIntensidadLluvia('');
        setTiempoEncharcamiento('');
        setProfundidadAguaInfiltrada('');
        setCalcularFInicial(false);
        setError('');
    };

    const calcularPrimeraParte = () => {
        if (porosidad === '' || porosidadEfectiva === '' || saturacionEfectiva === '') {
            setError('Por favor, ingresa todos los datos necesarios para calcular.');
            return;
        }
        setError('');
        const n = parseFloat(porosidad);
        const ne = parseFloat(porosidadEfectiva);
        const se = parseFloat(saturacionEfectiva);

        const tetaR = (n - ne).toFixed(5);
        const deltaTeta = ((1 - se) * ne).toFixed(5);

        setContenidoResidualHumedad(tetaR);
        setCambioContenidoHumedad(deltaTeta);

        if (calcularFInicial && tiempo && conductividadHidraulica) {
            const F = (parseFloat(tiempo) * parseFloat(conductividadHidraulica)).toFixed(2);
            setFInicial(F);
        }
    };

    const handleCheckChange = () => {
        setCalcularFInicial((prev) => !prev);
        if (!calcularFInicial && tiempo && conductividadHidraulica) {
            const F = (parseFloat(tiempo) * parseFloat(conductividadHidraulica)).toFixed(2);
            setFInicial(F);
        }
    };

    const calcularSegundaParte = () => {
        if (
            fInicial === '' ||
            cabezaSuccion === '' ||
            conductividadHidraulica === '' ||
            cambioContenidoHumedad === ''
        ) {
            setError('Por favor, completa los datos necesarios para calcular la infiltración acumulada.');
            return;
        }
        setError('');
        let x1 = parseFloat(fInicial);
        let x = 0;
        const k = parseFloat(conductividadHidraulica);
        const CabSu = parseFloat(cabezaSuccion);
        const CConH = parseFloat(cambioContenidoHumedad);

        do {
            x1 = x;
            x = (k * tiempo + CabSu * CConH * Math.log(1 + x1 / (CabSu * CConH))).toFixed(5);
        } while (Math.abs(x1 - x) > 0.001);

        setInfiltracionAcumulada(x);

        const tasaInf = (k * ((CabSu * CConH) / x + 1)).toFixed(5);
        setTasaInfiltracion(tasaInf);
    };

    const calcularTerceraParte = () => {
        if (intensidadLluvia === '' || conductividadHidraulica === '' || cambioContenidoHumedad === '') {
            setError('Por favor, completa los datos necesarios para calcular el tiempo de encharcamiento.');
            return;
        }
        setError('');
        const IP = parseFloat(intensidadLluvia);
        const k = parseFloat(conductividadHidraulica);
        const CabSu = parseFloat(cabezaSuccion);
        const CConH = parseFloat(cambioContenidoHumedad);

        const TE = ((k * CabSu * CConH) / (IP * (IP - k))).toFixed(5);
        const PA = (IP * TE).toFixed(5);

        setTiempoEncharcamiento(TE);
        setProfundidadAguaInfiltrada(PA);
    };

    return (
        <div className="container mx-auto max-w-3xl p-4">
            <BackButton />
            {/* Título Principal */}
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Infiltración Modelo GREEN AMPT
            </h1>

            {/* Sección de Datos de Entrada */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-300">
                {/* Encabezado con título y botón para mostrar imagen del experimento */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Datos de Entrada</h3>
                    <button
                        onClick={() => setIsExperimentoModalOpen(true)}
                        className="mt-2 px-2 py-1 bg-gray-700 text-white rounded text-sm"
                    >
                        Mostrar Tabla
                    </button>
                </div>
                {/* Grid de dos columnas: a la izquierda los inputs y a la derecha la imagen */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid grid-cols-1 gap-6">
                        {[
                            { label: "Porosidad Efectiva:", value: porosidadEfectiva, setter: setPorosidadEfectiva },
                            { label: "Porosidad:", value: porosidad, setter: setPorosidad },
                            { label: "Cabeza de Succión en el Frente Mojado (cm):", value: cabezaSuccion, setter: setCabezaSuccion },
                            { label: "Conductividad Hidráulica (K) (cm/h):", value: conductividadHidraulica, setter: setConductividadHidraulica },
                            { label: "Tiempo (horas):", value: tiempo, setter: setTiempo },
                            { label: "Saturación Efectiva Se:", value: saturacionEfectiva, setter: setSaturacionEfectiva }
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
                    <div className="flex flex-col items-center">
                        <img
                            src="/images/imageGreenAmpt.jpg"
                            alt="Imagen de Datos de Entrada"
                            className="w-full rounded-lg"
                        />
                        <p className="mt-2 text-sm text-gray-600 text-center">
                            Este modelo requiere estimaciones de la Conductividad Hidráulica (K), de la Porosidad (n) y de la Cabeza de Succión del Suelo en el Frente Mojado, esto lo podemos hacer mediante la sigueinte tabla.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sección de Botones */}
            <div className="mt-6 flex justify-center gap-4">
                <button
                    onClick={cargarEjemplo}
                    className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                    Ejemplo
                </button>
                <button
                    onClick={calcularPrimeraParte}
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

            {/* Mensaje de Error */}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            {/* Resultados de la Primera Parte y su imagen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-300">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Resultados</h3>
                    <div className="text-gray-700 space-y-2">
                        <p className="text-lg font-medium">
                            Contenido Residual de Humedad del Suelo:
                            <span className="font-bold text-blue-700"> {contenidoResidualHumedad || '--'}</span>
                        </p>
                        <p className="text-lg font-medium">
                            Cambio en el Contenido de Humedad:
                            <span className="font-bold text-blue-700"> {cambioContenidoHumedad || '--'}</span>
                        </p>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={calcularFInicial}
                            onChange={handleCheckChange}
                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <label className="text-gray-800 font-medium">F(t) = kt Calculado</label>
                    </div>
                    <div className="mt-4 flex flex-col">
                        <label className="text-gray-700 font-medium">F(t) Valor Inicial (Opcional):</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={fInicial}
                                onChange={(e) => setFInicial(e.target.value)}
                                placeholder="Opcional"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                            <span className="text-gray-700">cm</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <img
                        src="/images/imageGreenAmpt2.jpg"
                        alt="Imagen de Resultados"
                        className="w-full rounded-lg"
                    />
                    <p className="mt-2 text-sm text-gray-600 text-center">
                    Perfiles de humedad del suelo antes, durante y despues del encharcamiento.
                    </p>
                </div>
            </div>

            {/* Sección de Infiltración Acumulada */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-300 mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Infiltración Acumulada</h3>
                <button
                    onClick={calcularSegundaParte}
                    className="w-full px-5 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
                >
                    Calcular F
                </button>
                <div className="mt-4 text-gray-700 space-y-2">
                    <p className="text-lg font-medium">
                        Infiltración Acumulada F:
                        <span className="font-bold text-blue-700"> {infiltracionAcumulada || '--'}</span> cm
                    </p>
                    <p className="text-lg font-medium">
                        Tasa de Infiltración:
                        <span className="font-bold text-blue-700"> {tasaInfiltracion || '--'}</span> cm/h
                    </p>
                </div>
            </div>

            {/* Sección de Tiempo de Encharcamiento */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Tiempo de Encharcamiento</h3>
                <div className="mb-4">
                    <label className="text-gray-700 font-medium block mb-1">Intensidad de Lluvia (cm/h):</label>
                    <input
                        type="number"
                        value={intensidadLluvia}
                        onChange={(e) => setIntensidadLluvia(e.target.value)}
                        placeholder="Ingrese un valor"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>
                <button
                    onClick={calcularTerceraParte}
                    className="w-full px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                    Calcular Tiempo de Encharcamiento
                </button>
                <div className="mt-4 text-gray-700">
                    <p className="text-lg font-medium">
                        Tiempo de Encharcamiento:
                        <span className="font-bold text-blue-700"> {tiempoEncharcamiento || '--'}</span> horas
                    </p>
                    <p className="text-lg font-medium">
                        Profundidad de Agua Infiltrada:
                        <span className="font-bold text-blue-700"> {profundidadAguaInfiltrada || '--'}</span> cm
                    </p>
                </div>
            </div>

            {/* Modal para la Imagen del Experimento */}
            {isExperimentoModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
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
                            src="/images/tablaGreenAmpt.jpg"
                            alt="Imagen Experimento"
                            className="max-w-full max-h-full"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExperimentoInfiltracion;
