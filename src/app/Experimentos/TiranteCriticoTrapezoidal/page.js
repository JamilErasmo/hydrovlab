'use client';
import React, { useState } from 'react';
import '../App.css';

const TiranteCriticoTrapezoidal = () => {
    const [caudal, setCaudal] = useState('');
    const [anchoSolera, setAnchoSolera] = useState('');
    const [talud, setTalud] = useState('');
    const [tiranteInicial, setTiranteInicial] = useState('');
    const [errorDeseado, setErrorDeseado] = useState('');
    const [tiranteCritico, setTiranteCritico] = useState(null);

    // Función para cargar el ejemplo con los valores dados
    const cargarEjemplo = () => {
        setCaudal(2.5);
        setAnchoSolera(1.5);
        setTalud(1.5);
        setTiranteInicial(1.5);
        setErrorDeseado(1);
        setTiranteCritico(null);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setCaudal('');
        setAnchoSolera('');
        setTalud('');
        setTiranteInicial('');
        setErrorDeseado('');
        setTiranteCritico(null);
    };

    // Función para calcular el tirante crítico
    const calcular = () => {
        let Q = parseFloat(caudal);
        let B = parseFloat(anchoSolera);
        let z = parseFloat(talud);
        let y = parseFloat(tiranteInicial);
        let Er = parseFloat(errorDeseado);

        const C = Math.pow(Q, 2) / 9.81;
        let A, T, F, D, y1;

        do {
            A = (B + z * y) * y;
            T = B + 2 * z * y;
            F = Math.pow(A, 3) / T - C;
            D = 3 * Math.pow(A, 2) - (2 * z * Math.pow(A, 3)) / Math.pow(T, 2);
            y1 = y - F / D;
            y = y1;
        } while (Math.abs(F) >= Er);

        setTiranteCritico(y.toFixed(15));
    };

    return (
        <div className="app">
            <h1 className="experiment-title">Tirante Crítico en Sección Trapezoidal</h1>

            <div className="input-section">
                <h3 className="section-title">Datos de Entrada</h3>
                <label>Caudal Q (m³/s):</label>
                <input
                    type="number"
                    value={caudal}
                    onChange={(e) => setCaudal(e.target.value)}
                    className="input-field"
                />
                <label>Ancho de Solera B (m):</label>
                <input
                    type="number"
                    value={anchoSolera}
                    onChange={(e) => setAnchoSolera(e.target.value)}
                    className="input-field"
                />
                <label>Talud Z:</label>
                <input
                    type="number"
                    value={talud}
                    onChange={(e) => setTalud(e.target.value)}
                    className="input-field"
                />
                <label>Tirante Inicial Y (m):</label>
                <input
                    type="number"
                    value={tiranteInicial}
                    onChange={(e) => setTiranteInicial(e.target.value)}
                    className="input-field"
                />
                <label>Error Deseado:</label>
                <input
                    type="number"
                    value={errorDeseado}
                    onChange={(e) => setErrorDeseado(e.target.value)}
                    className="input-field"
                />
            </div>

            <div className="secondary-buttons">
                <button onClick={cargarEjemplo} className="example-button">
                    <span className="button-text">Ejemplo</span>
                </button>
                <button onClick={calcular} className="calculate-button">
                    <span className="button-text">Calcular</span>
                </button>
                <button onClick={limpiarCampos} className="clear-button">
                    <span className="button-text">Limpiar</span>
                </button>
            </div>

            {tiranteCritico && (
                <div className="results-section">
                    <h2 className="section-title">Resultados</h2>
                    <p>
                        <strong>Tirante Crítico:</strong> {tiranteCritico} m
                    </p>
                </div>
            )}
        </div>
    );
};

export default TiranteCriticoTrapezoidal;
