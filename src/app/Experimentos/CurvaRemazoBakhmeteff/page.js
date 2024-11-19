'use client';
import React, { useState } from 'react';
import '../App.css';

const CurvaRemansoBakhmeteff = () => {
  const [caudal, setCaudal] = useState('');
  const [anchoSolera, setAnchoSolera] = useState('');
  const [talud, setTalud] = useState('');
  const [pendiente, setPendiente] = useState('');
  const [tiranteNormal, setTiranteNormal] = useState('');
  const [tiranteCritico, setTiranteCritico] = useState('');
  const [tiranteInicial, setTiranteInicial] = useState('');
  const [tiranteFinal, setTiranteFinal] = useState('');
  const [incrementoTirante, setIncrementoTirante] = useState('');
  const [resultados, setResultados] = useState([]);

  const cargarEjemplo = () => {
    setCaudal(0.9);
    setAnchoSolera(1);
    setTalud(1);
    setPendiente(0.0005);
    setTiranteNormal(0.676);
    setTiranteCritico(0.381);
    setTiranteInicial(0.381);
    setTiranteFinal(0.537);
    setIncrementoTirante(0.026);
  };

  const limpiarCampos = () => {
    setCaudal('');
    setAnchoSolera('');
    setTalud('');
    setPendiente('');
    setTiranteNormal('');
    setTiranteCritico('');
    setTiranteInicial('');
    setTiranteFinal('');
    setIncrementoTirante('');
    setResultados([]);
  };

  const calcular = () => {
    const Q = parseFloat(caudal);
    const B = parseFloat(anchoSolera);
    const Z = parseFloat(talud);
    const S = parseFloat(pendiente);
    const YN = parseFloat(tiranteNormal);
    const YC = parseFloat(tiranteCritico);
    const Y1 = parseFloat(tiranteInicial);
    const Y2 = parseFloat(tiranteFinal);
    const Y3 = parseFloat(incrementoTirante);

    if (isNaN(Q) || isNaN(B) || isNaN(Z) || isNaN(S) || isNaN(YN) || isNaN(YC) || isNaN(Y1) || isNaN(Y2) || isNaN(Y3)) {
      alert('Por favor, ingrese todos los valores numéricos correctamente.');
      return;
    }

    let resultadosCalculados = [];
    let XPrev = 0;

    for (let Y = Y1; Y <= Y2; Y += Y3) {
      const A = B * Y + Z * Y ** 2; // Área hidráulica
      const P = B + 2 * Y * Math.sqrt(1 + Z ** 2); // Perímetro mojado
      const R = A / P; // Radio hidráulico
      const V = Q / A; // Velocidad

      // Pérdida de energía específica
      const E = Y + (V ** 2) / (2 * 9.81);

      // Cálculo de distancia usando la ecuación de remanso simplificada
      const dE = ((S - (V ** 2) / (9.81 * R)) / (1 - (V ** 2) / (9.81 * Y)));
      const dX = dE * 100; // Escalado para representarlo en metros

      const X = XPrev + dX;
      XPrev = X;

      resultadosCalculados.push({
        Y: Y.toFixed(3),
        A: A.toFixed(3),
        P: P.toFixed(3),
        R: R.toFixed(3),
        V: V.toFixed(3),
        E: E.toFixed(3),
        X: X.toFixed(3),
      });
    }

    setResultados(resultadosCalculados);
  };

  return (
    <div className="app">
     

      <div className="content-wrapper">
        <div className="left-section">
          <h2 className="section-subtitle">Datos de Entrada</h2>

          <div className="input-row">
            <label>Caudal Q (m³/s):</label>
            <input
              className="input-field"
              type="number"
              value={caudal}
              onChange={(e) => setCaudal(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label>Ancho de Solera B (m):</label>
            <input
              className="input-field"
              type="number"
              value={anchoSolera}
              onChange={(e) => setAnchoSolera(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label>Talud:</label>
            <input
              className="input-field"
              type="number"
              value={talud}
              onChange={(e) => setTalud(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label>Pendiente (m/m):</label>
            <input
              className="input-field"
              type="number"
              value={pendiente}
              onChange={(e) => setPendiente(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label>Tirante Normal YN (m):</label>
            <input
              className="input-field"
              type="number"
              value={tiranteNormal}
              onChange={(e) => setTiranteNormal(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label>Tirante Crítico YC (m):</label>
            <input
              className="input-field"
              type="number"
              value={tiranteCritico}
              onChange={(e) => setTiranteCritico(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label>Tirante Inicial Y1 (m):</label>
            <input
              className="input-field"
              type="number"
              value={tiranteInicial}
              onChange={(e) => setTiranteInicial(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label>Tirante Final Y2 (m):</label>
            <input
              className="input-field"
              type="number"
              value={tiranteFinal}
              onChange={(e) => setTiranteFinal(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label>Incremento del Tirante Y3 (m):</label>
            <input
              className="input-field"
              type="number"
              value={incrementoTirante}
              onChange={(e) => setIncrementoTirante(e.target.value)}
            />
          </div>
        </div>

        <div className="secondary-buttons">
          <button className="example-button" onClick={cargarEjemplo}>
            Ejemplo
          </button>
          <button className="calculate-button" onClick={calcular}>
            Calcular
          </button>
          <button className="clear-button" onClick={limpiarCampos}>
            Limpiar
          </button>
        </div>
      </div>

      {resultados.length > 0 && (
        <div className="results-section">
          <h2 className="section-subtitle">Resultados</h2>
          <table className="results-table">
            <thead>
              <tr>
                <th>Y</th>
                <th>A (m²)</th>
                <th>P (m)</th>
                <th>R (m)</th>
                <th>V (m/s)</th>
                <th>E (m)</th>
                <th>X (m)</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((resultado, index) => (
                <tr key={index}>
                  <td>{resultado.Y}</td>
                  <td>{resultado.A}</td>
                  <td>{resultado.P}</td>
                  <td>{resultado.R}</td>
                  <td>{resultado.V}</td>
                  <td>{resultado.E}</td>
                  <td>{resultado.X}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CurvaRemansoBakhmeteff;
