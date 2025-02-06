'use client';
import React, { useState } from 'react';

const Turc = () => {
    const [precipitacion, setPrecipitacion] = useState('');
    const [temperatura, setTemperatura] = useState('');
    const [resultado, setResultado] = useState({
        lt: '',
        e: ''
    });

    // Función para cargar el ejemplo
    const cargarEjemplo = () => {
        setPrecipitacion(20);
        setTemperatura(30);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setPrecipitacion('');
        setTemperatura('');
        setResultado({
            lt: '',
            e: ''
        });
    };

    // Función para calcular L(t) y E
    const calcular = () => {
        const lt = calcularLt(temperatura);  // Calculamos L(t)
        const e = calcularE(precipitacion, temperatura, lt);  // Calculamos E
        setResultado({
            lt: lt.toFixed(0),  // Redondeamos L(t) a enteros
            e: e.toFixed(4)  // Redondeamos E a 4 decimales
        });
    };

    // Fórmula de L(t) = 300 + 25 * t + 0.05 * t^2
    const calcularLt = (t) => {
        return 300 + 25 * t + 0.05 * Math.pow(t, 2);
    };

    // Fórmula de E = P / sqrt(0.9 + (P^2 / L(t)^2))
    const calcularE = (p, t, lt) => {
        return p / Math.sqrt(0.9 + (Math.pow(p, 2) / Math.pow(lt, 2)));
    };

    return (
        <div>
            <h1>Método de Turc</h1>

            <div>
                <label>Precipitación (mm): </label>
                <input type="number" value={precipitacion} onChange={(e) => setPrecipitacion(e.target.value)} />
            </div>
            <div>
                <label>Temperatura (⁰C): </label>
                <input type="number" value={temperatura} onChange={(e) => setTemperatura(e.target.value)} />
            </div>

            <div>
                <button onClick={cargarEjemplo}>Ejemplo</button>
                <button onClick={calcular}>Calcular</button>
                <button onClick={limpiarCampos}>Limpiar</button>
            </div>

            <h2>Resultados:</h2>
            <p>L(t) = 300 + 25 * t + 0.05 * t²</p>
            <p><strong>Resultado L(t):</strong> {resultado.lt}</p>

            <p>E = P / √(0.9 + (P² / L(t)²))</p>
            <p><strong>Resultado E:</strong> {resultado.e}</p>
        </div>
    );
};

export default Turc;
