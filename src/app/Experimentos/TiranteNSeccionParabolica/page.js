'use client'
import React, { useState } from 'react';

import '../App.css';


const TiranteParabolico = () => {
    const [caudal, setCaudal] = useState('');
    const [coefRugosidad, setCoefRugosidad] = useState('');
    const [pendiente, setPendiente] = useState('');
    const [tiranteInicial, setTiranteInicial] = useState('');
    const [focoParabola, setFocoParabola] = useState('');
    const [tiranteNormal, setTiranteNormal] = useState(null);
    const [velocidad, setVelocidad] = useState(null);
    const [numeroFraude, setNumeroFraude] = useState(null);
    const [energiaEspecifica, setEnergiaEspecifica] = useState(null);
    const [espejoA, setEspejoA] = useState(null);

    // Función para cargar los valores de ejemplo
    const cargarEjemplo = () => {
        setCaudal(1.8);
        setCoefRugosidad(0.025);
        setPendiente(0.001);
        setTiranteInicial(1);
        setFocoParabola(0.5);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setCaudal('');
        setCoefRugosidad('');
        setPendiente('');
        setTiranteInicial('');
        setFocoParabola('');
        setTiranteNormal(null);
        setVelocidad(null);
        setNumeroFraude(null);
        setEnergiaEspecifica(null);
        setEspejoA(null);
    };

    // Función para calcular el tirante crítico
    const calcular = () => {
        let q = parseFloat(caudal);
        let n = parseFloat(coefRugosidad);
        let s = parseFloat(pendiente);
        let y = parseFloat(tiranteInicial);
        let x = parseFloat(focoParabola);

        const C = (q * n) / Math.sqrt(s);
        let a, T, p, f, f1, v, f2, En, y1;

        do {
            a = (4 * Math.sqrt(2 * x) * Math.pow(y, 1.5)) / 3;
            T = Math.sqrt(8 * x * y);

            if (y / T <= 0.25) {
                p = Math.sqrt(8 * x) * (Math.sqrt(y) + Math.pow(y, 1.5) / (3 * x));
                f = Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3) - C;
            } else {
                p =
                    Math.sqrt(2 * x * y) *
                    (Math.sqrt(1 + 2 * y / x) + Math.sqrt(x / (2 * y)) * Math.log(Math.sqrt(2 * y / x) + Math.sqrt(1 + 2 * y / x)));
                f = Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3) - C;
            }

            f1 = f;
            y += 0.0001;

            a = (4 * Math.sqrt(2 * x) * Math.pow(y, 1.5)) / 3;
            T = Math.sqrt(8 * x * y);

            if (y / T <= 0.25) {
                p = Math.sqrt(8 * x) * (Math.sqrt(y) + Math.pow(y, 1.5) / (3 * x));
                f = Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3) - C;
            } else {
                p =
                    Math.sqrt(2 * x * y) *
                    (Math.sqrt(1 + 2 * y / x) + Math.sqrt(x / (2 * y)) * Math.log(Math.sqrt(2 * y / x) + Math.sqrt(1 + 2 * y / x)));
                f = Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3) - C;
            }

            y1 = y - (f * 0.0001) / (f - f1);
        } while (Math.abs(y1 - y) > 0.0001);

        v = q / a;
        f2 = v / Math.sqrt(9.81 * (2 * y) / 3);
        En = y + Math.pow(v, 2) / 19.62;

        setTiranteNormal(y.toFixed(15));
        setVelocidad(v.toFixed(15));
        setNumeroFraude(f2.toFixed(15));
        setEnergiaEspecifica(En.toFixed(15));
        setEspejoA(T.toFixed(15));
    };

    return (
        <div>
            <h1>Tirante en Sección Parabólica</h1>

            <div>
                <h3>Datos de Entrada</h3>
                <label>Caudal q (m³/s): </label>
                <input type="number" value={caudal} onChange={(e) => setCaudal(e.target.value)} /><br />

                <label>Coeficiente de Rugosidad n: </label>
                <input type="number" value={coefRugosidad} onChange={(e) => setCoefRugosidad(e.target.value)} /><br />

                <label>Pendiente s: </label>
                <input type="number" value={pendiente} onChange={(e) => setPendiente(e.target.value)} /><br />

                <label>Tirante Inicial y (m): </label>
                <input type="number" value={tiranteInicial} onChange={(e) => setTiranteInicial(e.target.value)} /><br />

                <label>Foco de la Parábola x (m): </label>
                <input type="number" value={focoParabola} onChange={(e) => setFocoParabola(e.target.value)} /><br />
            </div>

            <div style={{ marginTop: '20px' }}>
                <button onClick={cargarEjemplo}>Ejemplo</button>
                <button onClick={calcular} style={{ marginLeft: '10px' }}>Calcular</button>
                <button onClick={limpiarCampos} style={{ marginLeft: '10px' }}>Limpiar</button>
            </div>

            {tiranteNormal && (
                <div style={{ marginTop: '30px' }}>
                    <h2>Resultados</h2>
                    <p><strong>Tirante Normal:</strong> {tiranteNormal} m</p>
                    <p><strong>Velocidad:</strong> {velocidad} m/s</p>
                    <p><strong>Número de Froude:</strong> {numeroFraude}</p>
                    <p><strong>Energía Específica:</strong> {energiaEspecifica} m</p>
                    <p><strong>Espejo de Agua A:</strong> {espejoA} m</p>
                </div>
            )}
        </div>
    );
};

export default TiranteParabolico;
