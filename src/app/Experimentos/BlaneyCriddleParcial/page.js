'use client'
import React, { useState } from 'react';

import '../App.css';

// Datos de KCI según el cultivo
const kciData = {
  "Trigo": 0.98, "Trigo de invierno": 1.5, "Sorgo de grano": 1.0, "Algodón": 0.57,
  "Frijol": 0.5, "Lechuga": 0.48, "Zanahoria": 0.39, "Papa": 1.0, "Calabaza": 0.9, "Papa1": 1.08, "Tomate": 0.6
};

// Datos de insolación para latitudes Norte y Sur
const dataNorte = [
  [0, 8.5, 7.66, 8.49, 8.21, 8.5, 8.22, 8.5, 8.45, 8.21, 8.5, 8.22, 8.5],
  [5, 8.32, 7.57, 8.47, 8.29, 8.65, 8.41, 8.67, 8.66, 8.23, 8.42, 8.07, 8.3],
  [10, 8.13, 7.47, 8.45, 8.37, 8.81, 8.6, 8.86, 8.71, 8.25, 8.34, 7.91, 8.1],
  [15, 7.94, 7.36, 8.43, 8.44, 8.98, 8.8, 9.05, 8.83, 8.28, 8.2, 7.75, 7.88],
  [20, 7.74, 7.25, 8.41, 8.52, 9.15, 9.0, 9.25, 8.96, 8.3, 8.18, 7.58, 7.66],
  [25, 7.53, 7.14, 8.39, 8.61, 9.33, 9.23, 9.45, 9.09, 8.32, 8.09, 7.4, 7.42],
  [30, 7.3, 7.03, 8.38, 8.72, 9.53, 9.49, 9.61, 9.19, 8.33, 7.99, 7.19, 7.15],
  [35, 7.05, 6.88, 8.35, 8.83, 9.77, 9.76, 9.94, 9.37, 8.37, 7.88, 6.97, 6.85],
  [40, 6.76, 6.72, 8.33, 8.95, 10.02, 10.08, 10.22, 9.57, 8.39, 7.75, 6.72, 6.52],
  [45, 6.49, 6.58, 8.3, 9.06, 10.26, 10.38, 10.49, 9.7, 8.41, 7.63, 6.49, 6.21],
  [50, 6.17, 6.41, 8.27, 9.18, 10.53, 10.71, 10.8, 9.89, 8.44, 7.51, 6.23, 5.86],
  [55, 5.98, 6.3, 8.24, 9.24, 10.68, 10.91, 11.0, 10.0, 8.46, 7.45, 6.1, 5.65],
  [60, 5.77, 6.19, 8.21, 9.36, 11.03, 11.38, 11.43, 10.26, 8.49, 7.39, 5.74, 5.18]
];

const dataSur = [
  [0, 8.5, 7.66, 8.49, 8.21, 8.5, 8.22, 8.5, 8.49, 8.21, 8.5, 8.22, 8.5],
  [5, 8.68, 7.76, 8.51, 8.15, 8.34, 8.05, 8.33, 8.38, 8.19, 8.56, 8.37, 8.68],
  [10, 8.86, 7.87, 8.53, 8.09, 8.18, 7.86, 8.14, 8.27, 8.17, 8.62, 8.53, 8.88],
  [15, 9.05, 7.98, 8.55, 8.02, 8.02, 7.65, 7.95, 8.15, 8.15, 8.68, 8.7, 9.1],
  [20, 9.24, 8.09, 8.57, 7.94, 7.85, 7.43, 7.76, 8.03, 8.13, 8.76, 8.87, 9.33],
  [25, 9.46, 8.21, 8.6, 7.94, 7.66, 7.2, 7.54, 7.9, 8.11, 8.86, 9.04, 9.58],
  [30, 9.7, 8.33, 8.62, 7.73, 7.45, 6.96, 7.31, 7.76, 8.07, 8.97, 9.24, 9.35],
  [35, 9.92, 8.45, 8.64, 7.64, 7.27, 6.74, 7.1, 7.63, 8.05, 9.06, 9.42, 10.08],
  [40, 10.15, 8.57, 8.66, 7.54, 7.08, 6.5, 6.87, 7.49, 8.04, 9.16, 9.61, 10.34],
  [45, 10.4, 8.7, 8.68, 7.44, 6.85, 6.23, 6.64, 7.33, 8.01, 9.26, 9.82, 10.64],
  [50, 10.69, 8.86, 8.7, 7.32, 6.61, 5.02, 6.37, 7.16, 7.96, 9.37, 10.07, 10.97]
];

// Función para calcular KCI con ajuste basado en el código base original
const procKCI = (pcs, cul) => {
  if (pcs < 0 || isNaN(pcs)) return 0; // Verifica que pcs sea válido

  const tbl = [
    [0, 0.28, 0.0, 0.28, 0.2, 0.5, 0.57, 0.48, 0.3, 0.45, 0.3, 0.45],
    [10, 0.38, 0.3, 0.39, 0.25, 0.6, 0.7, 0.6, 0.39, 0.5, 0.4, 0.45],
    [20, 0.48, 0.98, 0.48, 0.35, 0.78, 0.84, 0.72, 0.58, 0.58, 0.55, 0.47],
    [30, 0.85, 1.5, 0.82, 0.5, 0.92, 1.0, 0.9, 0.7, 0.67, 0.7, 0.6],
    [40, 1.25, 1.48, 1.05, 0.8, 1.08, 1.08, 1.01, 0.78, 0.77, 0.92, 0.76],
    [50, 1.5, 1.46, 1.1, 0.98, 1.12, 1.14, 1.08, 0.8, 0.8, 1.12, 0.9]
  ];

  const index = {
    "Trigo": 1, "Trigo de invierno": 2, "Sorgo de grano": 3, "Algodón": 4,
    "Frijol": 5, "Lechuga": 6, "Zanahoria": 7, "Papa": 8, "Calabaza": 9, "Papa1": 10, "Tomate": 11
  }[cul] || 1;

  let ka = 0;
  for (let c1 = 0; c1 < tbl.length; c1++) {
    if (tbl[c1][0] > pcs) {
      const pma = tbl[c1][0], pme = tbl[c1 - 1][0];
      const la1 = pme - pma, la2 = pcs - pma;
      const pme_diff = tbl[c1 - 1][index] - tbl[c1][index];
      ka = tbl[c1][index] + (la2 * pme_diff / la1);
      return ka;
    } else if (tbl[c1][0] === pcs) {
      ka = tbl[c1][index];
      return ka;
    }
  }
  return ka;
};

// Ajuste de fórmula para Fi
const procFi = (Pi, Ti) => {
  if (isNaN(Ti) || Ti === "") return 0; // Asegura que la temperatura es válida
  return Pi * ((Ti + 17.8) / 21.8);
};

// Ajuste para la interpolación en latitudes Norte
const procInterpolarN = (lat, mesIndex) => {
  for (let i = 0; i < dataNorte.length; i++) {
    if (dataNorte[i][0] > lat) {
      const x1 = dataNorte[i - 1][0], y1 = dataNorte[i - 1][mesIndex];
      const x2 = dataNorte[i][0], y2 = dataNorte[i][mesIndex];
      return y1 + (y2 - y1) * (lat - x1) / (x2 - x1);
    }
  }
  return dataNorte[dataNorte.length - 1][mesIndex];
};

// Ajuste para la interpolación en latitudes Sur
const procInterpolarS = (lat, mesIndex) => {
  for (let i = 0; i < dataSur.length; i++) {
    if (dataSur[i][0] > lat) {
      const x1 = dataSur[i - 1][0], y1 = dataSur[i - 1][mesIndex];
      const x2 = dataSur[i][0], y2 = dataSur[i][mesIndex];
      return y1 + (y2 - y1) * (lat - x1) / (x2 - x1);
    }
  }
  return dataSur[dataSur.length - 1][mesIndex];
};

// Función para calcular resultados ajustada
const calcularResultados = (inputs) => {
  const { latitud, tipoLatitud, cultivo, crecimientoCultivo, temperaturaMes, mesSiembra } = inputs;

  if (!latitud || !cultivo || !crecimientoCultivo || !temperaturaMes || !mesSiembra) {
    return { kci: '0', fi: '0', eti: '0' }; // Asegura que todos los valores están presentes
  }

  const kci = procKCI(crecimientoCultivo, cultivo);
  const mesIndex = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].indexOf(mesSiembra) + 1;
  let pi = 0;
  if (tipoLatitud === 'Norte') {
    pi = procInterpolarN(latitud, mesIndex);
  } else {
    pi = procInterpolarS(latitud, mesIndex);
  }
  const fi = procFi(pi, temperaturaMes);
  const eti = kci * fi;
  return { kci: kci.toFixed(4), fi: fi.toFixed(4), eti: eti.toFixed(4) };
};

// Componente principal ajustado
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
    eti: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    const result = calcularResultados(inputs);
    setResultados(result);
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
      eti: ''
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
    <div style={{ width: '50%', margin: '0 auto', textAlign: 'center', marginTop: '50px' }}>

      <div>
        <label>Latitud:</label>
        <input type="number" name="latitud" value={inputs.latitud} onChange={handleInputChange} placeholder="Ingrese la latitud" />
        <select name="tipoLatitud" value={inputs.tipoLatitud} onChange={handleInputChange}>
          <option value="Norte">Norte</option>
          <option value="Sur">Sur</option>
        </select>
      </div>
      <div>
        <label>Cultivo:</label>
        <select name="cultivo" value={inputs.cultivo} onChange={handleInputChange}>
          {Object.keys(kciData).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label>% Crecimiento del Cultivo:</label>
        <input type="number" name="crecimientoCultivo" value={inputs.crecimientoCultivo} onChange={handleInputChange} placeholder="% Crecimiento del cultivo" />
      </div>
      <div>
        <label>Temperatura del Mes (°C):</label>
        <input type="number" name="temperaturaMes" value={inputs.temperaturaMes} onChange={handleInputChange} placeholder="Temperatura del mes" />
      </div>
      <div>
        <label>Mes de Siembra:</label>
        <select name="mesSiembra" value={inputs.mesSiembra} onChange={handleInputChange}>
          {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map(mes => (
            <option key={mes} value={mes}>{mes}</option>
          ))}
        </select>
      </div>
      <div>
        <button onClick={handleCalculate}>Calcular</button>
        <button onClick={handleNuevo}>Nuevo</button>
        <button onClick={handleEjemplo}>Ejemplo</button>
      </div>
      <div style={{ marginTop: '30px' }}>
        <h3>Resultados</h3>
        <div>
          <label>Kci:</label>
          <input type="text" value={resultados.kci} readOnly />
          <label>Fi:</label>
          <input type="text" value={resultados.fi} readOnly />
          <label>Eti:</label>
          <input type="text" value={resultados.eti} readOnly />
        </div>
      </div>
    </div>
  );
}

export default BlaneyCriddleParcial;


