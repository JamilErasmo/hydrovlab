'use client';
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

    const cargarEjemplo = () => {
        setCaudal(1.8);
        setCoefRugosidad(0.025);
        setPendiente(0.001);
        setTiranteInicial(1);
        setFocoParabola(0.5);
    };

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
        <div className="app">
            <h1 className="experiment-title">Tirante en Sección Parabólica</h1>

            <div className="input-section">
                <label>Caudal q (m³/s):</label>
                <input
                    type="number"
                    value={caudal}
                    onChange={(e) => setCaudal(e.target.value)}
                    className="input-field"
                />
                <label>Coeficiente de Rugosidad n:</label>
                <input
                    type="number"
                    value={coefRugosidad}
                    onChange={(e) => setCoefRugosidad(e.target.value)}
                    className="input-field"
                />
                <label>Pendiente s:</label>
                <input
                    type="number"
                    value={pendiente}
                    onChange={(e) => setPendiente(e.target.value)}
                    className="input-field"
                />
                <label>Tirante Inicial y (m):</label>
                <input
                    type="number"
                    value={tiranteInicial}
                    onChange={(e) => setTiranteInicial(e.target.value)}
                    className="input-field"
                />
                <label>Foco de la Parábola x (m):</label>
                <input
                    type="number"
                    value={focoParabola}
                    onChange={(e) => setFocoParabola(e.target.value)}
                    className="input-field"
                />
            </div>

            <div className="secondary-buttons">
                <button onClick={cargarEjemplo} className="example-button">
                    Ejemplo
                </button>
                <button onClick={calcular} className="calculate-button">
                    Calcular
                </button>
                <button onClick={limpiarCampos} className="clear-button">
                    Limpiar
                </button>
            </div>

            {tiranteNormal && (
                <div className="results-section">
                    <h2 className="section-title">Resultados</h2>
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
