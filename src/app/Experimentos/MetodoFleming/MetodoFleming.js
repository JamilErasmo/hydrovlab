import React, { useState } from 'react';

const ExperimentoFlemingInerhi = () => {
    const [caudal, setCaudal] = useState('');
    const [factorSeleccionado, setFactorSeleccionado] = useState('0'); // Selección inicial
    const [factorA, setFactorA] = useState('');
    const [factorN, setFactorN] = useState('');
    const [resultadoFleming, setResultadoFleming] = useState(null);
    const [resultadoInerhi, setResultadoInerhi] = useState(null);

    const factores = [
        { label: 'Variada, de hojas anchas y coníferas', a: 117, n: 1.02 },
        { label: 'Floresta conífera y pastos altos', a: 3523, n: 0.82 },
        { label: 'Pastos bajos y arbustos', a: 19260, n: 0.65 },
        { label: 'Desiertos y arbustos', a: 37730, n: 0.72 },
    ];

    // Función para cargar valores de ejemplo
    const cargarEjemplo = () => {
        setCaudal(80);
        setFactorSeleccionado('0'); // Primer factor
        setFactorA(117);
        setFactorN(1.02);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setCaudal('');
        setFactorSeleccionado('0');
        setFactorA('');
        setFactorN('');
        setResultadoFleming(null);
        setResultadoInerhi(null);
    };

    // Función para calcular los resultados
    const calcular = () => {
        const { a, n } = factores[factorSeleccionado];
        const Q = parseFloat(caudal);

        if (isNaN(Q) || Q <= 0) {
            alert('Por favor, ingresa un valor válido para el caudal.');
            return;
        }

        // Método de Fleming
        const Q_fleming = Q * (1 / 0.0283);
        const gBS_fleming = a * Math.pow(Q_fleming, n);

        // Método de INERHI
        const Q_inerhi = 3.7376 * Math.pow(Q, 1.2574);
        const gBS_inerhi = Q_inerhi * 365;

        setResultadoFleming(gBS_fleming.toFixed(3));
        setResultadoInerhi(gBS_inerhi.toFixed(3));
    };

    // Actualizar factores dinámicamente al seleccionar una opción
    const actualizarFactores = (index) => {
        setFactorSeleccionado(index);
        setFactorA(factores[index].a);
        setFactorN(factores[index].n);
    };

    return (
        <div>
            <h1>Experimento Fleming e INERHI</h1>
            <div>
                <h3>Datos de Entrada</h3>
                <label>Caudal Q (m³/s): </label>
                <input
                    type="number"
                    value={caudal}
                    onChange={(e) => setCaudal(e.target.value)}
                    placeholder="Ingresa el caudal"
                />
                <br />
                <label>Factor (a y n): </label>
                <select
                    value={factorSeleccionado}
                    onChange={(e) => actualizarFactores(e.target.value)}
                >
                    {factores.map((f, index) => (
                        <option key={index} value={index}>
                            {f.label}
                        </option>
                    ))}
                </select>
                <br />
                <label>Factor a: </label>
                <input
                    type="number"
                    value={factorA}
                    readOnly
                />
                <br />
                <label>Factor n: </label>
                <input
                    type="number"
                    value={factorN}
                    readOnly
                />
            </div>

            <div style={{ marginTop: '20px' }}>
                <button onClick={cargarEjemplo}>Ejemplo</button>
                <button onClick={calcular} style={{ marginLeft: '10px' }}>
                    Calcular
                </button>
                <button onClick={limpiarCampos} style={{ marginLeft: '10px' }}>
                    Limpiar
                </button>
            </div>

            {resultadoFleming !== null && resultadoInerhi !== null && (
                <div style={{ marginTop: '30px' }}>
                    <h2>Resultados</h2>
                    <div style={{ marginBottom: '20px' }}>
                        <h3>FLEMING</h3>
                        <p>
                            <em>Fórmula:</em> <strong>gBS = a * Q<sup>n</sup></strong>
                        </p>
                        <p>
                            <strong>Cantidad de Sedimentos gBS (Ton/año):</strong> {resultadoFleming}
                        </p>
                    </div>
                    <div>
                        <h3>INERHI</h3>
                        <p>
                            <em>Fórmula:</em> <strong>gBS = 3.7376 * Q<sup>1.2574</sup> * 365</strong>
                        </p>
                        <p>
                            <strong>Cantidad de Sedimentos gBS (Ton/año):</strong> {resultadoInerhi}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExperimentoFlemingInerhi;
