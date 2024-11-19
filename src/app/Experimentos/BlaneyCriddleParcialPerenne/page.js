'use client';
import React, { useState } from 'react';
import '../App.css';

const BlaneyCriddleParcialPerenne = () => {
  const [latitud, setLatitud] = useState('');
  const [hemisferio, setHemisferio] = useState('');
  const [cultivo, setCultivo] = useState('');
  const [mesSiembra, setMesSiembra] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [fi, setFi] = useState('');
  const [kci, setKci] = useState('');
  const [eti, setEti] = useState('');

  const calcularFi = (Pi, Ti) => {
    return Pi * ((Ti + 17.8) / 21.8);
  };

  const calcularKci = (mesSiembra, indiceCultivo) => {
    const kciTable = [
      [0.64, 0.2, 0.1, 0.65, 0.25, 0.2, 0.47, 0.63],
      [0.72, 0.25, 0.13, 0.75, 0.38, 0.25, 0.6, 0.67],
      [0.87, 0.38, 0.25, 0.9, 0.52, 0.3, 0.75, 0.7],
      [1.0, 0.63, 0.4, 1.0, 0.65, 0.5, 0.83, 0.71],
      [1.1, 0.87, 0.6, 1.1, 0.78, 0.62, 0.9, 0.73],
      [1.14, 1.0, 0.88, 1.15, 0.78, 0.78, 0.92, 0.74],
      [1.14, 1.0, 1.0, 1.13, 0.75, 0.79, 0.91, 0.74],
      [1.08, 0.87, 0.85, 1.1, 0.7, 0.75, 0.9, 0.73],
      [1.0, 0.5, 0.71, 1.0, 0.56, 0.6, 0.83, 0.7],
      [0.82, 0.38, 0.5, 0.92, 0.48, 0.5, 0.75, 0.68],
      [0.75, 0.2, 0.25, 0.8, 0.37, 0.35, 0.63, 0.65],
      [0.62, 0.13, 0.13, 0.68, 0.3, 0.2, 0.52, 0.61],
    ];
    return kciTable[mesSiembra - 1][indiceCultivo - 1];
  };

  const calcularEti = (kci, fi) => {
    return kci * fi;
  };

  const interpolarNorte = (latitud, mesSiembra) => {
    const insolacionNorte = [
      [0, 8.5, 7.66, 8.49, 8.21, 8.5, 8.22, 8.5, 8.45, 8.21, 8.5, 8.22, 8.5],
      [5, 8.32, 7.57, 8.47, 8.29, 8.65, 8.41, 8.67, 8.66, 8.23, 8.42, 8.07, 8.3],
      [10, 8.13, 7.47, 8.45, 8.37, 8.81, 8.6, 8.86, 8.71, 8.25, 8.34, 7.91, 8.1],
    ];
    return insolacionNorte[0][mesSiembra];
  };

  const interpolarSur = (latitud, mesSiembra) => {
    const insolacionSur = [
      [0, 8.5, 7.66, 8.49, 8.21, 8.5, 8.22, 8.5, 8.45, 8.21, 8.5, 8.22, 8.5],
      [5, 8.68, 7.76, 8.51, 8.15, 8.34, 8.05, 8.33, 8.38, 8.19, 8.56, 8.37, 8.68],
      [10, 8.86, 7.87, 8.53, 8.09, 8.18, 7.86, 8.14, 8.27, 8.17, 8.62, 8.53, 8.88],
    ];
    return insolacionSur[0][mesSiembra];
  };

  const handleEjemplo = () => {
    setLatitud(4.015);
    setHemisferio('Sur');
    setCultivo('5');
    setMesSiembra('8');
    setTemperatura(15.5);
  };

  const handleCalcular = () => {
    const Pi =
      hemisferio === 'Norte'
        ? interpolarNorte(latitud, mesSiembra)
        : interpolarSur(latitud, mesSiembra);

    const fiCalculado = calcularFi(Pi, temperatura);
    const kciCalculado = calcularKci(mesSiembra, cultivo);
    const etiCalculado = calcularEti(kciCalculado, fiCalculado);

    setFi(fiCalculado.toFixed(4));
    setKci(kciCalculado.toFixed(4));
    setEti(etiCalculado.toFixed(4));
  };

  return (
    <div className="app">
      <div className="content-wrapper">
        <div className="left-section">
          <h2 className="section-title">Método de Criddle Parcial Perenne</h2>

          <div className="input-row">
            <label>Latitud:</label>
            <input
              className="input-field"
              type="text"
              value={latitud}
              onChange={(e) => setLatitud(e.target.value)}
              placeholder="Ingrese la latitud"
            />
          </div>

          <div className="input-row">
            <label>Hemisferio:</label>
            <select
              className="input-field"
              onChange={(e) => setHemisferio(e.target.value)}
            >
              <option value="">Seleccione el hemisferio</option>
              <option value="Norte">Norte</option>
              <option value="Sur">Sur</option>
            </select>
          </div>

          <div className="input-row">
            <label>Cultivo:</label>
            <select
              className="input-field"
              onChange={(e) => setCultivo(e.target.value)}
            >
              <option value="">Seleccione el cultivo</option>
              <option value="1">Huerta de plantas caducas con cubierta</option>
              <option value="2">Huerta de plantas caducas sin cubierta</option>
              <option value="3">Nogal</option>
              <option value="4">Alfalfa</option>
              <option value="5">Aguacate</option>
              <option value="6">Vid</option>
              <option value="7">Pastos</option>
              <option value="8">Huerta de cítricos</option>
            </select>
          </div>

          <div className="input-row">
            <label>Mes para ETP:</label>
            <select
              className="input-field"
              onChange={(e) => setMesSiembra(e.target.value)}
            >
              <option value="">Seleccione el mes</option>
              {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map(
                (mes, index) => (
                  <option key={index} value={index + 1}>
                    {mes}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="input-row">
            <label>Temperatura del mes (°C):</label>
            <input
              className="input-field"
              type="text"
              value={temperatura}
              onChange={(e) => setTemperatura(e.target.value)}
              placeholder="Ingrese la temperatura"
            />
          </div>

          <div className="secondary-buttons">
            <button className="example-button" onClick={handleEjemplo}>
              Ejemplo
            </button>
            <button className="calculate-button" onClick={handleCalcular}>
              Calcular
            </button>
          </div>
        </div>

        <div className="results-section">
          <h3 className="section-title">Resultados</h3>
          <p>Kci: {kci}</p>
          <p>Fi: {fi}</p>
          <p>Eti: {eti}</p>
        </div>
      </div>
    </div>
  );
};

export default BlaneyCriddleParcialPerenne;
