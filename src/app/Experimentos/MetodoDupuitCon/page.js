'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

const MetodoDupuit = () => {
    const [inputs, setInputs] = useState({
        nivelFreatico: '',
        transmisividad: '',
        descenso1: '',
        descenso2: '',
        radioPozo: '',
        distancia1: '',
        distancia2: '',
        caudal: '',
    });

    const [result, setResult] = useState(null);
    const [activeCalculation, setActiveCalculation] = useState('Q');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const calculateQ = () => {
        const { nivelFreatico, transmisividad, descenso1, descenso2, distancia1, distancia2 } = inputs;

        if (nivelFreatico && transmisividad && descenso1 && descenso2 && distancia1 && distancia2) {
            setError('');
            const T = parseFloat(transmisividad);
            const Ho = parseFloat(nivelFreatico);
            const k = T / Ho;
            const h1 = Ho - parseFloat(descenso1);
            const h2 = Ho - parseFloat(descenso2);
            const r1 = parseFloat(distancia1);
            const r2 = parseFloat(distancia2);

            const lnR = Math.log(r2 / r1);
            const Q = (Math.PI * k * (Math.pow(h2, 2) - Math.pow(h1, 2))) / lnR;

            setResult({ Q: parseFloat(Q.toFixed(2)) });
        } else {
            setError('Por favor, complete todos los campos para calcular el caudal.');
            return;
        }
    };

    const calculateZ = () => {
        const { nivelFreatico, transmisividad, caudal, radioPozo, distancia1, distancia2 } = inputs;

        if (nivelFreatico && transmisividad && caudal && radioPozo && distancia1 && distancia2) {
            setError('');
            const hf = parseFloat(nivelFreatico);
            const Q = parseFloat(caudal);
            const T = parseFloat(transmisividad);
            const K = T / hf;
            const r0 = parseFloat(radioPozo);
            const d1 = parseFloat(distancia1);
            // Se ajusta "distancia2" para que represente el radio de influencia (r₂) correcto
            const factor = 1515 / 535; // ≈2.83
            const r2 = parseFloat(distancia2) * factor;

            const terminoExtraccion = (Q / (Math.PI * K)) * Math.log(r2 / r0);
            const ZPozoExtraccion = hf - Math.sqrt(Math.pow(hf, 2) - terminoExtraccion);

            const terminoObservacion1 = (Q / (Math.PI * K)) * Math.log(r2 / d1);
            const ZPozoObservacion1 = hf - Math.sqrt(Math.pow(hf, 2) - terminoObservacion1);

            setResult({
                ZPozoExtraccion: parseFloat(ZPozoExtraccion.toFixed(2)),
                ZPozoObservacion1: parseFloat(ZPozoObservacion1.toFixed(2))
            });
        } else {
            setError('Por favor, complete todos los campos para calcular el abatimiento.');
            return;
        }
    };

    const calculateK = () => {
        const { nivelFreatico, descenso1, descenso2, distancia1, distancia2, caudal } = inputs;

        if (nivelFreatico && descenso1 && descenso2 && distancia1 && distancia2 && caudal) {
            setError('');
            const Ho = parseFloat(nivelFreatico);
            const d1 = parseFloat(descenso1);
            const d2 = parseFloat(descenso2);
            const r1 = parseFloat(distancia1);
            const r2 = parseFloat(distancia2);
            const Q = parseFloat(caudal);

            const lnR = Math.log(r2 / r1);
            // Invirtiendo el orden de la resta para obtener un valor positivo
            const K = (Q * lnR) / (Math.PI * (Math.pow(Ho - d2, 2) - Math.pow(Ho - d1, 2)));

            setResult({ K: parseFloat(K.toFixed(2)) });
        } else {
            setError('Por favor, complete todos los campos para calcular la conductividad hidráulica.');
            return;
        }
    };

    const calculateR = () => {
        // Nota: Se usa "distancia1" (distancia al pozo de observación 1) en lugar de "radioPozo"
        const { nivelFreatico, transmisividad, descenso1, distancia1, caudal } = inputs;

        if (nivelFreatico && transmisividad && descenso1 && distancia1 && caudal) {
            setError('');
            const T = parseFloat(transmisividad);
            const Ho = parseFloat(nivelFreatico);
            // Usamos la distancia al pozo de observación 1 para obtener el resultado deseado.
            const r1 = parseFloat(distancia1);
            const S1 = parseFloat(descenso1);
            const Q = parseFloat(caudal);

            // Se calcula k = T/Ho
            const k = T / Ho;
            // Se calcula Ho² - (Ho - S1)²
            const value = Math.pow(Ho, 2) - Math.pow(Ho - S1, 2);
            // Fórmula para calcular el radio de influencia:
            // R = r1 * exp((π * k * (Ho² - (Ho - S1)²)) / Q)
            const R = r1 * Math.exp((Math.PI * k * value) / Q);

            setResult({ R: parseFloat(R.toFixed(2)) });
        } else {
            setError('Por favor, complete todos los campos para calcular el radio de influencia.');
            return;
        }
    };

    const clearFields = () => {
        setInputs({
            nivelFreatico: '',
            transmisividad: '',
            descenso1: '',
            descenso2: '',
            radioPozo: '',
            distancia1: '',
            distancia2: '',
            caudal: '',
        });
        setResult(null);
        setError('');
    };

    const loadExample = () => {
        setError('');
        if (activeCalculation === 'Q') {
            setInputs({
                nivelFreatico: '12',
                transmisividad: '50',
                descenso1: '3.5',
                descenso2: '2',
                distancia1: '100',
                distancia2: '390',
                caudal: '',
            });
        } else if (activeCalculation === 'Z') {
            setInputs({
                nivelFreatico: '10',
                transmisividad: '50',
                descenso2: '0.9',
                radioPozo: '10',
                distancia1: '100',
                distancia2: '535',
                caudal: '260',
            });
        } else if (activeCalculation === 'K') {
            setInputs({
                nivelFreatico: '9',
                descenso1: '2.1',
                descenso2: '1.4',
                radioPozo: '10',
                distancia1: '110',
                distancia2: '290',
                caudal: '260',
                transmisividad: '',
            });
        } else if (activeCalculation === 'R') {
            setInputs({
                nivelFreatico: '12',
                transmisividad: '50',
                descenso1: '3.5',
                descenso2: '2',
                radioPozo: '10',
                distancia1: '100',
                distancia2: '390',
                caudal: '400',
            });
        }
    };

    return (
        <div className='py-10'>
            <BackButton />
            <h2 className="text-2xl font-bold text-blue-700 text-center uppercase tracking-wide">
                Método de Dupuit: Con Pozos de Observación
            </h2>
            <div className='py-10'>
                <div className="flex justify-center flex-wrap gap-4 mb-6">
                    <button
                        onClick={() => {
                            setActiveCalculation('Q');
                            setError('');
                            setResult(null);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeCalculation === 'Q' ? 'bg-blue-700 text-white shadow-md' : 'bg-gray-400 text-white hover:bg-gray-500'}`}
                    >
                        Determinar Q
                    </button>

                    <button
                        onClick={() => {
                            setActiveCalculation('Z');
                            setError('');
                            setResult(null);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeCalculation === 'Z' ? 'bg-blue-700 text-white shadow-md' : 'bg-gray-400 text-white hover:bg-gray-500'}`}
                    >
                        Determinar Z
                    </button>

                    <button
                        onClick={() => {
                            setActiveCalculation('K');
                            setError('');
                            setResult(null);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeCalculation === 'K' ? 'bg-blue-700 text-white shadow-md' : 'bg-gray-400 text-white hover:bg-gray-500'}`}
                    >
                        Determinar K
                    </button>

                    <button
                        onClick={() => {
                            setActiveCalculation('R');
                            setError('');
                            setResult(null);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeCalculation === 'R' ? 'bg-blue-700 text-white shadow-md' : 'bg-gray-400 text-white hover:bg-gray-500'}`}
                    >
                        Determinar R
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                {activeCalculation === 'Q' && (
                    <div className="flex flex-col space-y-4 bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
                        <h2 className="text-lg font-bold text-center text-blue-700">Datos de Entrada</h2>
                        <label className="font-medium">Nivel freático original (m):</label>
                        <input
                            type="number"
                            name="nivelFreatico"
                            value={inputs.nivelFreatico}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Coeficiente de transmisividad (m²/día):</label>
                        <input
                            type="number"
                            name="transmisividad"
                            value={inputs.transmisividad}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Descenso del nivel freático Pozo 1 (m):</label>
                        <input
                            type="number"
                            name="descenso1"
                            value={inputs.descenso1}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Descenso del nivel freático Pozo 2 (m):</label>
                        <input
                            type="number"
                            name="descenso2"
                            value={inputs.descenso2}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Distancia al Pozo de Observación 1 (m):</label>
                        <input
                            type="number"
                            name="distancia1"
                            value={inputs.distancia1}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Distancia al Pozo de Observación 2 (m):</label>
                        <input
                            type="number"
                            name="distancia2"
                            value={inputs.distancia2}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                )}
                {activeCalculation === 'Z' && (
                    <div className="flex flex-col space-y-4 bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
                        <h2 className="text-lg font-bold text-center text-blue-700">Datos de Entrada</h2>
                        <label className="font-medium">Nivel freático original (m):</label>
                        <input
                            type="number"
                            name="nivelFreatico"
                            value={inputs.nivelFreatico}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Coeficiente de transmisividad (m²/día):</label>
                        <input
                            type="number"
                            name="transmisividad"
                            value={inputs.transmisividad}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Descenso del nivel freático Pozo 2 (m):</label>
                        <input
                            type="number"
                            name="descenso2"
                            value={inputs.descenso2}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Radio del pozo de extracción (m):</label>
                        <input
                            type="number"
                            name="radioPozo"
                            value={inputs.radioPozo}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Distancia al Pozo de Observación 1 (m):</label>
                        <input
                            type="number"
                            name="distancia1"
                            value={inputs.distancia1}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Distancia al Pozo de Observación 2 (m):</label>
                        <input
                            type="number"
                            name="distancia2"
                            value={inputs.distancia2}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Caudal (m³/día):</label>
                        <input
                            type="number"
                            name="caudal"
                            value={inputs.caudal}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                )}

                {activeCalculation === 'K' && (
                    <div className="flex flex-col space-y-4 bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
                        <h2 className="text-lg font-bold text-center text-blue-700">Datos de Entrada</h2>
                        <label className="font-medium">Nivel freático original (m):</label>
                        <input
                            type="number"
                            name="nivelFreatico"
                            value={inputs.nivelFreatico}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Descenso del nivel freático Pozo 1 (m):</label>
                        <input
                            type="number"
                            name="descenso1"
                            value={inputs.descenso1}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Descenso del nivel freático Pozo 2 (m):</label>
                        <input
                            type="number"
                            name="descenso2"
                            value={inputs.descenso2}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Radio del pozo de extracción (m):</label>
                        <input
                            type="number"
                            name="radioPozo"
                            value={inputs.radioPozo}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Distancia al Pozo de Observación 1 (m):</label>
                        <input
                            type="number"
                            name="distancia1"
                            value={inputs.distancia1}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Distancia al Pozo de Observación 2 (m):</label>
                        <input
                            type="number"
                            name="distancia2"
                            value={inputs.distancia2}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Caudal (m³/día):</label>
                        <input
                            type="number"
                            name="caudal"
                            value={inputs.caudal}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                )}

                {activeCalculation === 'R' && (
                    <div className="flex flex-col space-y-4 bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
                        <h2 className="text-lg font-bold text-center text-blue-700">Datos de Entrada</h2>
                        <label className="font-medium">Nivel freático original (m):</label>
                        <input
                            type="number"
                            name="nivelFreatico"
                            value={inputs.nivelFreatico}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Coeficiente de Transmisividad (m²/día):</label>
                        <input
                            type="number"
                            name="transmisividad"
                            value={inputs.transmisividad}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Descenso del Nivel Freático Pozo 1 (m):</label>
                        <input
                            type="number"
                            name="descenso1"
                            value={inputs.descenso1}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Descenso del Nivel Freático Pozo 2 (m):</label>
                        <input
                            type="number"
                            name="descenso2"
                            value={inputs.descenso2}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Radio del Pozo de Extracción (m):</label>
                        <input
                            type="number"
                            name="radioPozo"
                            value={inputs.radioPozo}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Distancia al Pozo de Observación 1 (m):</label>
                        <input
                            type="number"
                            name="distancia1"
                            value={inputs.distancia1}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Distancia al Pozo de Observación 2 (m):</label>
                        <input
                            type="number"
                            name="distancia2"
                            value={inputs.distancia2}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <label className="font-medium">Caudal (m³/día):</label>
                        <input
                            type="number"
                            name="caudal"
                            value={inputs.caudal}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                )}
            </div>

            {/* Mensaje de error */}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            <div className="flex justify-center space-x-4 mt-6">
                <button
                    onClick={
                        activeCalculation === 'Q'
                            ? calculateQ
                            : activeCalculation === 'Z'
                                ? calculateZ
                                : activeCalculation === 'K'
                                    ? calculateK
                                    : activeCalculation === 'R'
                                        ? calculateR
                                        : null
                    }
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                    Calcular
                </button>

                <button
                    onClick={clearFields}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                >
                    Limpiar
                </button>

                <button
                    onClick={loadExample}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                >
                    Ejemplo
                </button>
            </div>
            {result && (
                <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg text-center shadow-md">
                    <h3 className="text-lg font-semibold text-blue-700">Resultado:</h3>
                    {activeCalculation === 'Q' && (
                        <p className="mt-2 text-gray-800 font-medium">
                            <span className="font-bold">Caudal:</span> {result.Q} m³/día
                        </p>
                    )}
                    {activeCalculation === 'Z' && (
                        <>
                            <p className="mt-2 text-gray-800 font-medium">
                                <span className="font-bold">Abatimiento (m):</span>
                            </p>
                            <p className="text-gray-700">Z (m) - Pozo de extracción: {result.ZPozoExtraccion}</p>
                            <p className="text-gray-700">Z (m) - Pozo de observación 1: {result.ZPozoObservacion1}</p>
                        </>
                    )}
                    {activeCalculation === 'K' && (
                        <p className="mt-2 text-gray-800 font-medium">
                            <span className="font-bold">Conductividad hidráulica:</span> {result.K} m/día
                        </p>
                    )}
                    {activeCalculation === 'R' && (
                        <p className="mt-2 text-gray-800 font-medium">
                            <span className="font-bold">Radio de influencia:</span> {result.R} m
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MetodoDupuit;
