'use client';
import React, { useState } from 'react';
import '../App.css';

const TiranteConjugadoSTrapezoidal = () => {
    const [caudal, setCaudal] = useState('');
    const [anchoSolera, setAnchoSolera] = useState('');
    const [talud, setTalud] = useState('');
    const [tiranteInicial, setTiranteInicial] = useState('');
    const [jInicial, setJInicial] = useState('');
    const [resultados, setResultados] = useState({
        Y1: '',
        Y2: '',
        J: '',
        perdidaEnergia: '',
        alturaResalto: ''
    });

    // Función para limpiar los campos de entrada
    const limpiarCampos = () => {
        setCaudal('');
        setAnchoSolera('');
        setTalud('');
        setTiranteInicial('');
        setJInicial('');
        setResultados({
            Y1: '',
            Y2: '',
            J: '',
            perdidaEnergia: '',
            alturaResalto: ''
        });
    };

    // Función para calcular el tirante conjugado y otros resultados
    const calcular = () => {
        let Q = parseFloat(caudal);
        let B = parseFloat(anchoSolera);
        let Z = parseFloat(talud);
        let Y = parseFloat(tiranteInicial);
        let J = parseFloat(jInicial);

        let a, R, t, k1, k2, k3, k4, F, D, y1, y2, E1, A2, E2, E3, Y3;

        do {
            a = (B + (Z * Y)) * Y;
            R = Math.pow(Q, 2) / (19.62 * Y * Math.pow(a, 2));
            t = B / (Z * Y);
            k1 = (2.5 * t) + 1;
            k2 = ((1.5 * t) + 1) * (t + 1);
            k3 = (0.5 * Math.pow(t, 2)) + ((t - (6 * R)) * (t + 1));
            k4 = 6 * R * Math.pow(t + 1, 2);
            F = Math.pow(J, 4) + (k1 * Math.pow(J, 3)) + (k2 * Math.pow(J, 2)) + (k3 * J) - k4;

            D = (4 * Math.pow(J, 3)) + (3 * k1 * Math.pow(J, 2)) + (2 * k2 * J) + k3;
            J = J - (F / D);
            F = Math.pow(J, 4) + (k1 * Math.pow(J, 3)) + (k2 * Math.pow(J, 2)) + (k3 * J) - k4;
        } while (Math.abs(F) > 0.0001);

        y1 = Y;
        y2 = J * y1;
        E1 = y1 + (Math.pow(Q, 2) / (19.62 * Math.pow(a, 2)));
        A2 = (B + Z * y2) * y2;
        E2 = y2 + (Math.pow(Q, 2) / (19.62 * Math.pow(A2, 2)));
        E3 = Math.abs(E1 - E2); // Pérdida de energía
        Y3 = Math.abs(y2 - y1); // Altura del resalto

        setResultados({
            Y1: y1.toFixed(4),
            Y2: y2.toFixed(4),
            J: J.toFixed(4),
            perdidaEnergia: E3.toFixed(4),
            alturaResalto: Y3.toFixed(4)
        });
    };

    return (
        <div className="app">
            <h1 className="experiment-title">Análisis de Tirante Conjugado - Sección Trapezoidal</h1>

            <div className="input-section">
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

                <label>J Inicial:</label>
                <input
                    type="number"
                    value={jInicial}
                    onChange={(e) => setJInicial(e.target.value)}
                    className="input-field"
                />
            </div>

            <div className="secondary-buttons">
                <button onClick={calcular} className="calculate-button">
                    <span className="button-text">Calcular</span>
                </button>
                <button onClick={limpiarCampos} className="clear-button">
                    <span className="button-text">Limpiar</span>
                </button>
            </div>

            {resultados.Y1 && (
                <div className="results-section">
                    <h2 className="section-title">Resultados</h2>
                    <p><strong>Tirante Inicial Y1:</strong> {resultados.Y1} m</p>
                    <p><strong>Tirante Conjugado Y2:</strong> {resultados.Y2} m</p>
                    <p><strong>Valor de J:</strong> {resultados.J}</p>
                    <p><strong>Pérdida de Energía E3:</strong> {resultados.perdidaEnergia} m</p>
                    <p><strong>Altura del Resalto Y3:</strong> {resultados.alturaResalto} m</p>
                </div>
            )}
        </div>
    );
};

export default TiranteConjugadoSTrapezoidal;
