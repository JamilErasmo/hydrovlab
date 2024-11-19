'use client';
import React, { useState } from 'react';
import '../App.css';

const CurvaDeRemanso = () => {
  const [caudal, setCaudal] = useState('');
  const [anchoSolera, setAnchoSolera] = useState('');
  const [talud, setTalud] = useState('');
  const [pendiente, setPendiente] = useState('');
  const [rugosidad, setRugosidad] = useState('');
  const [distanciaInicial, setDistanciaInicial] = useState('');
  const [distanciaTramo, setDistanciaTramo] = useState('');
  const [numTramos, setNumTramos] = useState('');
  const [tiranteInicial, setTiranteInicial] = useState('');
  const [errorAprox, setErrorAprox] = useState('');
  const [resultados, setResultados] = useState([]);

  const cargarEjemplo = () => {
    setCaudal(1.5);
    setAnchoSolera(1.5);
    setTalud(1);
    setPendiente(0.0005);
    setRugosidad(0.015);
    setDistanciaInicial(0);
    setDistanciaTramo(-20);
    setNumTramos(10);
    setTiranteInicial(0.423);
    setErrorAprox(0.0001);
  };

  const limpiarCampos = () => {
    setCaudal('');
    setAnchoSolera('');
    setTalud('');
    setPendiente('');
    setRugosidad('');
    setDistanciaInicial('');
    setDistanciaTramo('');
    setNumTramos('');
    setTiranteInicial('');
    setErrorAprox('');
    setResultados([]);
  };

  const calcular = () => {
    const Q = parseFloat(caudal);
    const B = parseFloat(anchoSolera);
    const Z = parseFloat(talud);
    const S = parseFloat(pendiente);
    const N = parseFloat(rugosidad);
    const X1 = parseFloat(distanciaInicial);
    const X = parseFloat(distanciaTramo);
    const NT = parseInt(numTramos);
    const Y1 = parseFloat(tiranteInicial);
    const Er = parseFloat(errorAprox);

    if (isNaN(Q) || isNaN(B) || isNaN(Z) || isNaN(S) || isNaN(N) || isNaN(X1) || isNaN(X) || isNaN(NT) || isNaN(Y1) || isNaN(Er)) {
      alert('Por favor, asegúrese de llenar todos los campos correctamente.');
      return;
    }

    const M = Math.sqrt(1 + Z ** 2);
    const resultadosCalculados = [];
    resultadosCalculados.push({ x: X1.toFixed(0), y: Y1.toFixed(3) });

    let i = 0;
    let currentX = X1;
    let currentY = Y1;

    while (i < NT) {
      const A1 = (B + Z * currentY) * currentY;
      const P1 = B + 2 * currentY * M;
      const R1 = A1 / P1;
      const V1 = Q / A1;

      const C = S * X + currentY + V1 ** 2 / 19.62 - X * (V1 * N) ** 2 / (2 * R1 ** (4 / 3));

      let Y2 = currentY;
      let F;
      let iterCount = 0;

      do {
        const A = (B + Z * Y2) * Y2;
        const P = B + 2 * Y2 * M;
        const R = A / P;
        const T = B + 2 * Z * Y2;
        const Q1 = Q ** 2 / A ** 3;

        F = Y2 + Q1 * A / 19.62 + X * Q1 * P * N ** 2 / (2 * R ** (1 / 3)) - C;

        const D = 1 - Q1 * T / 9.81 + X * Q * N ** 2 * (4 * M - (5 * T) / R) / (3 * R ** (1 / 3));

        if (D === 0) {
          console.error('Error: División por cero en el cálculo de D.');
          break;
        }

        Y2 -= F / D;
        iterCount++;

        if (iterCount > 1000) {
          console.error('Límite de iteraciones alcanzado.');
          break;
        }
      } while (Math.abs(F) >= Er);

      currentY = Y2;
      currentX += X;

      resultadosCalculados.push({ x: currentX.toFixed(0), y: currentY.toFixed(3) });
      i++;
    }

    setResultados(resultadosCalculados);
  };

  return (
    <div className="app">
      <div className="content-wrapper">
        <div className="left-section">
          <h2 className="section-title">Curva de Remanso (Tramos Fijos)</h2>
          <div className="input-section">
            <label>Caudal Q (m³/s):</label>
            <input className="input-field" type="number" value={caudal} onChange={(e) => setCaudal(e.target.value)} />
            <label>Ancho de Solera B (m):</label>
            <input className="input-field" type="number" value={anchoSolera} onChange={(e) => setAnchoSolera(e.target.value)} />
            <label>Talud:</label>
            <input className="input-field" type="number" value={talud} onChange={(e) => setTalud(e.target.value)} />
            <label>Pendiente (m/m):</label>
            <input className="input-field" type="number" value={pendiente} onChange={(e) => setPendiente(e.target.value)} />
            <label>Coeficiente de Rugosidad:</label>
            <input className="input-field" type="number" value={rugosidad} onChange={(e) => setRugosidad(e.target.value)} />
            <label>Distancia Inicial X1 (m):</label>
            <input className="input-field" type="number" value={distanciaInicial} onChange={(e) => setDistanciaInicial(e.target.value)} />
            <label>Distancia del Tramo X (m):</label>
            <input className="input-field" type="number" value={distanciaTramo} onChange={(e) => setDistanciaTramo(e.target.value)} />
            <label>Número de Tramos:</label>
            <input className="input-field" type="number" value={numTramos} onChange={(e) => setNumTramos(e.target.value)} />
            <label>Tirante Inicial Y1 (m):</label>
            <input className="input-field" type="number" value={tiranteInicial} onChange={(e) => setTiranteInicial(e.target.value)} />
            <label>Error de Aproximación:</label>
            <input className="input-field" type="number" value={errorAprox} onChange={(e) => setErrorAprox(e.target.value)} />
          </div>
          <div className="secondary-buttons">
            <button className="example-button" onClick={cargarEjemplo}>Ejemplo</button>
            <button className="calculate-button" onClick={calcular}>Calcular</button>
            <button className="clear-button" onClick={limpiarCampos}>Limpiar</button>
          </div>
        </div>
      </div>

      {resultados.length > 0 && (
        <div className="results-section">
          <h2 className="section-subtitle">Resultados</h2>
          <table className="results-table">
            <thead>
              <tr>
                <th>Distancia X (m)</th>
                <th>Tirante Y (m)</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((resultado, index) => (
                <tr key={index}>
                  <td>{resultado.x}</td>
                  <td>{resultado.y}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CurvaDeRemanso;
