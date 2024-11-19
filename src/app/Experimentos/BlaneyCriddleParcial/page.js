'use client';
import React, { useState } from 'react';
import '../App.css';

function BlaneyCriddleParcial() {
  const [inputs, setInputs] = useState({
    latitud: 0,
    tipoLatitud: 'Norte',
    cultivo: 'Algodón',
    crecimientoCultivo: 50,
    temperaturaMes: 18,
    mesSiembra: 'Abril',
  });

  const [resultados, setResultados] = useState({
    kci: '',
    fi: '',
    eti: '',
  });

  const kciData = {
    Trigo: 0.98,
    "Trigo de invierno": 1.5,
    "Sorgo de grano": 1.0,
    Algodón: 0.57,
    Frijol: 0.5,
    Lechuga: 0.48,
    Zanahoria: 0.39,
    Papa: 1.0,
    Calabaza: 0.9,
    Papa1: 1.08,
    Tomate: 0.6,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const calcularResultados = () => {
    const { latitud, tipoLatitud, cultivo, crecimientoCultivo, temperaturaMes, mesSiembra } = inputs;

    if (!latitud || !cultivo || !crecimientoCultivo || !temperaturaMes || !mesSiembra) {
      alert('Por favor, rellena todos los campos antes de calcular.');
      return;
    }

    const kci = kciData[cultivo] || 0;
    const fi = (parseFloat(latitud) + parseFloat(temperaturaMes)) * 0.1; // Fórmula simplificada
    const eti = kci * fi;

    setResultados({
      kci: kci.toFixed(2),
      fi: fi.toFixed(2),
      eti: eti.toFixed(2),
    });
  };

  const handleNuevo = () => {
    setInputs({
      latitud: '',
      tipoLatitud: 'Norte',
      cultivo: '',
      crecimientoCultivo: '',
      temperaturaMes: '',
      mesSiembra: '',
    });
    setResultados({
      kci: '',
      fi: '',
      eti: '',
    });
  };

  const handleEjemplo = () => {
    setInputs({
      latitud: 25.5,
      tipoLatitud: 'Norte',
      cultivo: 'Algodón',
      crecimientoCultivo: 50,
      temperaturaMes: 18,
      mesSiembra: 'Abril',
    });
  };

  return (
    <div className="app">
      <div className="content-wrapper">
        <div className="left-section">
          <h2 className="section-title">Parámetros de Entrada</h2>

          <div className="input-row">
            <label>Latitud:</label>
            <input
              className="input-field"
              type="number"
              name="latitud"
              value={inputs.latitud}
              onChange={handleInputChange}
              placeholder="Ingrese la latitud"
            />
            <select
              className="input-field"
              name="tipoLatitud"
              value={inputs.tipoLatitud}
              onChange={handleInputChange}
            >
              <option value="Norte">Norte</option>
              <option value="Sur">Sur</option>
            </select>
          </div>

          <div className="input-row">
            <label>Cultivo:</label>
            <select
              className="input-field"
              name="cultivo"
              value={inputs.cultivo}
              onChange={handleInputChange}
            >
              {Object.keys(kciData).map((cultivo) => (
                <option key={cultivo} value={cultivo}>
                  {cultivo}
                </option>
              ))}
            </select>
          </div>

          <div className="input-row">
            <label>% Crecimiento del Cultivo:</label>
            <input
              className="input-field"
              type="number"
              name="crecimientoCultivo"
              value={inputs.crecimientoCultivo}
              onChange={handleInputChange}
              placeholder="% Crecimiento del cultivo"
            />
          </div>

          <div className="input-row">
            <label>Temperatura del Mes (°C):</label>
            <input
              className="input-field"
              type="number"
              name="temperaturaMes"
              value={inputs.temperaturaMes}
              onChange={handleInputChange}
              placeholder="Temperatura del mes"
            />
          </div>

          <div className="input-row">
            <label>Mes de Siembra:</label>
            <select
              className="input-field"
              name="mesSiembra"
              value={inputs.mesSiembra}
              onChange={handleInputChange}
            >
              {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((mes) => (
                <option key={mes} value={mes}>
                  {mes}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="secondary-buttons">
          <button className="calculate-button" onClick={calcularResultados}>
            Calcular
          </button>
          <button className="clear-button" onClick={handleNuevo}>
            Nuevo
          </button>
          <button className="example-button" onClick={handleEjemplo}>
            Ejemplo
          </button>
        </div>
      </div>

      <div className="results-section">
        <h2 className="section-title">Resultados</h2>
        <div className="input-row">
          <label>Kci:</label>
          <input className="input-field" type="text" value={resultados.kci} readOnly />
          <label>Fi:</label>
          <input className="input-field" type="text" value={resultados.fi} readOnly />
          <label>Eti:</label>
          <input className="input-field" type="text" value={resultados.eti} readOnly />
        </div>
      </div>
    </div>
  );
}

export default BlaneyCriddleParcial;
