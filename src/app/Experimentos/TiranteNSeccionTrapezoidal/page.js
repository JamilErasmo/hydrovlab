'use client';
import React, { useState } from 'react';
import '../App.css';

const Experimento = () => {
    const [data, setData] = useState({
        Q: 1.5,
        b: 1,
        z: 0,
        y: 1,
        n: 0.014,
        s: 0.001,
        Er: 0.0001,
    });
    const [results, setResults] = useState({
        yResult: '',
        V: '',
        F1: '',
        E1: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: parseFloat(value) });
    };

    const calcular = () => {
        let { Q, b, z, y, n, s, Er } = data;
        let C, L, D, A, P, T, r, F, y1, V, L1, F1, E1;

        C = Math.pow((Q * n) / Math.sqrt(s), 3);
        L = Math.sqrt(1 + Math.pow(z, 2));
        A = (b + (z * y)) * y;
        P = b + (2 * y * L);
        T = b + (2 * z * y);
        r = A / P;
        F = (Math.pow(A, 5) / Math.pow(P, 2)) - C;

        do {
            D = (Math.pow(A, 4) * ((5 * P * T) - (4 * A * r))) / Math.pow(P, 3);
            y1 = y - (F / D);
            y = y1;

            A = (b + (z * y)) * y;
            P = b + (2 * y * L);
            T = b + (2 * z * y);
            F = (Math.pow(A, 5) / Math.pow(P, 2)) - C;

            V = Q / A;
            L1 = A / T;
            F1 = V / Math.sqrt(9.81 * L1);
            E1 = y + Math.pow(V, 2) / 19.62;
        } while (Math.abs(F) >= Er);

        setResults({
            yResult: y.toFixed(15),
            V: V.toFixed(15),
            F1: F1.toFixed(15),
            E1: E1.toFixed(15),
        });
    };

    const cargarEjemplo = () => {
        setData({
            Q: 1.5,
            b: 1,
            z: 0,
            y: 1,
            n: 0.014,
            s: 0.001,
            Er: 0.0001,
        });
        setResults({
            yResult: '',
            V: '',
            F1: '',
            E1: ''
        });
    };

    const limpiar = () => {
        setData({
            Q: '',
            b: '',
            z: '',
            y: '',
            n: '',
            s: '',
            Er: '',
        });
        setResults({
            yResult: '',
            V: '',
            F1: '',
            E1: ''
        });
    };

    return (
        <div className="app">
            <h1 className="experiment-title">Análisis Tirante N Sec Trapezoidal</h1>
            <div className="input-section">
                <label>CAUDAL Q (m³/s):</label>
                <input type="number" name="Q" value={data.Q} onChange={handleInputChange} className="input-field" />
                <label>SOLERA (m):</label>
                <input type="number" name="b" value={data.b} onChange={handleInputChange} className="input-field" />
                <label>TALUD:</label>
                <input type="number" name="z" value={data.z} onChange={handleInputChange} className="input-field" />
                <label>TIRANTE (m):</label>
                <input type="number" name="y" value={data.y} onChange={handleInputChange} className="input-field" />
                <label>RUGOSIDAD:</label>
                <input type="number" name="n" value={data.n} onChange={handleInputChange} className="input-field" />
                <label>PENDIENTE:</label>
                <input type="number" name="s" value={data.s} onChange={handleInputChange} className="input-field" />
                <label>ERROR:</label>
                <input type="number" name="Er" value={data.Er} onChange={handleInputChange} className="input-field" />
            </div>
            <div className="secondary-buttons">
                <button onClick={calcular} className="calculate-button">Calcular</button>
                <button onClick={cargarEjemplo} className="example-button"> Ejemplo</button>
                <button onClick={limpiar} className="clear-button">Limpiar</button>
            </div>
            {results.yResult && (
                <div className="results-section">
                    <h2 className="section-title">Resultados</h2>
                    <p><strong>Tirante y:</strong> {results.yResult}</p>
                    <p><strong>Velocidad V:</strong> {results.V}</p>
                    <p><strong>Número de Froude F1:</strong> {results.F1}</p>
                    <p><strong>Energía Específica E1:</strong> {results.E1}</p>
                </div>
            )}
        </div>
    );
};

export default Experimento;
