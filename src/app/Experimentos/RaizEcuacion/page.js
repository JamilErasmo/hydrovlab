'use client';
import React, { useState } from 'react';
import '../App.css';

const RaizEcuacion = () => {
    const [constante, setConstante] = useState('');
    const [valorInicial, setValorInicial] = useState('');
    const [errorDeseable, setErrorDeseable] = useState('');
    const [resultado, setResultado] = useState(null);

    // Función para cargar el ejemplo con los valores proporcionados
    const cargarEjemplo = () => {
        setConstante(10);
        setValorInicial(34);
        setErrorDeseable(12);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setConstante('');
        setValorInicial('');
        setErrorDeseable('');
        setResultado(null);
    };

    // Función para calcular la raíz de la ecuación
    const calcular = () => {
        let c = parseFloat(constante);
        let y = parseFloat(valorInicial);
        let er = parseFloat(errorDeseable);

        let f1 = 0;
        let y1, f, d;

        do {
            f = ((y ** 5) / ((1.5 + (2 * y)) ** 2)) - c;
            d = ((y ** 4) * (7.5 + (6 * y))) / ((1.5 + (2 * y)) ** 3);
            y1 = y - (f / d);

            f1 = ((y1 ** 5) / ((1.5 + (2 * y1)) ** 2)) - c;
            y = y1;

            d = ((y ** 4) * (7.5 + (6 * y))) / ((1.5 + (2 * y)) ** 3);
            y1 = y - (f / d);

        } while (Math.abs(f1) > er);

        setResultado(y.toFixed(6));
    };

    return (
        <div className="app">
            <h1 className="experiment-title">Análisis de Raíz de Ecuación</h1>

            <div className="input-section">
                <label>Constante de la Ecuación C:</label>
                <input
                    type="number"
                    value={constante}
                    onChange={(e) => setConstante(e.target.value)}
                    className="input-field"
                />

                <label>Valor con que se inicia el cálculo Y:</label>
                <input
                    type="number"
                    value={valorInicial}
                    onChange={(e) => setValorInicial(e.target.value)}
                    className="input-field"
                />

                <label>Error deseable para el cálculo E:</label>
                <input
                    type="number"
                    value={errorDeseable}
                    onChange={(e) => setErrorDeseable(e.target.value)}
                    className="input-field"
                />
            </div>

            <div className="secondary-buttons">
                <button onClick={cargarEjemplo} className="example-button">
                    <span className="button-text">Ejemplo</span>
                </button>
                <button onClick={limpiarCampos} className="clear-button">
                    <span className="button-text">Limpiar</span>
                </button>
            </div>
            <div>
                <button onClick={calcular} className="calculate-button">
                    Calcular
                </button>
            </div>

            {resultado && (
                <div className="results-section">
                    <h2 className="section-title">Resultado</h2>
                    <p>Raíz de la Ecuación: {resultado}</p>
                </div>
            )}
        </div>
    );
};

export default RaizEcuacion;
